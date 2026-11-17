import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  Database,
  ShieldAlert,
  HardDrive,
  Award,
  LucideIcon,
} from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';

interface PathMilestone {
  step: number;
  title: string;
  desc: string;
  unit: string;
  targetUrl: string;
  icon: LucideIcon;
  color: string;
}

const MILESTONES: PathMilestone[] = [
  {
    step: 1,
    title: 'Kernel & Hardware Architecture',
    desc: 'Understand dual-mode execution (Ring 0 vs Ring 3), system call traps, and Linux CLI fundamentals.',
    unit: 'Unit 1: Introduction to OS',
    targetUrl: '/learn/what-is-an-os',
    icon: Compass,
    color: 'text-cyan-400 bg-cyan-400/10 border-cyan-500/30',
  },
  {
    step: 2,
    title: 'Processes, PCB & Context Switching',
    desc: 'Master the 5-state and 7-state process lifecycle, PCB data structure, and thread concurrency.',
    unit: 'Unit 2: Process Management',
    targetUrl: '/learn/process-concept-and-states',
    icon: Cpu,
    color: 'text-green-400 bg-green-400/10 border-green-500/30',
  },
  {
    step: 3,
    title: 'Synchronization & Classical Concurrency',
    desc: 'Eliminate race conditions with Mutex locks and counting Semaphores in Producer-Consumer & Dining Philosophers.',
    unit: 'Unit 2: Synchronization',
    targetUrl: '/learn/concurrency-mutex-semaphores',
    icon: Layers,
    color: 'text-purple-400 bg-purple-400/10 border-purple-500/30',
  },
  {
    step: 4,
    title: 'Uniprocessor CPU Scheduling',
    desc: 'Evaluate FCFS, SJF, SRTF, Round Robin time quantum tuning, Priority aging, and MLFQ feedback rules.',
    unit: 'Unit 3: CPU Scheduling',
    targetUrl: '/learn/scheduling-criteria-and-formulas',
    icon: Cpu,
    color: 'text-blue-400 bg-blue-400/10 border-blue-500/30',
  },
  {
    step: 5,
    title: 'Deadlock Avoidance & Banker’s Algorithm',
    desc: 'Detect cycles in Resource Allocation Graphs and compute safe sequences using Dijkstra\'s Banker’s Algorithm.',
    unit: 'Unit 4: Deadlocks',
    targetUrl: '/learn/deadlock-concept-and-conditions',
    icon: ShieldAlert,
    color: 'text-red-400 bg-red-400/10 border-red-500/30',
  },
  {
    step: 6,
    title: 'Virtual Memory, MMU & Page Replacement',
    desc: 'Translate virtual addresses to physical frames, evaluate TLB latency, and simulate FIFO/LRU/Optimal algorithms.',
    unit: 'Unit 5: Memory Management',
    targetUrl: '/learn/paging-and-address-translation',
    icon: Database,
    color: 'text-violet-400 bg-violet-400/10 border-violet-500/30',
  },
  {
    step: 7,
    title: 'I/O Buffering, Disk Scheduling & Inodes',
    desc: 'Minimize disk seek head movement using SCAN/LOOK algorithms, explore DMA, and inspect UNIX Inode file allocation.',
    unit: 'Unit 6: I/O & Files',
    targetUrl: '/learn/disk-scheduling-algorithms',
    icon: HardDrive,
    color: 'text-amber-400 bg-amber-400/10 border-amber-500/30',
  },
  {
    step: 8,
    title: 'Final Mastery & Course Certification',
    desc: 'Complete all unit evaluations, solve university numericals, and generate your verified OScopeX certificate.',
    unit: 'Capstone Certification',
    targetUrl: '/certificates',
    icon: Award,
    color: 'text-cyan-300 bg-cyan-300/10 border-cyan-400/30',
  },
];

export default function LearningPaths() {
  const navigate = useNavigate();
  const { profile } = useLearningStore();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass size={14} /> Guided Roadmap
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          The Operating Systems Learning Path
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          A step-by-step sequential learning journey designed by OS educators. Follow prerequisite milestones from basic hardware interactions to virtual memory and storage subsystems.
        </p>
      </div>

      {/* Path Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/20 space-y-8 my-6">
        {MILESTONES.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.step} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full bg-[#080e1c] border-2 border-cyan-400 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-300 shadow-md shadow-cyan-500/20">
                {m.step}
              </div>

              {/* Milestone Card */}
              <div className="bg-[#0d1526] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 sm:p-6 transition-all group shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${m.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                        {m.unit}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(m.targetUrl)}
                    className="self-start sm:self-center px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    Start Milestone <ArrowRight size={12} />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
