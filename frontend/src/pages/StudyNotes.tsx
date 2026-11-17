import React, { useState } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface ComparisonTable {
  title: string;
  unit: string;
  colA: string;
  colB: string;
  rows: { aspect: string; a: string; b: string }[];
}

const COMPARISONS: ComparisonTable[] = [
  {
    title: 'Process vs Thread',
    unit: 'Unit 2: Process Management',
    colA: 'Process',
    colB: 'Thread',
    rows: [
      { aspect: 'Definition', a: 'A program in execution with private address space', b: 'A lightweight unit of execution within a process' },
      { aspect: 'Memory Sharing', a: 'Isolated memory space; requires IPC to communicate', b: 'Shares code, data, heap, and open files with other threads' },
      { aspect: 'Context Switch Overhead', a: 'Heavy; requires saving registers and flushing TLB cache', b: 'Light; registers and stack change but address space is retained' },
      { aspect: 'Creation Time', a: 'High overhead (calls fork() or CreateProcess)', b: 'Low overhead (calls pthread_create)' },
      { aspect: 'Fault Isolation', a: 'If one process crashes, others continue unaffected', b: 'If one thread causes a segfault, the entire process terminates' },
    ],
  },
  {
    title: 'Paging vs Segmentation',
    unit: 'Unit 5: Memory Management',
    colA: 'Paging',
    colB: 'Segmentation',
    rows: [
      { aspect: 'Block Size', a: 'Fixed-size blocks (e.g. 4 KB pages/frames)', b: 'Variable-size blocks determined by program logical modules' },
      { aspect: 'Programmer View', a: 'Invisible to programmer (hardware MMU mapping)', b: 'Visible to programmer (code segment, data segment, stack)' },
      { aspect: 'Fragmentation', a: 'Zero external fragmentation; minor internal fragmentation', b: 'Zero internal fragmentation; severe external fragmentation' },
      { aspect: 'Address Structure', a: '1-dimensional address split into Page Number and Offset', b: '2-dimensional address: <Segment Number, Offset>' },
    ],
  },
  {
    title: 'Monolithic vs Microkernel Architecture',
    unit: 'Unit 1: Introduction to OS',
    colA: 'Monolithic Kernel (Linux)',
    colB: 'Microkernel (Mach, QNX, L4)',
    rows: [
      { aspect: 'Kernel Services', a: 'Drivers, file systems, IPC, and scheduling all run in Ring 0', b: 'Only minimal IPC, scheduling, and paging run in Ring 0' },
      { aspect: 'Performance', a: 'Extremely fast direct function calls in kernel mode', b: 'Higher overhead due to frequent IPC context switches' },
      { aspect: 'Reliability', a: 'A bug in any driver can crash the entire operating system', b: 'Driver crashes run in user space and can be restarted safely' },
      { aspect: 'Extensibility', a: 'Adding services requires compiling kernel modules', b: 'Adding services is as simple as starting a user-space daemon' },
    ],
  },
  {
    title: 'Preemptive vs Non-Preemptive Scheduling',
    unit: 'Unit 3: CPU Scheduling',
    colA: 'Preemptive Scheduling',
    colB: 'Non-Preemptive Scheduling',
    rows: [
      { aspect: 'Interruption', a: 'CPU can be forcibly reclaimed by timer or high-priority task', b: 'Process retains CPU until it voluntarily blocks or terminates' },
      { aspect: 'Overhead', a: 'Higher context-switching overhead and hardware timer usage', b: 'Minimal context switching; simple FIFO queue logic' },
      { aspect: 'Response Time', a: 'Excellent for interactive time-sharing systems (Round Robin)', b: 'Poor interactive response; long jobs starve short jobs' },
      { aspect: 'Race Conditions', a: 'Shared data must be protected with mutexes and semaphores', b: 'Lower risk of race conditions on single-core uniprocessors' },
    ],
  },
];

export default function StudyNotes() {
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');

  const filtered = COMPARISONS.filter((comp) => {
    const matchesSearch =
      !search ||
      comp.title.toLowerCase().includes(search.toLowerCase()) ||
      comp.rows.some((r) => r.aspect.toLowerCase().includes(search.toLowerCase()));
    const matchesUnit = selectedUnit === 'ALL' || comp.unit.includes(selectedUnit);
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <FileText size={14} /> Comprehensive Revision Notes
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Operating Systems Study Notes & Comparison Tables
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          High-yield academic comparison tables, architectural differences, and exam definitions organized across all six syllabus units.
        </p>

        {/* Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comparison tables (e.g. 'Thread', 'Paging', 'Preemptive')..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Comparison Tables */}
      <div className="space-y-6">
        {filtered.map((table) => (
          <div
            key={table.title}
            className="bg-[#0d1526] border border-white/5 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-4 sm:p-5 border-b border-white/5 bg-[#0a101f] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold mb-0.5 block">
                  {table.unit}
                </span>
                <h3 className="text-base font-bold text-white">{table.title}</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 uppercase font-mono text-[11px]">
                    <th className="py-3 px-4 font-semibold w-1/4">Comparison Parameter</th>
                    <th className="py-3 px-4 font-semibold text-cyan-400 w-3/8">{table.colA}</th>
                    <th className="py-3 px-4 font-semibold text-purple-400 w-3/8">{table.colB}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {table.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{r.aspect}</td>
                      <td className="py-3 px-4 leading-relaxed">{r.a}</td>
                      <td className="py-3 px-4 leading-relaxed">{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
