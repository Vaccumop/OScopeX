"""
Page Replacement Algorithms: FIFO, LRU, Optimal, Second Chance
"""
from typing import Optional
import uuid


def _make_step(ref: int, frames: list, fault: bool, evicted: Optional[int], hit: bool) -> dict:
    return {
        "reference": ref,
        "frames": [f for f in frames],
        "fault": fault,
        "evicted": evicted,
        "hit": hit,
    }


def fifo(reference_string: list[int], frame_count: int) -> list[dict]:
    frames: list[Optional[int]] = [None] * frame_count
    queue: list[int] = []
    steps = []
    for ref in reference_string:
        hit = ref in frames
        evicted = None
        if not hit:
            if len(queue) == frame_count:
                evicted = queue.pop(0)
                frames[frames.index(evicted)] = ref
            else:
                frames[frames.index(None)] = ref
            queue.append(ref)
        steps.append(_make_step(ref, frames[:], not hit, evicted, hit))
    return steps


def lru(reference_string: list[int], frame_count: int) -> list[dict]:
    frames: list[Optional[int]] = [None] * frame_count
    last_used: dict[int, int] = {}
    steps = []
    for t, ref in enumerate(reference_string):
        hit = ref in frames
        evicted = None
        if not hit:
            if None not in frames:
                lru_page = min((f for f in frames if f is not None), key=lambda p: last_used.get(p, -1))
                evicted = lru_page
                frames[frames.index(lru_page)] = ref
            else:
                frames[frames.index(None)] = ref
        last_used[ref] = t
        steps.append(_make_step(ref, frames[:], not hit, evicted, hit))
    return steps


def optimal(reference_string: list[int], frame_count: int) -> list[dict]:
    frames: list[Optional[int]] = [None] * frame_count
    steps = []
    for t, ref in enumerate(reference_string):
        hit = ref in frames
        evicted = None
        if not hit:
            if None not in frames:
                def next_use(p):
                    future = reference_string[t + 1:]
                    return future.index(p) if p in future else float('inf')
                victim = max((f for f in frames if f is not None), key=next_use)
                evicted = victim
                frames[frames.index(victim)] = ref
            else:
                frames[frames.index(None)] = ref
        steps.append(_make_step(ref, frames[:], not hit, evicted, hit))
    return steps


def second_chance(reference_string: list[int], frame_count: int) -> list[dict]:
    frames: list[Optional[int]] = [None] * frame_count
    ref_bits: list[bool] = [False] * frame_count
    hand = 0
    steps = []
    for ref in reference_string:
        idx = frames.index(ref) if ref in frames else -1
        hit = idx != -1
        evicted = None
        if hit:
            ref_bits[idx] = True
        else:
            # find a victim
            while True:
                if frames[hand] is None:
                    frames[hand] = ref
                    ref_bits[hand] = False
                    hand = (hand + 1) % frame_count
                    break
                elif ref_bits[hand]:
                    ref_bits[hand] = False
                    hand = (hand + 1) % frame_count
                else:
                    evicted = frames[hand]
                    frames[hand] = ref
                    ref_bits[hand] = False
                    hand = (hand + 1) % frame_count
                    break
        steps.append(_make_step(ref, frames[:], not hit, evicted, hit))
    return steps


def simulate_page_replacement(algorithm: str, reference_string: list[int], frames: int) -> dict:
    algo = algorithm.upper()
    if algo == "FIFO":
        steps = fifo(reference_string, frames)
    elif algo == "LRU":
        steps = lru(reference_string, frames)
    elif algo == "OPTIMAL":
        steps = optimal(reference_string, frames)
    elif algo in ("SECOND_CHANCE", "CLOCK"):
        steps = second_chance(reference_string, frames)
    else:
        steps = fifo(reference_string, frames)

    faults = sum(1 for s in steps if s["fault"])
    hits = sum(1 for s in steps if s["hit"])
    n = len(steps)
    return {
        "steps": steps,
        "totalFaults": faults,
        "totalHits": hits,
        "faultRatio": round(faults / n, 4) if n else 0,
        "hitRatio": round(hits / n, 4) if n else 0,
        "events": [
            {"id": str(uuid.uuid4()), "timestamp": i, "type": "PAGE_FAULT" if s["fault"] else "PAGE_HIT",
             "process": "MMU", "details": f"ref={s['reference']} {'FAULT' if s['fault'] else 'HIT'}"}
            for i, s in enumerate(steps)
        ],
    }
