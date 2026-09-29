from fastapi import APIRouter
from pydantic import BaseModel
from app.algorithms.sync.problems import (
    simulate_producer_consumer,
    simulate_readers_writers,
    simulate_dining_philosophers,
)

router = APIRouter(prefix="/sync", tags=["sync"])


class PCRequest(BaseModel):
    producers: int = 2
    consumers: int = 2
    buffer_size: int = 5
    production_rate: float = 3.0
    consumption_rate: float = 2.0
    steps: int = 30


class RWRequest(BaseModel):
    readers: int = 3
    writers: int = 2
    steps: int = 30
    writer_priority: bool = False


class DPRequest(BaseModel):
    philosophers: int = 5
    steps: int = 20
    prevent_deadlock: bool = True


@router.post("/producer-consumer")
def pc(req: PCRequest):
    return simulate_producer_consumer(
        req.producers, req.consumers, req.buffer_size,
        req.production_rate, req.consumption_rate, req.steps,
    )


@router.post("/readers-writers")
def rw(req: RWRequest):
    return simulate_readers_writers(req.readers, req.writers, req.steps, req.writer_priority)


@router.post("/dining-philosophers")
def dp(req: DPRequest):
    return simulate_dining_philosophers(req.philosophers, req.steps, req.prevent_deadlock)
