from fastapi import APIRouter
from pydantic import BaseModel
from app.algorithms.disk.scheduling import simulate_disk

router = APIRouter(prefix="/disk", tags=["disk"])


class DiskRequest(BaseModel):
    algorithm: str
    initial_head: int
    disk_size: int = 200
    requests: list[int]
    direction: str = "right"


@router.post("/simulate")
def simulate(req: DiskRequest):
    return simulate_disk(req.algorithm, req.initial_head, req.disk_size, req.requests, req.direction)
