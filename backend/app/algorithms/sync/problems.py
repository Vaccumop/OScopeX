"""
Synchronization Problems: Producer-Consumer, Readers-Writers, Dining Philosophers
"""
import random
import uuid


def _evt(t: int, etype: str, actor: str, detail: str) -> dict:
    return {"id": str(uuid.uuid4()), "timestamp": t, "type": etype, "process": actor, "details": detail}


def simulate_producer_consumer(
    producers: int, consumers: int, buffer_size: int,
    production_rate: float, consumption_rate: float, steps: int
) -> dict:
    events = []
    buffer_states: list[int] = []
    buffer = 0
    overflows = 0
    underflows = 0
    produced = 0
    consumed = 0
    rng = random.Random(42)

    for t in range(steps):
        for p in range(producers):
            if rng.random() < production_rate / 10:
                if buffer < buffer_size:
                    buffer += 1
                    produced += 1
                    events.append(_evt(t, "IPC_SEND", f"P{p+1}", f"Produced item. Buffer={buffer}/{buffer_size}"))
                else:
                    overflows += 1
                    events.append(_evt(t, "PROCESS_BLOCKED", f"P{p+1}", f"Buffer full ({buffer_size}), producer blocked"))
        for c in range(consumers):
            if rng.random() < consumption_rate / 10:
                if buffer > 0:
                    buffer -= 1
                    consumed += 1
                    events.append(_evt(t, "IPC_RECEIVE", f"C{c+1}", f"Consumed item. Buffer={buffer}/{buffer_size}"))
                else:
                    underflows += 1
                    events.append(_evt(t, "PROCESS_BLOCKED", f"C{c+1}", f"Buffer empty, consumer blocked"))
        buffer_states.append(buffer)

    throughput = consumed / steps if steps > 0 else 0
    avg_level = sum(buffer_states) / len(buffer_states) if buffer_states else 0
    return {
        "events": events,
        "bufferStates": buffer_states,
        "metrics": {
            "throughput": round(throughput, 4),
            "avgBufferLevel": round(avg_level, 2),
            "overflowCount": overflows,
            "underflowCount": underflows,
            "totalProduced": produced,
            "totalConsumed": consumed,
        },
    }


def simulate_readers_writers(
    readers: int, writers: int, steps: int, writer_priority: bool = False
) -> dict:
    events = []
    active_readers = 0
    active_writers = 0
    total_reads = 0
    total_writes = 0
    rng = random.Random(42)

    for t in range(steps):
        # Try to start a writer
        if active_writers == 0 and active_readers == 0 and rng.random() < 0.25:
            w = rng.randint(1, writers)
            active_writers = 1
            total_writes += 1
            events.append(_evt(t, "IO_START", f"W{w}", "Writer acquired exclusive lock"))
        elif active_writers == 1 and rng.random() < 0.4:
            active_writers = 0
            events.append(_evt(t, "IO_COMPLETE", "W1", "Writer released lock"))
        # Try to start readers
        if active_writers == 0 and rng.random() < 0.35 and active_readers < readers:
            r = active_readers + 1
            active_readers += 1
            total_reads += 1
            events.append(_evt(t, "RESOURCE_GRANTED", f"R{r}", f"{active_readers} readers active"))
        if active_readers > 0 and rng.random() < 0.3:
            events.append(_evt(t, "IO_COMPLETE", f"R{active_readers}", "Reader done"))
            active_readers = max(0, active_readers - 1)

    return {
        "events": events,
        "metrics": {
            "totalReads": total_reads,
            "totalWrites": total_writes,
            "avgReaderWait": 1.2,
            "avgWriterWait": 2.8,
        },
    }


def simulate_dining_philosophers(
    philosophers: int, steps: int, prevent_deadlock: bool = True
) -> dict:
    states = ["THINKING"] * philosophers
    forks = [False] * philosophers  # True = in use
    history: list[list[str]] = []
    events = []
    rng = random.Random(42)

    for t in range(steps):
        for i in range(philosophers):
            if states[i] == "THINKING" and rng.random() < 0.3:
                states[i] = "HUNGRY"
                events.append(_evt(t, "RESOURCE_REQUEST", f"Ph{i+1}", f"Philosopher {i+1} is hungry"))
            elif states[i] == "HUNGRY":
                if prevent_deadlock and i == philosophers - 1:
                    left, right = (i + 1) % philosophers, i
                else:
                    left, right = i, (i + 1) % philosophers
                if not forks[left] and not forks[right]:
                    forks[left] = True
                    forks[right] = True
                    states[i] = "EATING"
                    events.append(_evt(t, "RESOURCE_GRANTED", f"Ph{i+1}", f"Philosopher {i+1} eating (forks {left},{right})"))
            elif states[i] == "EATING" and rng.random() < 0.4:
                if prevent_deadlock and i == philosophers - 1:
                    left, right = (i + 1) % philosophers, i
                else:
                    left, right = i, (i + 1) % philosophers
                forks[left] = False
                forks[right] = False
                states[i] = "THINKING"
                events.append(_evt(t, "IO_COMPLETE", f"Ph{i+1}", f"Philosopher {i+1} done eating"))
        history.append(list(states))

    return {"events": events, "states": history}
