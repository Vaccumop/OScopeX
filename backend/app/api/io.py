from fastapi import APIRouter
from pydantic import BaseModel
import uuid, random

router = APIRouter(prefix="/io", tags=["io"])


class IOBufferRequest(BaseModel):
    mode: str = "single"
    buffer_size: int = 10
    producer_rate: float = 5.0
    consumer_rate: float = 4.0
    steps: int = 50


@router.post("/buffer")
def io_buffer(req: IOBufferRequest):
    rng = random.Random(42)
    events = []
    history: list[int] = []
    buf = 0
    overflows = 0
    underflows = 0
    produced = 0
    consumed = 0

    for t in range(req.steps):
        produce = rng.random() < req.producer_rate / 10
        consume = rng.random() < req.consumer_rate / 10
        if produce:
            if buf < req.buffer_size:
                buf += 1; produced += 1
                events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "IO_START", "process": "Producer", "details": f"buf={buf}"})
            else:
                overflows += 1
                events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "BUFFER_FULL", "process": "Producer", "details": "Overflow"})
        if consume:
            if buf > 0:
                buf -= 1; consumed += 1
                events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "IO_COMPLETE", "process": "Consumer", "details": f"buf={buf}"})
            else:
                underflows += 1
                events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "BUFFER_EMPTY", "process": "Consumer", "details": "Underflow"})
        history.append(buf)

    return {
        "events": events,
        "bufferHistory": history,
        "metrics": {
            "throughput": round(consumed / req.steps, 4),
            "avgFill": round(sum(history) / len(history), 2) if history else 0,
            "overflows": overflows,
            "underflows": underflows,
        },
    }
