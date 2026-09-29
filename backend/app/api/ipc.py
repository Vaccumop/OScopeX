from fastapi import APIRouter
from pydantic import BaseModel
import uuid, random

router = APIRouter(prefix="/ipc", tags=["ipc"])


class IPCRequest(BaseModel):
    mechanism: str = "PIPE"
    sender_count: int = 2
    receiver_count: int = 2
    message_count: int = 10
    buffer_size: int = 5


@router.post("/simulate")
def simulate_ipc(req: IPCRequest):
    events = []
    buffer: list[str] = []
    sent = 0
    received = 0
    blocked = 0
    rng = random.Random(42)

    for i in range(req.message_count):
        sender = f"S{(i % req.sender_count) + 1}"
        receiver = f"R{(i % req.receiver_count) + 1}"
        content = f"msg_{i + 1}"
        t = round(i * 0.5, 1)

        if req.mechanism in ("PIPE", "MESSAGE_QUEUE"):
            if len(buffer) < req.buffer_size:
                buffer.append(content)
                sent += 1
                events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "IPC_SEND", "sender": sender, "receiver": "BUFFER", "content": content})
            else:
                blocked += 1
                events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "BLOCKED", "sender": sender, "receiver": "BUFFER", "content": "Buffer full"})
            if buffer and rng.random() > 0.3:
                msg = buffer.pop(0)
                received += 1
                events.append({"id": str(uuid.uuid4()), "timestamp": t + 0.2, "type": "IPC_RECEIVE", "sender": "BUFFER", "receiver": receiver, "content": msg})
        elif req.mechanism == "SHARED_MEMORY":
            events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "WRITE", "sender": sender, "receiver": "SHM", "content": content})
            events.append({"id": str(uuid.uuid4()), "timestamp": t + 0.1, "type": "READ", "sender": "SHM", "receiver": receiver, "content": content})
            sent += 1; received += 1
        else:
            events.append({"id": str(uuid.uuid4()), "timestamp": t, "type": "SIGNAL", "sender": sender, "receiver": receiver, "content": "SIGUSR1"})

    return {
        "events": events,
        "metrics": {"sent": sent, "received": received, "blocked": blocked, "mechanism": req.mechanism},
    }
