import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Code2,
  Calculator,
  Award,
  Layers,
  CheckCircle2,
  Sparkles,
  Cpu,
  Database,
  Lock,
  Disc,
  Play,
  Monitor,
} from 'lucide-react';
import { CURRICULUM } from '@/data/curriculum';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b16] text-white overflow-x-hidden selection:bg-cyan-500 selection:text-black font-sans">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-cyan-500/10 backdrop-blur bg-[#070b16]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Zap size={18} className="text-[#080e1c]" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            OScope<span className="text-cyan-400">X</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => navigate('/courses')}
            className="text-slate-300 hover:text-cyan-400 transition-colors hidden sm:block"
          >
            Curriculum
          </button>
          <button
            onClick={() => navigate('/labs')}
            className="text-slate-300 hover:text-cyan-400 transition-colors hidden sm:block"
          >
            Interactive Labs
          </button>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold transition-all shadow-md shadow-cyan-500/15"
          >
            Launch Platform
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6">
          <Sparkles size={14} className="text-cyan-400" />
          The Interactive Operating Systems Learning Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none mb-6">
          Understand What's Happening <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
            Inside Your Computer.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Master Operating Systems through structured university lessons, visual concept animations, 10 working simulation laboratories, coding playgrounds, and real-time what-if experimentation.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25"
          >
            <BookOpen size={16} /> Start Learning <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/labs')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all"
          >
            <FlaskConical size={16} className="text-cyan-400" /> Explore Interactive Labs
          </button>
        </div>

        {/* Fundamental Learning Cycle Strip */}
        <div className="mt-14 w-full grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono font-bold">
          <div className="p-2.5 rounded-xl bg-[#0d162a] border border-cyan-500/20 text-cyan-300">1. LEARN</div>
          <div className="p-2.5 rounded-xl bg-[#0d162a] border border-blue-500/20 text-blue-300">2. VISUALIZE</div>
          <div className="p-2.5 rounded-xl bg-[#0d162a] border border-purple-500/20 text-purple-300">3. PRACTISE</div>
          <div className="p-2.5 rounded-xl bg-[#0d162a] border border-green-500/20 text-green-300">4. SIMULATE</div>
          <div className="p-2.5 rounded-xl bg-[#0d162a] border border-amber-500/20 text-amber-300">5. TEST</div>
          <div className="p-2.5 rounded-xl bg-[#0d162a] border border-emerald-500/20 text-emerald-300">6. MASTER</div>
        </div>
      </section>

      {/* Section 1: Explore the Six OS Units */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Complete 6-Unit Academic Curriculum
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From low-level system call traps to multi-level paging and disk arm elevator scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM.map((unit) => (
            <div
              key={unit.id}
              onClick={() => navigate('/courses')}
              className="bg-[#0b1224] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 mb-2 inline-block">
                  UNIT {unit.number}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                  {unit.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {unit.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>{unit.lessons.length} Detailed Lessons</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Study <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: 10 Working Simulators */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto border-t border-white/5 bg-[#080e1c]/40 rounded-3xl">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Hands-On Digital Twin & Observability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            10 Working Interactive Laboratories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            No mock screenshots. Every algorithm executes live on real inputs with step-by-step state inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/scheduling')}
            className="p-5 rounded-2xl bg-[#0c1426] border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all group"
          >
            <Cpu size={24} className="text-blue-400 mb-3" />
            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 mb-1">CPU Scheduler</h3>
            <p className="text-xs text-slate-400">FCFS, SJF, SRTF, Round Robin quantum tuning, Priority, and MLFQ with live Gantt chart.</p>
          </div>

          <div
            onClick={() => navigate('/deadlocks')}
            className="p-5 rounded-2xl bg-[#0c1426] border border-white/5 hover:border-red-500/30 cursor-pointer transition-all group"
          >
            <Lock size={24} className="text-red-400 mb-3" />
            <h3 className="text-sm font-bold text-white group-hover:text-red-300 mb-1">Banker’s Algorithm & Deadlocks</h3>
            <p className="text-xs text-slate-400">Resource Allocation Graph cycle detection and dynamic safe sequence computation.</p>
          </div>

          <div
            onClick={() => navigate('/memory')}
            className="p-5 rounded-2xl bg-[#0c1426] border border-white/5 hover:border-violet-500/30 cursor-pointer transition-all group"
          >
            <Database size={24} className="text-violet-400 mb-3" />
            <h3 className="text-sm font-bold text-white group-hover:text-violet-300 mb-1">Virtual Memory & TLB</h3>
            <p className="text-xs text-slate-400">Animated MMU address translation pipeline mapping logical pages to physical frames.</p>
          </div>

          <div
            onClick={() => navigate('/page-replacement')}
            className="p-5 rounded-2xl bg-[#0c1426] border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all group"
          >
            <Layers size={24} className="text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 mb-1">Page Replacement Lab</h3>
            <p className="text-xs text-slate-400">Simulate FIFO, LRU, Optimal, and Clock algorithms to test Belady's Anomaly.</p>
          </div>

          <div
            onClick={() => navigate('/disk')}
            className="p-5 rounded-2xl bg-[#0c1426] border border-white/5 hover:border-amber-500/30 cursor-pointer transition-all group"
          >
            <Disc size={24} className="text-amber-400 mb-3" />
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 mb-1">Disk Head Scheduling</h3>
            <p className="text-xs text-slate-400">FCFS, SSTF, SCAN, C-SCAN, and LOOK cylinder seek path visualizations.</p>
          </div>

          <div
            onClick={() => navigate('/dashboard')}
            className="p-5 rounded-2xl bg-[#0c1426] border border-white/5 hover:border-emerald-500/30 cursor-pointer transition-all group"
          >
            <Monitor size={24} className="text-emerald-400 mb-3" />
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 mb-1">System Digital Twin</h3>
            <p className="text-xs text-slate-400">Full telemetry dashboard showing live CPU timeline, 32-frame RAM, and event logs.</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/labs')}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-md"
          >
            View All 10 Laboratories →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 border-t border-white/5 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <strong className="text-white">OScopeX</strong> — The Interactive Operating Systems Learning Platform.
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/about')} className="hover:text-cyan-400 transition-colors">About</button>
          <button onClick={() => navigate('/glossary')} className="hover:text-cyan-400 transition-colors">Glossary</button>
          <button onClick={() => navigate('/formula-sheet')} className="hover:text-cyan-400 transition-colors">Formulas</button>
          <button onClick={() => navigate('/courses')} className="hover:text-cyan-400 transition-colors">Curriculum</button>
        </div>
      </footer>
    </div>
  );
}
