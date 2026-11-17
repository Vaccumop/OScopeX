import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  BookOpen,
  FlaskConical,
  Code2,
  Calculator,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Monitor,
} from 'lucide-react';

export default function AboutPlatform() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Zap size={14} /> Product Identity & Pedagogy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          About OScopeX
        </h1>
        <p className="text-base text-cyan-300 font-semibold mb-2">
          "Understand What's Happening Inside Your Computer."
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          OScopeX is an interactive educational platform designed to teach Operating Systems from first principles through animated demonstrations, structured lessons, working simulator laboratories, coding exercises, and university examination assessments.
        </p>
      </div>

      {/* The Core Cycle */}
      <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white">The OScopeX Learning Cycle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono font-bold">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">LEARN</div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">VISUALIZE</div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">PRACTISE</div>
          <div className="p-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">SIMULATE</div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">TEST</div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MASTER</div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed pt-2">
          Traditional operating systems courses rely on abstract textbook diagrams that fail to convey dynamic runtime interactions. OScopeX couples every theoretical concept directly with a working execution engine, enabling students to pause, step, configure, and inspect operating system state in real time.
        </p>
      </div>

      {/* 6 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1526] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <BookOpen size={16} /> Structured 6-Unit Curriculum
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full coverage of standard academic syllabi: System Calls, Process Lifecycle, CPU Scheduling, Deadlocks, Virtual Memory, and File Management.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1526] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <FlaskConical size={16} /> 10 Interactive Laboratories
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Preserved simulation engines for CPU scheduling, paging MMU translation, Banker's algorithm, Dining Philosophers, IPC pipes, and disk seek optimization.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1526] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Calculator size={16} /> Numerical Practice Engine
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Interactive mathematical calculators and problem validators for Gantt turnaround times, TLB effective access times, and disk seek distances.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1526] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
            <Code2 size={16} /> Practical Coding Playground
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real POSIX C code examples for fork(), wait(), POSIX threads, mutexes, semaphores, and unnamed pipes with line-by-line annotations.
          </p>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu size={16} className="text-cyan-400" /> Platform Architecture & Technology Stack
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          OScopeX is built as a high-resilience web application:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1 text-slate-300">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">React 18 & TS</div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">Vite & Tailwind v4</div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">FastAPI Backend</div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">SQLite Database</div>
        </div>
      </div>
    </div>
  );
}
