import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Trash2, RefreshCw, Download, Info } from 'lucide-react';
import { simulateScheduling } from '@/services/api';
import type { SchedulingAlgorithm, GanttSlot, SchedulingMetrics, ProcessMetric } from '@/types';
import {
  Card, PageHeader, Button, Input, Select, Badge,
  StatCard, EmptyState, Spinner, ExplainBox,
} from '@/components/ui';
import { ALGORITHM_COLORS, downloadCSV, downloadJSON } from '@/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProcessInput {
  pid: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  ioBurst: number;
}

const SAMPLE_WORKLOADS: Record<string, ProcessInput[]> = {
  'Short Jobs': [
    { pid: 1, name: 'P1', arrivalTime: 0, burstTime: 2, priority: 2, ioBurst: 0 },
    { pid: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, ioBurst: 0 },
    { pid: 3, name: 'P3', arrivalTime: 2, burstTime: 1, priority: 3, ioBurst: 0 },
    { pid: 4, name: 'P4', arrivalTime: 3, burstTime: 4, priority: 2, ioBurst: 0 },
  ],
  'Mixed Priority': [
    { pid: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 2, ioBurst: 0 },
    { pid: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, ioBurst: 0 },
    { pid: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 3, ioBurst: 0 },
    { pid: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 2, ioBurst: 0 },
  ],
  'RR Stress': [
    { pid: 1, name: 'P1', arrivalTime: 0, burstTime: 10, priority: 1, ioBurst: 0 },
    { pid: 2, name: 'P2', arrivalTime: 0, burstTime: 10, priority: 1, ioBurst: 0 },
    { pid: 3, name: 'P3', arrivalTime: 0, burstTime: 10, priority: 1, ioBurst: 0 },
    { pid: 4, name: 'P4', arrivalTime: 0, burstTime: 10, priority: 1, ioBurst: 0 },
  ],
};

const ALGO_OPTIONS: { value: SchedulingAlgorithm; label: string }[] = [
  { value: 'FCFS', label: 'FCFS — First Come First Serve' },
  { value: 'SJF', label: 'SJF — Shortest Job First (Non-Preemptive)' },
  { value: 'SRTF', label: 'SRTF — Shortest Remaining Time First' },
  { value: 'RR', label: 'RR — Round Robin' },
  { value: 'PRIORITY', label: 'Priority Scheduling' },
  { value: 'MLQ', label: 'Multilevel Queue' },
  { value: 'MLFQ', label: 'Multilevel Feedback Queue' },
];

const GANTT_COLORS = ['#22d3ee', '#22c55e', '#a855f7', '#f59e0b', '#f43f5e', '#38bdf8', '#4ade80', '#fb923c'];

function pidColor(pid: string | number): string {
  const n = parseInt(String(pid).replace(/\D/g, ''), 10) || 0;
  return GANTT_COLORS[n % GANTT_COLORS.length];
}

function GanttChart({ gantt }: { gantt: GanttSlot[] }) {
  if (!gantt.length) return null;
  const totalTime = gantt[gantt.length - 1].end;
  const scale = Math.min(1, 600 / totalTime);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]">
        <div className="flex h-10 rounded overflow-hidden border border-white/10">
          {gantt.map((slot, i) => {
            const width = ((slot.end - slot.start) / totalTime) * 100;
            const color = String(slot.pid) === 'IDLE' ? '#1e293b' : pidColor(slot.pid);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-center text-[10px] font-mono font-bold border-r border-black/20 relative"
                style={{ width: `${width}%`, background: color + '44', borderColor: color, borderWidth: 1, color }}
                title={`${slot.pid}: ${slot.start}→${slot.end}`}
              >
                {width > 3 && String(slot.pid)}
              </motion.div>
            );
          })}
        </div>
        {/* Timeline */}
        <div className="flex h-4 relative mt-0.5">
          {gantt.map((slot, i) => (
            <div
              key={i}
              className="text-[8px] font-mono text-slate-600"
              style={{ width: `${((slot.end - slot.start) / totalTime) * 100}%` }}
            >
              {slot.start}
            </div>
          ))}
          <div className="text-[8px] font-mono text-slate-600 absolute right-0">{totalTime}</div>
        </div>
      </div>
    </div>
  );
}

export default function CPUScheduler() {
  const [processes, setProcesses] = useState<ProcessInput[]>(SAMPLE_WORKLOADS['Mixed Priority']);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('RR');
  const [quantum, setQuantum] = useState(2);
  const [preemptive, setPreemptive] = useState(false);
  const [result, setResult] = useState<{ gantt: GanttSlot[]; metrics: SchedulingMetrics } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gantt' | 'table' | 'chart' | 'explain'>('gantt');

  const addProcess = () => {
    const newPid = Math.max(0, ...processes.map(p => p.pid)) + 1;
    setProcesses([...processes, { pid: newPid, name: `P${newPid}`, arrivalTime: 0, burstTime: 4, priority: 1, ioBurst: 0 }]);
  };

  const removeProcess = (pid: number) => setProcesses(processes.filter(p => p.pid !== pid));

  const updateProcess = (pid: number, field: keyof ProcessInput, value: string) => {
    setProcesses(processes.map(p =>
      p.pid === pid ? { ...p, [field]: field === 'name' ? value : parseFloat(value) || 0 } : p
    ));
  };

  const runSimulation = useCallback(async () => {
    if (processes.length === 0) { setError('Add at least one process.'); return; }
    if (processes.some(p => p.burstTime <= 0)) { setError('All burst times must be > 0.'); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await simulateScheduling({
        processes: processes.map(p => ({ ...p, remainingTime: p.burstTime, state: 'NEW' as const })),
        config: { algorithm, quantum: algorithm === 'RR' || algorithm === 'MLFQ' ? quantum : undefined, preemptive },
      });
      setResult(res);
      setActiveTab('gantt');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Simulation failed';
      // Fallback: run client-side FCFS for demo
      setResult(runClientSideFCFS(processes));
      setError(`Backend unavailable — showing client-side FCFS result.`);
    } finally {
      setLoading(false);
    }
  }, [processes, algorithm, quantum, preemptive]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="CPU Scheduler"
        subtitle="Simulate and compare CPU scheduling algorithms"
        actions={
          <div className="flex gap-2">
            {result && (
              <Button
                size="sm"
                variant="secondary"
                icon={<Download size={12} />}
                onClick={() => downloadJSON(result, 'scheduling_result.json')}
              >
                Export
              </Button>
            )}
            <Button size="sm" variant="primary" icon={loading ? undefined : <Play size={12} />} loading={loading} onClick={runSimulation}>
              Run Simulation
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Config Panel */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          {/* Algorithm */}
          <Card title="Algorithm">
            <div className="space-y-3">
              <Select
                label="Scheduling Algorithm"
                value={algorithm}
                onChange={e => setAlgorithm(e.target.value as SchedulingAlgorithm)}
                options={ALGO_OPTIONS}
              />
              {(algorithm === 'RR' || algorithm === 'MLFQ') && (
                <Input
                  label="Time Quantum (ms)"
                  type="number"
                  min={1}
                  value={quantum}
                  onChange={e => setQuantum(parseInt(e.target.value) || 1)}
                />
              )}
              {(algorithm === 'SJF' || algorithm === 'PRIORITY') && (
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-cyan-400"
                    checked={preemptive}
                    onChange={e => setPreemptive(e.target.checked)}
                  />
                  Preemptive mode
                </label>
              )}
            </div>
          </Card>

          {/* Sample Workloads */}
          <Card title="Sample Workloads">
            <div className="space-y-2">
              {Object.keys(SAMPLE_WORKLOADS).map(name => (
                <button
                  key={name}
                  onClick={() => setProcesses(SAMPLE_WORKLOADS[name])}
                  className="w-full text-left px-3 py-2 text-xs text-slate-400 bg-white/3 hover:bg-white/8 border border-white/5 hover:border-cyan-500/30 rounded-lg transition-all"
                >
                  {name}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Process Table */}
        <div className="col-span-12 md:col-span-8 space-y-4">
          <Card
            title="Process Workload"
            subtitle={`${processes.length} processes`}
            actions={
              <Button size="sm" icon={<Plus size={12} />} onClick={addProcess}>Add Process</Button>
            }
          >
            {error && (
              <div className="mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg">
                {error}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500">
                    {['PID', 'Name', 'Arrival', 'Burst', 'Priority', 'I/O Burst', ''].map(h => (
                      <th key={h} className="text-left py-2 px-2 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processes.map(p => (
                    <tr key={p.pid} className="border-t border-white/3">
                      <td className="py-2 px-2 font-mono text-slate-500">P{p.pid}</td>
                      <td className="py-2 px-2">
                        <input
                          value={p.name}
                          onChange={e => updateProcess(p.pid, 'name', e.target.value)}
                          className="w-16 bg-transparent text-slate-300 focus:outline-none"
                        />
                      </td>
                      {(['arrivalTime', 'burstTime', 'priority', 'ioBurst'] as const).map(field => (
                        <td key={field} className="py-2 px-2">
                          <input
                            type="number"
                            value={p[field]}
                            min={0}
                            onChange={e => updateProcess(p.pid, field, e.target.value)}
                            className="w-14 bg-white/5 border border-white/10 rounded px-1.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-500/50"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-2">
                        <button onClick={() => removeProcess(p.pid)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Results */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <StatCard label="Avg Waiting" value={result.metrics.avgWaitingTime.toFixed(2)} unit="ms" color="text-amber-400" />
                <StatCard label="Avg Turnaround" value={result.metrics.avgTurnaroundTime.toFixed(2)} unit="ms" color="text-cyan-400" />
                <StatCard label="CPU Utilization" value={result.metrics.cpuUtilization.toFixed(1)} unit="%" color="text-green-400" />
              </div>

              {/* Tabs */}
              <Card>
                <div className="flex gap-1 mb-4 border-b border-white/5 -mx-4 px-4 pb-0">
                  {[
                    { key: 'gantt', label: 'Gantt Chart' },
                    { key: 'table', label: 'Process Table' },
                    { key: 'chart', label: 'Metrics Chart' },
                    { key: 'explain', label: 'Explain' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                        activeTab === tab.key
                          ? 'border-cyan-400 text-cyan-400'
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'gantt' && (
                  <div>
                    <p className="text-xs text-slate-500 mb-3">Execution timeline — Algorithm: <span className="text-cyan-400">{algorithm}</span>{algorithm === 'RR' && ` (Q=${quantum})`}</p>
                    <GanttChart gantt={result.gantt} />
                  </div>
                )}

                {activeTab === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-slate-500">
                          {['PID', 'Arrival', 'Burst', 'Finish', 'Turnaround', 'Waiting', 'Response'].map(h => (
                            <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.metrics.processMetrics.map(pm => (
                          <tr key={pm.pid} className="border-t border-white/3">
                            <td className="py-2 px-3 font-mono text-slate-400">P{pm.pid}</td>
                            <td className="py-2 px-3 text-slate-400">{pm.arrivalTime}</td>
                            <td className="py-2 px-3 text-slate-400">{pm.burstTime}</td>
                            <td className="py-2 px-3 text-white">{pm.completionTime}</td>
                            <td className="py-2 px-3 text-cyan-400">{pm.turnaroundTime}</td>
                            <td className="py-2 px-3 text-amber-400">{pm.waitingTime}</td>
                            <td className="py-2 px-3 text-purple-400">{pm.responseTime}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-cyan-500/20 font-medium">
                          <td className="py-2 px-3 text-slate-400" colSpan={4}>Averages</td>
                          <td className="py-2 px-3 text-cyan-400">{result.metrics.avgTurnaroundTime.toFixed(2)}</td>
                          <td className="py-2 px-3 text-amber-400">{result.metrics.avgWaitingTime.toFixed(2)}</td>
                          <td className="py-2 px-3 text-purple-400">{result.metrics.avgResponseTime.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {activeTab === 'chart' && (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={result.metrics.processMetrics}>
                      <XAxis dataKey="pid" tickFormatter={v => `P${v}`} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} />
                      <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#111c35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                        labelFormatter={v => `P${v}`}
                      />
                      <Bar dataKey="waitingTime" name="Waiting" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="turnaroundTime" name="Turnaround" fill="#22d3ee" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {activeTab === 'explain' && (
                  <ExplainBox
                    title={`${algorithm} Scheduling Explained`}
                    what={getAlgoExplanation(algorithm).what}
                    why={getAlgoExplanation(algorithm).why}
                    concept={getAlgoExplanation(algorithm).concept}
                    next={getAlgoExplanation(algorithm).next}
                  />
                )}
              </Card>
            </motion.div>
          )}

          {!result && !loading && (
            <EmptyState
              title="No simulation results yet"
              desc="Configure your algorithm and workload, then click Run Simulation."
              action={
                <Button variant="primary" size="sm" icon={<Play size={12} />} onClick={runSimulation}>
                  Run Simulation
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Client-side FCFS fallback ───────────────────────────────
function runClientSideFCFS(processes: ProcessInput[]): { gantt: GanttSlot[]; metrics: SchedulingMetrics } {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const gantt: GanttSlot[] = [];
  const processMetrics: ProcessMetric[] = [];
  let time = 0;

  for (const p of sorted) {
    if (time < p.arrivalTime) time = p.arrivalTime;
    const start = time;
    time += p.burstTime;
    gantt.push({ pid: `P${p.pid}`, start, end: time });
    processMetrics.push({
      pid: p.pid,
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: time,
      turnaroundTime: time - p.arrivalTime,
      waitingTime: time - p.arrivalTime - p.burstTime,
      responseTime: start - p.arrivalTime,
    });
  }

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  return {
    gantt,
    metrics: {
      avgWaitingTime: avg(processMetrics.map(p => p.waitingTime)),
      avgTurnaroundTime: avg(processMetrics.map(p => p.turnaroundTime)),
      avgResponseTime: avg(processMetrics.map(p => p.responseTime)),
      cpuUtilization: 100,
      throughput: processMetrics.length / time,
      contextSwitches: processMetrics.length - 1,
      processMetrics,
    },
  };
}

function getAlgoExplanation(algo: SchedulingAlgorithm) {
  const map: Record<SchedulingAlgorithm, { what: string; why: string; concept: string; next: string }> = {
    FCFS: {
      what: 'Processes are executed in the order they arrive in the ready queue.',
      why: 'No process has a higher claim to the CPU; first-come is the simplest fair ordering.',
      concept: 'First Come First Serve (FCFS) — Non-preemptive, simple, but can cause the "convoy effect" where short jobs wait behind long ones.',
      next: 'Each process runs to completion before the next is selected. Metrics such as waiting time can be high if a long process arrives first.',
    },
    SJF: {
      what: 'The process with the shortest burst time is selected from the ready queue.',
      why: 'Shorter jobs finish faster, reducing average waiting time across all processes.',
      concept: 'Shortest Job First (SJF) — Provably optimal for average waiting time when burst times are known.',
      next: 'Each selected process runs to completion (non-preemptive). Requires knowledge of burst times in advance.',
    },
    SRTF: {
      what: 'The CPU is always given to the process with the shortest remaining execution time.',
      why: 'Preempting longer jobs for shorter ones minimizes average waiting time at the cost of more context switches.',
      concept: 'Shortest Remaining Time First (SRTF) — Preemptive variant of SJF. Optimal for average waiting time.',
      next: 'When a new process arrives, the OS checks if its burst is shorter than the current process\'s remaining time.',
    },
    RR: {
      what: `Each process is given a fixed time quantum (${''}) on the CPU, then preempted and placed at the back of the queue.`,
      why: 'Ensures every process gets equal CPU time share — fundamental for interactive and time-sharing systems.',
      concept: 'Round Robin — The backbone of modern preemptive scheduling. Context switches occur at every quantum boundary.',
      next: 'After the quantum expires, the current process returns to the tail of the ready queue. The next process at the head is dispatched.',
    },
    PRIORITY: {
      what: 'The process with the highest priority number is selected from the ready queue.',
      why: 'Important tasks (OS services, real-time threads) need guaranteed access to the CPU before background work.',
      concept: 'Priority Scheduling — Can be preemptive or non-preemptive. Risk: low-priority processes may starve.',
      next: 'Aging can be used to gradually increase the priority of waiting processes, preventing indefinite starvation.',
    },
    MLQ: {
      what: 'Processes are assigned permanently to one of several queues, each with its own scheduling algorithm.',
      why: 'Different process classes (interactive, batch, system) have fundamentally different requirements.',
      concept: 'Multilevel Queue — Queues have different priorities. A process cannot move between queues.',
      next: 'Higher-priority queues preempt lower-priority queues. Each queue can use a different algorithm internally.',
    },
    MLFQ: {
      what: 'Processes can move between queues based on their behavior and CPU usage history.',
      why: 'Unknown burst times are estimated by observing behavior. CPU-bound processes migrate down; I/O-bound stay at top.',
      concept: 'Multilevel Feedback Queue — Used in most real operating systems (macOS, Linux CFS-inspired). Adapts to process behavior.',
      next: 'A new process enters the highest-priority queue. If it uses its full quantum, it drops to a lower queue. If it does I/O, it moves up.',
    },
  };
  return map[algo];
}
