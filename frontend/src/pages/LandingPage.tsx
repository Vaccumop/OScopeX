import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, ArrowRight, Cpu, Database, GitBranch,
  FlaskConical, Play, BookOpen, Activity, RotateCcw,
  BarChart2, AlertTriangle, HardDrive,
} from 'lucide-react';

const FEATURES = [
  { icon: Cpu, title: 'Simulate', color: 'text-cyan-400 bg-cyan-400/10', desc: 'Run CPU scheduling, memory, IPC, and disk simulations with real algorithms.' },
  { icon: FlaskConical, title: 'Experiment', color: 'text-purple-400 bg-purple-400/10', desc: 'Change policies and workloads. Compare Round Robin vs Priority in real time.' },
  { icon: BarChart2, title: 'Compare', color: 'text-green-400 bg-green-400/10', desc: 'Measure the exact impact of every parameter change on system metrics.' },
  { icon: RotateCcw, title: 'Replay', color: 'text-amber-400 bg-amber-400/10', desc: 'Step through execution event-by-event at any speed, forward or backward.' },
];

const MODULES = [
  { icon: Activity, label: 'Process Manager', color: 'text-green-400' },
  { icon: Cpu, label: 'CPU Scheduler', color: 'text-blue-400' },
  { icon: GitBranch, label: 'Synchronization', color: 'text-purple-400' },
  { icon: AlertTriangle, label: 'Deadlock Detection', color: 'text-red-400' },
  { icon: Database, label: 'Virtual Memory', color: 'text-violet-400' },
  { icon: HardDrive, label: 'Disk Scheduling', color: 'text-amber-400' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-8 py-5 border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Zap size={16} className="text-cyan-400" />
          </div>
          <span className="font-bold text-lg tracking-wide">OScopeX</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/learn')}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Learn OS
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-8 pt-24 pb-20">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            OS Digital Twin & What-If Lab
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-white">OScopeX</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 font-light mb-4 max-w-2xl">
            Explore the Operating System from the inside.
          </p>

          <p className="text-slate-500 max-w-xl mx-auto mb-10 text-sm leading-relaxed">
            Simulate processes, memory, scheduling, synchronization, deadlocks, IPC and I/O —
            then change the rules and see exactly what happens.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-[#0a0f1e] font-semibold rounded-lg hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Play size={16} />
              Launch OScopeX
            </button>
            <button
              onClick={() => navigate('/learn')}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 font-medium rounded-lg hover:bg-white/10 transition-all"
            >
              <BookOpen size={16} />
              Explore Learn Mode
            </button>
          </div>
        </motion.div>

        {/* Mini dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 w-full max-w-4xl"
        >
          <div className="rounded-xl border border-cyan-500/20 bg-[#0d1526] overflow-hidden shadow-2xl">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#080e1c] border-b border-cyan-500/10">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="ml-4 flex-1 bg-white/5 rounded px-3 py-1 text-xs text-slate-500">localhost:5174/dashboard</div>
            </div>
            {/* Fake dashboard */}
            <div className="p-4 grid grid-cols-3 gap-3">
              {[
                { label: 'CPU Utilization', value: '72.5%', color: 'text-blue-400', bar: 72 },
                { label: 'Memory Usage', value: '6 / 16 frames', color: 'text-purple-400', bar: 37 },
                { label: 'Page Faults', value: '1', color: 'text-red-400', bar: 10 },
              ].map(item => (
                <div key={item.label} className="bg-[#111c35] rounded-lg p-3 border border-white/5">
                  <p className="text-[10px] text-slate-500 mb-1">{item.label}</p>
                  <p className={`text-lg font-bold font-mono ${item.color}`}>{item.value}</p>
                  <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-current ${item.color}`} style={{ width: `${item.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Fake event stream */}
            <div className="px-4 pb-4 space-y-1">
              {[
                { t: '0.5ms', e: 'PROCESS_CREATED', p: 'P2 (bash)', c: 'text-green-400' },
                { t: '2.5ms', e: 'CONTEXT_SWITCH', p: 'P1 → P2', c: 'text-purple-400' },
                { t: '4.0ms', e: 'PAGE_FAULT', p: 'P2 page 3', c: 'text-red-400' },
                { t: '6.0ms', e: 'DISK_REQUEST', p: 'P4 track 98', c: 'text-amber-400' },
              ].map((ev, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="text-slate-600 w-10">{ev.t}</span>
                  <span className={`${ev.c} font-medium`}>{ev.e}</span>
                  <span className="text-slate-500">{ev.p}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold mb-12 text-white">
          Configure → Simulate → Observe → Compare → Replay → Learn
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, color, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0d1526] border border-white/5 rounded-xl p-5 hover:border-cyan-500/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-center text-lg font-semibold mb-8 text-slate-400">
          10+ OS Modules — All Interconnected
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {MODULES.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-3 bg-[#0d1526] border border-white/5 rounded-lg hover:border-cyan-500/20 transition-all cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Icon size={20} className={color} />
              <span className="text-[10px] text-slate-500 text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <div className="max-w-lg mx-auto bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-slate-400 text-sm mb-8">
            No setup required. Launch the simulator and start experimenting immediately.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mx-auto px-8 py-3 bg-cyan-500 text-[#0a0f1e] font-semibold rounded-lg hover:bg-cyan-400 transition-all"
          >
            Launch OScopeX
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-6 text-center text-slate-600 text-xs">
        OScopeX — Operating System Digital Twin & What-If Lab
      </footer>
    </div>
  );
}
