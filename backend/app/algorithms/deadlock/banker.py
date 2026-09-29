"""
Banker's Algorithm + Deadlock Detection
"""
from typing import Optional
import uuid


def run_bankers_algorithm(
    processes: int,
    resources: int,
    available: list[int],
    maximum: list[list[int]],
    allocation: list[list[int]],
) -> dict:
    # Validate
    for i in range(processes):
        for j in range(resources):
            if allocation[i][j] > maximum[i][j]:
                return {"safe": False, "safeSequence": [], "needMatrix": [], "steps": [],
                        "error": f"Allocation[{i}][{j}] exceeds Maximum"}

    need = [[maximum[i][j] - allocation[i][j] for j in range(resources)] for i in range(processes)]
    work = list(available)
    finish = [False] * processes
    safe_sequence: list[int] = []
    steps = []

    progress = True
    while progress and len(safe_sequence) < processes:
        progress = False
        for i in range(processes):
            if not finish[i] and all(need[i][j] <= work[j] for j in range(resources)):
                prev_work = list(work)
                for j in range(resources):
                    work[j] += allocation[i][j]
                finish[i] = True
                safe_sequence.append(i)
                steps.append({
                    "process": i,
                    "work": list(work),
                    "finish": list(finish),
                    "need": need[i][:],
                    "allocated": True,
                })
                progress = True
                break

    safe = len(safe_sequence) == processes
    return {
        "safe": safe,
        "safeSequence": safe_sequence,
        "needMatrix": need,
        "steps": steps,
    }


def detect_deadlock(
    processes: list[str],
    resources: list[str],
    allocation: dict[str, dict[str, int]],
    request: dict[str, dict[str, int]],
) -> dict:
    """Detect cycles in Resource Allocation Graph using DFS."""
    visited: set[str] = set()
    rec_stack: set[str] = set()
    cycle_nodes: list[str] = []

    def get_neighbors(node: str) -> list[str]:
        neighbors = []
        if node in processes:
            # process → resource (request edge)
            for r in resources:
                if request.get(node, {}).get(r, 0) > 0:
                    neighbors.append(r)
        else:
            # resource → process (allocation edge)
            for p in processes:
                if allocation.get(p, {}).get(node, 0) > 0:
                    neighbors.append(p)
        return neighbors

    def dfs(node: str) -> bool:
        visited.add(node)
        rec_stack.add(node)
        for nb in get_neighbors(node):
            if nb not in visited:
                if dfs(nb):
                    cycle_nodes.append(nb)
                    return True
            elif nb in rec_stack:
                cycle_nodes.append(nb)
                return True
        rec_stack.discard(node)
        return False

    deadlocked = False
    for n in processes + resources:
        if n not in visited:
            if dfs(n):
                deadlocked = True
                break

    involved_procs = [n for n in cycle_nodes if n in processes]
    involved_res = [n for n in cycle_nodes if n in resources]

    return {
        "deadlocked": deadlocked,
        "cycle": cycle_nodes,
        "involvedProcesses": involved_procs,
        "involvedResources": involved_res,
    }
