"""
Disk Scheduling Algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK
"""
import uuid


def _seek_dist(seq: list[int]) -> int:
    return sum(abs(seq[i] - seq[i-1]) for i in range(1, len(seq)))


def fcfs_disk(head: int, requests: list[int]) -> list[int]:
    return [head] + list(requests)


def sstf_disk(head: int, requests: list[int]) -> list[int]:
    seq = [head]
    remaining = list(requests)
    cur = head
    while remaining:
        nearest = min(remaining, key=lambda r: abs(r - cur))
        seq.append(nearest)
        cur = nearest
        remaining.remove(nearest)
    return seq


def scan_disk(head: int, requests: list[int], disk_size: int, direction: str = "right") -> list[int]:
    sorted_r = sorted(requests)
    left = [r for r in sorted_r if r < head]
    right = [r for r in sorted_r if r >= head]
    if direction == "right":
        seq = [head] + right + list(reversed(left))
    else:
        seq = [head] + list(reversed(left)) + right
    return seq


def cscan_disk(head: int, requests: list[int], disk_size: int) -> list[int]:
    sorted_r = sorted(requests)
    right = [r for r in sorted_r if r >= head]
    left = [r for r in sorted_r if r < head]
    return [head] + right + left


def look_disk(head: int, requests: list[int], direction: str = "right") -> list[int]:
    sorted_r = sorted(requests)
    left = [r for r in sorted_r if r < head]
    right = [r for r in sorted_r if r >= head]
    if direction == "right":
        return [head] + right + list(reversed(left))
    else:
        return [head] + list(reversed(left)) + right


def clook_disk(head: int, requests: list[int]) -> list[int]:
    sorted_r = sorted(requests)
    right = [r for r in sorted_r if r >= head]
    left = [r for r in sorted_r if r < head]
    return [head] + right + left


def simulate_disk(
    algorithm: str,
    initial_head: int,
    disk_size: int,
    requests: list[int],
    direction: str = "right",
) -> dict:
    algo = algorithm.upper().replace("-", "").replace("_", "")
    if algo == "FCFS":
        seq = fcfs_disk(initial_head, requests)
    elif algo == "SSTF":
        seq = sstf_disk(initial_head, requests)
    elif algo == "SCAN":
        seq = scan_disk(initial_head, requests, disk_size, direction)
    elif algo == "CSCAN":
        seq = cscan_disk(initial_head, requests, disk_size)
    elif algo == "LOOK":
        seq = look_disk(initial_head, requests, direction)
    elif algo == "CLOOK":
        seq = clook_disk(initial_head, requests)
    else:
        seq = fcfs_disk(initial_head, requests)

    total = _seek_dist(seq)
    n = len(seq) - 1
    avg = round(total / n, 2) if n > 0 else 0

    events = []
    for i in range(1, len(seq)):
        events.append({
            "id": str(uuid.uuid4()),
            "timestamp": i,
            "type": "IO_START",
            "process": "DiskHead",
            "details": f"Track {seq[i-1]} → {seq[i]}, dist={abs(seq[i]-seq[i-1])}",
        })

    return {
        "seekSequence": seq,
        "serviceOrder": seq[1:],
        "totalSeekDistance": total,
        "avgSeekDistance": avg,
        "events": events,
    }
