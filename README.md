# OScopeX — Web-Based Operating System Digital Twin & Interactive What-If Experimentation Platform

> A production-grade virtual operating system environment that simulates, visualizes, and benchmarks CPU scheduling, process management, synchronization, deadlocks, virtual memory, page replacement, inter-process communication, I/O buffering, and disk scheduling.

---

## 🌟 Key Modules & Features

1. **Live Dashboard & Digital Twin Monitor**:
   - Real-time CPU utilization timeline (Recharts dynamic area chart)
   - Process distribution by state (New, Ready, Running, Blocked, Suspended, Terminated)
   - Physical RAM frame allocation map (32 physical frames with PID, page number, dirty/referenced status)
   - Disk head position radar & seek visualizer
   - Live Event Log stream with colored OS telemetry markers

2. **Process Manager & PCB Inspector**:
   - Process Control Block (PCB) inspector: Registers (AX, BX, CX, DX), Program Counter (Hex), memory requirements, arrival & burst times
   - Interactive process state transition diagram (SVG with animated state lines)
   - Process lifecycle controls (Create, Run, Block, Suspend, Terminate, Delete)

3. **CPU Scheduling Simulator**:
   - Algorithms: **FCFS, SJF (non-preemptive), SRTF (preemptive SJF), Round Robin (configurable quantum), Priority, Multilevel Queue (MLQ), Multilevel Feedback Queue (MLFQ)**
   - High-fidelity interactive Gantt Chart with time markers and process color-coding
   - Metrics Engine: Average Waiting Time, Average Turnaround Time, Average Response Time, CPU Utilization %, Throughput, Context Switches
   - Built-in workload presets + custom workload table editor

4. **Synchronization Lab**:
   - **Producer-Consumer**: Bounded buffer with visual slots, mutex/semaphore blocking, overflow/underflow metrics
   - **Readers-Writers**: Starvation avoidance, writer priority toggle, reader/writer timeline
   - **Dining Philosophers**: Circular dining table SVG with Dijkstra's asymmetric deadlock prevention algorithm

5. **Deadlock Analysis & Banker's Algorithm**:
   - Full **Banker's Safety Algorithm** with step-by-step matrix evaluation (Allocation, Maximum, Need, Available)
   - Safe sequence generator (e.g., `P1 → P3 → P4 → P0 → P2`)
   - Resource Allocation Graph (RAG) visualizer with cycle detection and automatic recovery recommendations

6. **Virtual Memory & Address Translation**:
   - Visual MMU Translation Pipeline: `Virtual Address → [Page # | Offset] → TLB Lookup → Page Table → Physical Address`
   - Configurable bit width (8-bit to 32-bit), page size (4B to 4KB), physical frames, and TLB entries
   - TLB hit/miss and Page Fault counters with hit ratio statistics

7. **Page Replacement Simulator**:
   - Algorithms: **FIFO, LRU, Optimal (Belady's benchmark), Second Chance (Clock)**
   - Step-by-step frame state table with hit/fault badges and evicted victim indicators
   - Multi-algorithm side-by-side benchmark comparison chart

8. **Inter-Process Communication (IPC)**:
   - **Pipes**: Unidirectional byte stream with buffer capacity constraints
   - **Message Queues**: Priority-ordered message queue visualization
   - **Shared Memory**: Simulated concurrent read/write access with mutex protection
   - **Signals**: Interactive signal dispatch (`SIGINT`, `SIGTERM`, `SIGSTOP`, `SIGCONT`, `SIGUSR1`, `SIGKILL`)

9. **I/O Buffering & Disk Scheduling**:
   - Single Buffer, Double Buffer (alternating), and Circular Ring Buffer simulations
   - Disk Scheduling algorithms: **FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, C-LOOK**
   - Disk track visualization with head movement path and total seek distance computation

10. **What-If Experimentation Lab**:
    - Dual split-screen experimentation workbench (Baseline vs. Alternative configuration)
    - Benchmarking across CPU Scheduling, Page Replacement, and Disk Scheduling
    - Metric delta table highlighting % improvement or degradation

11. **Learn OS Interactive Textbook**:
    - 11 guided conceptual modules covering fundamental OS theory, real-world analogies, and direct links into the corresponding simulation tools

---

## 🚀 Port Allocation

| Component | Port | URL |
|---|---|---|
| **Frontend** (Vite + React) | **5174** | [http://localhost:5174](http://localhost:5174) |
| **Backend** (FastAPI) | **8001** | [http://localhost:8001](http://localhost:8001) |
| **API Documentation** (Swagger) | **8001** | [http://localhost:8001/docs](http://localhost:8001/docs) |

*(Note: Custom ports 5174 and 8001 avoid conflicts with other local dev servers on 5173/8000).*

---

## ⚡ How to Run

### Method 1: One-Click Launch (Windows)
Double-click `start.bat` in the project root:
```bat
start.bat
```
This automatically launches both the backend and frontend in separate command windows.

---

### Method 2: Manual Terminal Commands

#### 1. Start the Backend
Open a terminal in the project directory:
```powershell
cd backend
.\venv\Scripts\python run.py
```
> Backend runs at `http://localhost:8001` (SQLite database `oscope.db` is automatically created).

#### 2. Start the Frontend
Open a second terminal in the project directory:
```powershell
cd frontend
npm run dev
```
> Frontend runs at `http://localhost:5174`.

Now open your browser and navigate to **`http://localhost:5174`**!

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide React, Zustand, React Router DOM, Axios
- **Backend**: Python 3.11, FastAPI, Uvicorn, SQLAlchemy, SQLite, Pydantic v2
- **Resilience**: Every simulator features a client-side execution fallback so interactive demonstrations work seamlessly even if the backend is temporarily offline.
