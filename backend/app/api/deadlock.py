from fastapi import APIRouter
from pydantic import BaseModel
from app.algorithms.deadlock.banker import run_bankers_algorithm, detect_deadlock

router = APIRouter(prefix="/deadlock", tags=["deadlock"])


class BankersRequest(BaseModel):
    processes: int
    resources: int
    available: list[int]
    maximum: list[list[int]]
    allocation: list[list[int]]


class DetectRequest(BaseModel):
    processes: list[str]
    resources: list[str]
    allocation: dict[str, dict[str, int]]
    request: dict[str, dict[str, int]]


@router.post("/banker")
def banker(req: BankersRequest):
    return run_bankers_algorithm(
        req.processes, req.resources, req.available, req.maximum, req.allocation
    )


@router.post("/detect")
def detect(req: DetectRequest):
    return detect_deadlock(req.processes, req.resources, req.allocation, req.request)
