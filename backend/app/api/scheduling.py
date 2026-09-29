from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.algorithms.cpu.scheduling import simulate_scheduling

router = APIRouter(prefix="/scheduling", tags=["scheduling"])


class ProcessIn(BaseModel):
    pid: int
    name: str
    arrival_time: int
    burst_time: int
    priority: int = 1
    io_burst: int = 0


class SchedulingConfig(BaseModel):
    algorithm: str
    quantum: int = 2
    preemptive: bool = False


class SchedulingRequest(BaseModel):
    processes: list[ProcessIn]
    config: SchedulingConfig


class CompareRequest(BaseModel):
    processes: list[ProcessIn]
    configs: list[SchedulingConfig]


@router.post("/simulate")
def simulate(req: SchedulingRequest):
    procs = [p.model_dump() for p in req.processes]
    return simulate_scheduling(
        algorithm=req.config.algorithm,
        processes=procs,
        quantum=req.config.quantum,
        preemptive=req.config.preemptive,
    )


@router.post("/compare")
def compare(req: CompareRequest):
    procs = [p.model_dump() for p in req.processes]
    results = []
    for cfg in req.configs:
        result = simulate_scheduling(cfg.algorithm, procs, cfg.quantum, cfg.preemptive)
        result["config"] = cfg.model_dump()
        results.append(result)
    return results
