"""
CPU Scheduling Algorithms
Implements: FCFS, SJF, SRTF, RR, PRIORITY, MLQ, MLFQ
"""
from dataclasses import dataclass, field
from typing import Optional
from collections import deque
import uuid


@dataclass
class ProcessInput:
    pid: int
    name: str
    arrival_time: int
    burst_time: int
    priority: int = 1
    io_burst: int = 0


@dataclass
class GanttSlot:
    pid: int
    name: str
    start: int
    end: int


@dataclass
class ProcessMetric:
    pid: int
    name: str
    arrival_time: int
    burst_time: int
    completion_time: int
    turnaround_time: int
    waiting_time: int
    response_time: int


@dataclass
class SchedulingMetrics:
    avg_waiting_time: float
    avg_turnaround_time: float
    avg_response_time: float
    cpu_utilization: float
    throughput: float
    context_switches: int
    process_metrics: list


@dataclass
class SimEvent:
    id: str
    timestamp: int
    type: str
    process: str
    details: str
    explanation: str = ""


def _make_event(t: int, etype: str, proc: str, detail: str, expl: str = "") -> dict:
    return {"id": str(uuid.uuid4()), "timestamp": t, "type": etype, "process": proc, "details": detail, "explanation": expl}


def _calc_metrics(processes: list[ProcessInput], gantt: list[GanttSlot], events: list[dict]) -> dict:
    n = len(processes)
    pid_map = {p.pid: p for p in processes}
    completion = {}
    first_start = {}

    for slot in gantt:
        pid = slot.pid
        if pid not in first_start:
            first_start[pid] = slot.start
        completion[pid] = slot.end

    total_time = max((s.end for s in gantt), default=1)
    total_burst = sum(p.burst_time for p in processes)

    proc_metrics = []
    waits, tats, resps = [], [], []
    for p in processes:
        ct = completion.get(p.pid, p.arrival_time + p.burst_time)
        tat = ct - p.arrival_time
        wt = tat - p.burst_time
        rt = first_start.get(p.pid, ct) - p.arrival_time
        proc_metrics.append({
            "pid": p.pid, "name": p.name,
            "arrivalTime": p.arrival_time, "burstTime": p.burst_time,
            "completionTime": ct, "turnaroundTime": tat,
            "waitingTime": max(0, wt), "responseTime": max(0, rt),
        })
        waits.append(max(0, wt)); tats.append(tat); resps.append(max(0, rt))

    # count context switches = gantt slots - 1 (excluding idle)
    switches = max(0, len(gantt) - 1)

    return {
        "avgWaitingTime": round(sum(waits) / n, 2) if n else 0,
        "avgTurnaroundTime": round(sum(tats) / n, 2) if n else 0,
        "avgResponseTime": round(sum(resps) / n, 2) if n else 0,
        "cpuUtilization": round((total_burst / total_time) * 100, 2) if total_time else 0,
        "throughput": round(n / total_time, 4) if total_time else 0,
        "contextSwitches": switches,
        "processMetrics": proc_metrics,
    }


def _gantt_to_dict(gantt: list[GanttSlot]) -> list[dict]:
    return [{"pid": s.pid, "name": s.name, "start": s.start, "end": s.end} for s in gantt]


# ── FCFS ────────────────────────────────────────────────────────
def fcfs(processes: list[ProcessInput]) -> tuple[list[GanttSlot], list[dict]]:
    sorted_p = sorted(processes, key=lambda p: (p.arrival_time, p.pid))
    gantt, events = [], []
    time = 0
    for p in sorted_p:
        if time < p.arrival_time:
            time = p.arrival_time
        events.append(_make_event(time, "CPU_START", p.name, f"P{p.pid} starts running", f"FCFS dispatches {p.name} at t={time}"))
        gantt.append(GanttSlot(p.pid, p.name, time, time + p.burst_time))
        time += p.burst_time
        events.append(_make_event(time, "PROCESS_TERMINATED", p.name, f"P{p.pid} completes at t={time}", ""))
    return gantt, events


# ── SJF (non-preemptive) ─────────────────────────────────────────
def sjf(processes: list[ProcessInput]) -> tuple[list[GanttSlot], list[dict]]:
    remaining = list(processes)
    gantt, events = [], []
    time = 0
    done = 0
    while done < len(processes):
        available = [p for p in remaining if p.arrival_time <= time]
        if not available:
            time += 1
            continue
        p = min(available, key=lambda x: (x.burst_time, x.pid))
        remaining.remove(p)
        events.append(_make_event(time, "CPU_START", p.name, f"SJF selects P{p.pid} (burst={p.burst_time})", ""))
        gantt.append(GanttSlot(p.pid, p.name, time, time + p.burst_time))
        time += p.burst_time
        events.append(_make_event(time, "PROCESS_TERMINATED", p.name, f"P{p.pid} done at t={time}", ""))
        done += 1
    return gantt, events


# ── SRTF (preemptive SJF) ───────────────────────────────────────
def srtf(processes: list[ProcessInput]) -> tuple[list[GanttSlot], list[dict]]:
    remaining = {p.pid: p.burst_time for p in processes}
    proc_map = {p.pid: p for p in processes}
    gantt, events = [], []
    time = 0
    current_pid = None
    slot_start = 0
    total_time = sum(p.burst_time for p in processes) + max(p.arrival_time for p in processes) + 2

    for t in range(total_time):
        arrived = [p for p in processes if p.arrival_time <= t and remaining.get(p.pid, 0) > 0]
        if not arrived:
            if current_pid is not None:
                if gantt and gantt[-1].pid == current_pid:
                    gantt[-1] = GanttSlot(gantt[-1].pid, gantt[-1].name, gantt[-1].start, t)
                current_pid = None
            continue
        best = min(arrived, key=lambda p: (remaining[p.pid], p.pid))
        if best.pid != current_pid:
            if current_pid is not None:
                prev = proc_map[current_pid]
                if gantt and gantt[-1].pid == current_pid and gantt[-1].end == t:
                    pass
                else:
                    gantt.append(GanttSlot(current_pid, prev.name, slot_start, t))
                events.append(_make_event(t, "CONTEXT_SWITCH", best.name, f"Preempt P{current_pid}→P{best.pid}", ""))
            slot_start = t
            current_pid = best.pid
        remaining[best.pid] -= 1
        if remaining[best.pid] == 0:
            gantt.append(GanttSlot(best.pid, best.name, slot_start, t + 1))
            events.append(_make_event(t + 1, "PROCESS_TERMINATED", best.name, f"P{best.pid} done", ""))
            current_pid = None

    # merge consecutive same-pid slots
    merged = []
    for slot in gantt:
        if merged and merged[-1].pid == slot.pid and merged[-1].end == slot.start:
            merged[-1] = GanttSlot(merged[-1].pid, merged[-1].name, merged[-1].start, slot.end)
        else:
            merged.append(slot)
    return merged, events


# ── Round Robin ─────────────────────────────────────────────────
def round_robin(processes: list[ProcessInput], quantum: int = 2) -> tuple[list[GanttSlot], list[dict]]:
    remaining = {p.pid: p.burst_time for p in processes}
    proc_map = {p.pid: p for p in processes}
    gantt, events = [], []
    ready: deque = deque()
    time = 0
    sorted_p = sorted(processes, key=lambda p: p.arrival_time)
    idx = 0  # next process to arrive

    def enqueue_arrived():
        nonlocal idx
        while idx < len(sorted_p) and sorted_p[idx].arrival_time <= time:
            ready.append(sorted_p[idx].pid)
            idx += 1

    enqueue_arrived()
    while ready or idx < len(sorted_p):
        if not ready:
            time = sorted_p[idx].arrival_time
            enqueue_arrived()
        pid = ready.popleft()
        p = proc_map[pid]
        run = min(quantum, remaining[pid])
        events.append(_make_event(time, "CPU_START", p.name, f"RR runs P{pid} for {run}ms", f"q={quantum}"))
        gantt.append(GanttSlot(pid, p.name, time, time + run))
        time += run
        remaining[pid] -= run
        enqueue_arrived()
        if remaining[pid] > 0:
            ready.append(pid)
        else:
            events.append(_make_event(time, "PROCESS_TERMINATED", p.name, f"P{pid} done at t={time}", ""))
    return gantt, events


# ── Priority (non-preemptive) ────────────────────────────────────
def priority_np(processes: list[ProcessInput]) -> tuple[list[GanttSlot], list[dict]]:
    remaining = list(processes)
    gantt, events = [], []
    time = 0
    while remaining:
        available = [p for p in remaining if p.arrival_time <= time]
        if not available:
            time += 1
            continue
        p = min(available, key=lambda x: (x.priority, x.pid))
        remaining.remove(p)
        events.append(_make_event(time, "CPU_START", p.name, f"Priority selects P{p.pid} (pri={p.priority})", ""))
        gantt.append(GanttSlot(p.pid, p.name, time, time + p.burst_time))
        time += p.burst_time
        events.append(_make_event(time, "PROCESS_TERMINATED", p.name, f"P{p.pid} done", ""))
    return gantt, events


# ── MLQ (Multilevel Queue) ───────────────────────────────────────
def mlq(processes: list[ProcessInput]) -> tuple[list[GanttSlot], list[dict]]:
    # Q0: priority 1-2, RR q=2; Q1: priority 3-4, FCFS; Q2: others, FCFS
    def get_queue(p: ProcessInput) -> int:
        if p.priority <= 2: return 0
        if p.priority <= 4: return 1
        return 2

    queues: list[list[ProcessInput]] = [[], [], []]
    for p in processes:
        queues[get_queue(p)].append(p)
    for q in queues:
        q.sort(key=lambda p: p.arrival_time)

    all_gantt, all_events = [], []
    for qi, queue in enumerate(queues):
        if not queue:
            continue
        if qi == 0:
            g, e = round_robin(queue, quantum=2)
        else:
            g, e = fcfs(queue)
        all_gantt.extend(g)
        all_events.extend(e)

    all_gantt.sort(key=lambda s: s.start)
    return all_gantt, all_events


# ── MLFQ (Multilevel Feedback Queue) ────────────────────────────
def mlfq(processes: list[ProcessInput]) -> tuple[list[GanttSlot], list[dict]]:
    quanta = [2, 4, 8]
    queues: list[deque] = [deque(), deque(), deque()]
    remaining = {p.pid: p.burst_time for p in processes}
    queue_level = {p.pid: 0 for p in processes}
    proc_map = {p.pid: p for p in processes}
    gantt, events = [], []
    time = 0
    sorted_p = sorted(processes, key=lambda p: p.arrival_time)
    idx = 0

    def enqueue_arrived():
        nonlocal idx
        while idx < len(sorted_p) and sorted_p[idx].arrival_time <= time:
            queues[0].append(sorted_p[idx].pid)
            idx += 1

    enqueue_arrived()
    while any(queues) or idx < len(sorted_p):
        # find highest non-empty queue
        selected_q = None
        for qi in range(3):
            if queues[qi]:
                selected_q = qi
                break
        if selected_q is None:
            time = sorted_p[idx].arrival_time
            enqueue_arrived()
            continue
        pid = queues[selected_q].popleft()
        p = proc_map[pid]
        q = quanta[selected_q]
        run = min(q, remaining[pid])
        events.append(_make_event(time, "CPU_START", p.name, f"MLFQ Q{selected_q} runs P{pid} for {run}ms", f"quantum={q}"))
        gantt.append(GanttSlot(pid, p.name, time, time + run))
        time += run
        remaining[pid] -= run
        enqueue_arrived()
        if remaining[pid] > 0:
            next_q = min(selected_q + 1, 2)
            queue_level[pid] = next_q
            queues[next_q].append(pid)
            events.append(_make_event(time, "CONTEXT_SWITCH", p.name, f"P{pid} demoted to Q{next_q}", ""))
        else:
            events.append(_make_event(time, "PROCESS_TERMINATED", p.name, f"P{pid} done at t={time}", ""))
    return gantt, events


# ── Dispatcher ──────────────────────────────────────────────────
def simulate_scheduling(algorithm: str, processes: list[dict], quantum: int = 2, preemptive: bool = False) -> dict:
    procs = [ProcessInput(**{k: v for k, v in p.items() if k in ProcessInput.__dataclass_fields__}) for p in processes]

    algo = algorithm.upper()
    if algo == "FCFS":
        gantt, events = fcfs(procs)
    elif algo == "SJF":
        gantt, events = sjf(procs)
    elif algo == "SRTF":
        gantt, events = srtf(procs)
    elif algo == "RR":
        gantt, events = round_robin(procs, quantum=quantum)
    elif algo == "PRIORITY":
        gantt, events = priority_np(procs)
    elif algo == "MLQ":
        gantt, events = mlq(procs)
    elif algo == "MLFQ":
        gantt, events = mlfq(procs)
    else:
        gantt, events = fcfs(procs)

    metrics = _calc_metrics(procs, gantt, events)
    return {
        "gantt": _gantt_to_dict(gantt),
        "metrics": metrics,
        "events": events,
    }
