import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu,
  Activity,
  Lock,
  AlertTriangle,
  Database,
  Layers,
  GitBranch,
  HardDrive,
  Disc,
  FlaskConical,
  Monitor,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  LucideIcon,
} from 'lucide-react';

interface LabDef {
  id: string;
  name: string;
  category: 'CPU' | 'Memory' | 'Concurrency' | 'Storage' | 'System';
  description: string;
  route: string;
  icon: LucideIcon;
  color: string;
  badge: string;
  challengeTitle?: string;
  challengeDescription?: string;
}

const LABS: LabDef[] = [
  {
    id: 'cpu-scheduler',
    name: 'CPU Scheduling Simulator',
    category: 'CPU',
    description: 'Simulate FCFS, SJF, SRTF, Round Robin, Priority, and Multilevel Feedback Queues with real-time Gantt charts, turnaround, and waiting time metrics.',
    route: '/scheduling',
    icon: Cpu,
    color: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
    badge: '7 Algorithms',
    challengeTitle: 'Convoy Effect vs Round Robin',
    challengeDescription: 'Configure a 100ms CPU-heavy process followed by three 2ms I/O processes. Observe how Round Robin drastically slashes average waiting time.',
  },
  {
    id: 'process-manager',
    name: 'Process Manager & PCB Inspector',
    category: 'CPU',
    description: 'Inspect CPU register states (AX, BX, CX, DX), Program Counter, state transitions (NEW, READY, RUNNING, BLOCKED, TERMINATED), and process control blocks.',
    route: '/processes',
    icon: Activity,
    color: 'text-green-400 bg-green-400/10 border-green-500/20',
    badge: 'PCB Live Inspector',
    challengeTitle: 'Trigger I/O Blocking Transition',
    challengeDescription: 'Spawn a process with non-zero I/O burst and watch it transition from RUNNING to BLOCKED, yielding CPU time to ready peers.',
  },
  {
    id: 'synchronization-lab',
    name: 'Classical Synchronization Lab',
    category: 'Concurrency',
    description: 'Simulate Producer-Consumer with bounded buffer semaphores, Readers-Writers starvation priority, and Dining Philosophers deadlock prevention.',
    route: '/synchronization',
    icon: Lock,
    color: 'text-purple-400 bg-purple-400/10 border-purple-500/20',
    badge: '3 Classical Problems',
    challengeTitle: 'Dining Philosophers Circular Deadlock',
    challengeDescription: 'Disable the asymmetric pickup rule and observe all 5 philosophers hold their left fork, creating total deadlock.',
  },
  {
    id: 'deadlock-lab',
    name: 'Deadlock Detection & Banker’s Algorithm',
    category: 'Concurrency',
    description: 'Full Banker\'s Algorithm safety matrix calculator (Available, Max, Allocation, Need), safe sequence generator, and Resource Allocation Graph cycle detection.',
    route: '/deadlocks',
    icon: AlertTriangle,
    color: 'text-red-400 bg-red-400/10 border-red-500/20',
    badge: 'Banker + RAG',
    challengeTitle: 'Identify Unsafe Resource State',
    challengeDescription: 'Input a resource request that exceeds available capacity and watch the Banker’s safety algorithm reject the grant.',
  },
  {
    id: 'virtual-memory',
    name: 'Virtual Memory & Address Translation',
    category: 'Memory',
    description: 'Interactive MMU Translation Pipeline: Virtual Address -> Page Number & Offset -> TLB lookup -> Page Table -> Physical Frame & Address.',
    route: '/memory',
    icon: Database,
    color: 'text-violet-400 bg-violet-400/10 border-violet-500/20',
    badge: 'MMU & TLB',
    challengeTitle: 'Translate 32-bit Logical Address',
    challengeDescription: 'Configure 4 KB page size and translate address 0x1A2B to calculate its exact physical frame and offset.',
  },
  {
    id: 'page-replacement',
    name: 'Page Replacement Laboratory',
    category: 'Memory',
    description: 'Simulate FIFO, LRU, Optimal, and Second Chance (Clock) algorithms. Step-by-step frame state history table and hit/fault ratio benchmark.',
    route: '/page-replacement',
    icon: Layers,
    color: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20',
    badge: 'Belady Benchmark',
    challengeTitle: 'Reproduce Belady’s Anomaly',
    challengeDescription: 'Run FIFO with reference string [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5] on 3 frames vs 4 frames and verify that faults increase from 9 to 10!',
  },
  {
    id: 'ipc-lab',
    name: 'Inter-Process Communication (IPC)',
    category: 'System',
    description: 'Interactive visualizations for Unidirectional Pipes, Message Queues with priority filtering, Shared Memory segments, and POSIX Signal dispatching.',
    route: '/ipc',
    icon: GitBranch,
    color: 'text-teal-400 bg-teal-400/10 border-teal-500/20',
    badge: 'Pipes & Queues',
    challengeTitle: 'Buffer Saturation in IPC Pipe',
    challengeDescription: 'Dispatch messages faster than receiver consumption rate and observe the sender process block on write.',
  },
  {
    id: 'io-buffer',
    name: 'I/O Buffering Simulator',
    category: 'Storage',
    description: 'Single Buffering, Double Buffering (Ping-Pong), and Circular Buffering simulations with producer/consumer speed mismatch and overflow metrics.',
    route: '/io-buffer',
    icon: HardDrive,
    color: 'text-orange-400 bg-orange-400/10 border-orange-500/20',
    badge: '3 Buffer Modes',
    challengeTitle: 'Double Buffering Overlap',
    challengeDescription: 'Compare execution time of 50 I/O blocks under Single Buffer vs Double Buffer to observe CPU and DMA concurrency.',
  },
  {
    id: 'disk-scheduler',
    name: 'Disk Scheduling Simulator',
    category: 'Storage',
    description: 'Simulate FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, and C-LOOK on 200 cylinders. Visual disk head movement timeline and seek distance computation.',
    route: '/disk',
    icon: Disc,
    color: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
    badge: '6 Disk Policies',
    challengeTitle: 'Minimize Seek Distance',
    challengeDescription: 'Test cylinder queue [98, 183, 37, 122, 14, 124, 65, 67] starting at head 53 under SSTF and verify total seek of 236 cylinders.',
  },
  {
    id: 'what-if-lab',
    name: 'What-If Experimentation Lab',
    category: 'System',
    description: 'Split-screen side-by-side benchmarking. Run identical workloads on Baseline vs Alternative policy to measure % change in waiting, faults, or seek.',
    route: '/what-if',
    icon: FlaskConical,
    color: 'text-cyan-300 bg-cyan-300/10 border-cyan-400/20',
    badge: 'A/B Benchmarking',
    challengeTitle: 'Round Robin Quantum Tuning',
    challengeDescription: 'Benchmark Quantum = 2 vs Quantum = 8 on the same 5-process workload to find the sweet spot between response time and context switches.',
  },
  {
    id: 'digital-twin',
    name: 'OS Digital Twin Live Dashboard',
    category: 'System',
    description: 'Unified real-time system monitor: live CPU utilization timeline, 32-frame physical memory allocation map, disk head radar, and event log stream.',
    route: '/dashboard',
    icon: Monitor,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    badge: 'Live Telemetry',
    challengeTitle: 'Live System Health Inspection',
    challengeDescription: 'Observe real-time memory pressure and context switch rates as background simulated processes execute.',
  },
];

export default function InteractiveLabs() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'CPU', 'Memory', 'Concurrency', 'Storage', 'System'];

  const filteredLabs =
    selectedCategory === 'ALL' ? LABS : LABS.filter((l) => l.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <FlaskConical size={14} /> Virtual OS Laboratories
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Interactive Algorithm Laboratories
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Experiment with 10 working OS simulation engines. Configure custom workloads, step through execution event-by-event, observe state transitions, and measure exact hardware performance metrics.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-[#080e1c] shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLabs.map((lab) => {
          const Icon = lab.icon;
          return (
            <motion.div
              key={lab.id}
              whileHover={{ y: -3 }}
              className="bg-[#0d1526] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${lab.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {lab.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                  {lab.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {lab.description}
                </p>

                {lab.challengeTitle && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-4 space-y-1">
                    <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Target size={12} /> Challenge: {lab.challengeTitle}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {lab.challengeDescription}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{lab.category} Subsystem</span>
                <button
                  onClick={() => navigate(lab.route)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  Launch Simulator <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
