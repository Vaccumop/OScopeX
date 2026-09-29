from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.algorithms.cpu.scheduling import simulate_scheduling
from app.algorithms.memory.page_replacement import simulate_page_replacement
from app.algorithms.disk.scheduling import simulate_disk

router = APIRouter(prefix="/whatif", tags=["whatif"])


class WhatIfConfig(BaseModel):
    algorithm: str
    quantum: int = 2
    frames: int = 3
    direction: str = "right"


class WhatIfRequest(BaseModel):
    module: str
    baseline_config: WhatIfConfig
    alternative_config: WhatIfConfig
    workload: Optional[dict] = None


@router.post("/compare")
def whatif_compare(req: WhatIfRequest):
    module = req.module.lower().replace(" ", "_").replace("-", "_")

    def run_one(cfg: WhatIfConfig) -> dict:
        if module == "scheduling":
            procs = req.workload.get("processes", []) if req.workload else []
            r = simulate_scheduling(cfg.algorithm, procs, cfg.quantum)
            return r.get("metrics", {})
        elif module in ("page_replacement", "memory"):
            refs = req.workload.get("referenceString", [7,0,1,2,0,3,0,4,2,3,0,3]) if req.workload else []
            r = simulate_page_replacement(cfg.algorithm, refs, cfg.frames)
            return {"faults": r["totalFaults"], "hits": r["totalHits"], "hitRatio": r["hitRatio"]}
        elif module == "disk":
            reqs = req.workload.get("requests", [98,183,37,122,14,124,65]) if req.workload else []
            head = req.workload.get("initialHead", 53) if req.workload else 53
            r = simulate_disk(cfg.algorithm, head, 200, reqs, cfg.direction)
            return {"totalSeekDistance": r["totalSeekDistance"], "avgSeekDistance": r["avgSeekDistance"]}
        return {}

    baseline = run_one(req.baseline_config)
    alternative = run_one(req.alternative_config)

    diff = {}
    for key in set(list(baseline.keys()) + list(alternative.keys())):
        bv = baseline.get(key, 0) or 0
        av = alternative.get(key, 0) or 0
        if isinstance(bv, (int, float)) and isinstance(av, (int, float)):
            absolute = round(av - bv, 4)
            pct = round(((av - bv) / bv) * 100, 2) if bv != 0 else 0
            diff[key] = {"absolute": absolute, "percent": pct}

    return {"baseline": baseline, "alternative": alternative, "diff": diff}
