import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default function FormulaSheet() {
  // Mini interactive calculator states
  // 1. EAT Calculator
  const [tlbHitRate, setTlbHitRate] = useState<number>(90);
  const [tlbTime, setTlbTime] = useState<number>(20);
  const [memTime, setMemTime] = useState<number>(100);

  const h = tlbHitRate / 100;
  const calculatedEAT = h * (tlbTime + memTime) + (1 - h) * (tlbTime + 2 * memTime);

  // 2. TAT & WT Calculator
  const [ct, setCt] = useState<number>(15);
  const [at, setAt] = useState<number>(2);
  const [bt, setBt] = useState<number>(6);

  const tat = ct - at;
  const wt = tat - bt;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator size={14} /> Mathematical Reference
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Operating Systems Formula Sheet & Quick Calculators
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Master the exact mathematical relationships governing CPU scheduling, TLB memory access latency, disk track seeks, and real-time bounds.
        </p>
      </div>

      {/* Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. CPU Scheduling Metrics */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10">
              Unit 3: CPU Scheduling
            </span>
          </div>

          <h3 className="text-base font-bold text-white">Turnaround Time & Waiting Time</h3>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-cyan-300 space-y-1">
            <div>TAT = Completion Time - Arrival Time</div>
            <div>WT  = Turnaround Time - Burst Time</div>
            <div>CPU Util = (Busy Time / Total Time) * 100%</div>
          </div>

          {/* Interactive Mini-Calculator */}
          <div className="p-4 rounded-xl bg-[#090f1d] border border-cyan-500/10 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Metric Calculator
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Completion (CT)</label>
                <input
                  type="number"
                  value={ct}
                  onChange={(e) => setCt(+e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Arrival (AT)</label>
                <input
                  type="number"
                  value={at}
                  onChange={(e) => setAt(+e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Burst (BT)</label>
                <input
                  type="number"
                  value={bt}
                  onChange={(e) => setBt(+e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">TAT: <strong className="text-cyan-400">{tat} ms</strong></span>
              <span className="text-slate-300">WT: <strong className="text-green-400">{wt} ms</strong></span>
            </div>
          </div>
        </div>

        {/* 2. Effective Access Time (EAT) */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-violet-400 font-bold px-2 py-0.5 rounded bg-violet-500/10">
              Unit 5: Memory Management
            </span>
          </div>

          <h3 className="text-base font-bold text-white">Effective Access Time (EAT) with TLB</h3>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-violet-300 space-y-1">
            <div>EAT = h * (tlb + mem) + (1 - h) * (tlb + 2*mem)</div>
            <div>where h = TLB hit ratio, mem = RAM access time</div>
          </div>

          {/* Interactive Mini-Calculator */}
          <div className="p-4 rounded-xl bg-[#090f1d] border border-violet-500/10 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick EAT Calculator
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Hit Rate % (h)</label>
                <input
                  type="number"
                  value={tlbHitRate}
                  onChange={(e) => setTlbHitRate(+e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">TLB Time (ns)</label>
                <input
                  type="number"
                  value={tlbTime}
                  onChange={(e) => setTlbTime(+e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">RAM Time (ns)</label>
                <input
                  type="number"
                  value={memTime}
                  onChange={(e) => setMemTime(+e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Effective Access Time (EAT):</span>
              <strong className="text-violet-400 font-bold">{calculatedEAT.toFixed(1)} ns</strong>
            </div>
          </div>
        </div>

        {/* 3. Deadlock Banker's Need Matrix */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-red-400 font-bold px-2 py-0.5 rounded bg-red-500/10">
              Unit 4: Deadlocks
            </span>
          </div>

          <h3 className="text-base font-bold text-white">Banker's Algorithm & Resource Bounds</h3>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-red-300 space-y-1">
            <div>Need[i][j] = Max[i][j] - Allocation[i][j]</div>
            <div>Safety Condition: Need[i] &lt;= Available</div>
            <div>Deadlock-Free Bound: Total Resources &gt;= sum(Max_i) - (n - 1)</div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The system is safe if there exists a sequence of processes such that each process's maximum need can be satisfied by the currently available resources plus the resources released by finished predecessors.
          </p>
        </div>

        {/* 4. Disk Latency & Physical Address */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10">
              Unit 6: Storage & I/O
            </span>
          </div>

          <h3 className="text-base font-bold text-white">Disk Access Latency & Addressing</h3>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-amber-300 space-y-1">
            <div>Disk Access Time = Seek Time + Rotational Latency + Transfer Time</div>
            <div>Rotational Latency = 0.5 / (RPM / 60) seconds</div>
            <div>Physical Address = (Frame Number * Page Size) + Offset</div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Seek time (mechanical head positioning) accounts for more than 70% of mechanical drive latency, which is why algorithms like SSTF, SCAN, and LOOK are critical for optimizing disk bandwidth.
          </p>
        </div>
      </div>
    </div>
  );
}
