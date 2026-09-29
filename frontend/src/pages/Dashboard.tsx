import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, HardDrive, Users, Activity, Disc, Zap,
  AlertCircle, CheckCircle, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useSimulationStore } from '@/simulation/store';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import { PROCESS_STATE_COLORS, EVENT_COLORS } from '@/utils';

const cpuData = [
  { t: '0', v: 20 }, { t: '1', v: 45 }, { t: '2', v: 60 }, { t: '3', v: 55 },
  { t: '4', v: 72 }, { t: '5', v: 80 }, { t: '6', v: 72 },
];

export default function Dashboard() {
  const { state } = useSimulationStore();
  const navigate = useNavigate();

  const processStats = useMemo(() => {
    const counts = { NEW: 0, READY: 0, RUNNING: 0, BLOCKED: 0, SUSPENDED: 0, TERMINATED: 0 };
    for (const p of state.processes) counts[p.state]++;
    return counts;
  }, [state.processes]);

  const memPct = state.memory.totalFrames > 0
    ? (state.memory.usedFrames / state.memory.totalFrames) * 100 : 0;

  const recentEvents = [...state.events].reverse().slice(0, 10);

  const stateBadge = (s: string) => {
    const map: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default' | 'purple'> = {
      NEW: 'purple', READY: 'info', RUNNING: 'success', BLOCKED: 'warning',
      SUSPENDED: 'default', TERMINATED: 'default',
    };
    return map[s] ?? 'default';
  };

  const pieData = Object.entries(processStats)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k, value: v, color: PROCESS_STATE_COLORS[k] }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">OS Digital Twin</h1>
          <p className="text-xs text-slate-500 mt-0.5">Live system overview — Simulation time: <span className="text-cyan-400 font-mono">{state.currentTime.toFixed(1)}ms</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Demo Scenario Loaded</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="CPU Utilization"
          value={state.cpu.utilization.toFixed(1)}
          unit="%"
          color={state.cpu.utilization > 90 ? 'text-red-400' : 'text-blue-400'}
          icon={<Cpu size={14} />}
          sub={`Algorithm: ${state.cpu.algorithm}`}
        />
        <StatCard
          label="Memory Frames"
          value={`${state.memory.usedFrames}/${state.memory.totalFrames}`}
          color="text-purple-400"
          icon={<HardDrive size={14} />}
          sub={`${memPct.toFixed(1)}% used · ${state.memory.pageFaults} faults`}
        />
        <StatCard
          label="Processes"
          value={state.processes.length}
          color="text-green-400"
          icon={<Users size={14} />}
          sub={`${processStats.RUNNING} running · ${processStats.BLOCKED} blocked`}
        />
        <StatCard
          label="Context Switches"
          value={state.cpu.contextSwitches}
          color="text-amber-400"
          icon={<Activity size={14} />}
          sub={`Current: ${state.cpu.currentProcess ?? 'IDLE'}`}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* CPU Timeline */}
        <Card className="col-span-12 md:col-span-7" title="CPU Utilization Timeline" subtitle="Last 7 simulation ticks">
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={cpuData}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#111c35', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Area type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} fill="url(#cpuGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Process Distribution */}
        <Card className="col-span-12 md:col-span-5" title="Process States">
          <div className="flex items-center gap-4">
            <PieChart width={100} height={100}>
              <Pie data={pieData} cx={50} cy={50} innerRadius={25} outerRadius={45} dataKey="value" stroke="none">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex-1 space-y-2">
              {Object.entries(processStats).map(([state, count]) => count > 0 && (
                <div key={state} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: PROCESS_STATE_COLORS[state] }} />
                    <span className="text-xs text-slate-400">{state}</span>
                  </div>
                  <span className="text-xs font-mono text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Process State Diagram */}
        <Card className="col-span-12 md:col-span-7" title="Process State Machine">
          <div className="flex items-center justify-center py-2">
            <svg width="400" height="120" viewBox="0 0 400 120">
              {/* Nodes */}
              {[
                { x: 30, y: 50, label: 'NEW', color: '#6366f1' },
                { x: 130, y: 50, label: 'READY', color: '#22d3ee' },
                { x: 250, y: 50, label: 'RUNNING', color: '#22c55e' },
                { x: 130, y: 95, label: 'BLOCKED', color: '#f59e0b' },
                { x: 355, y: 50, label: 'TERM', color: '#64748b' },
              ].map(n => (
                <g key={n.label}>
                  <rect x={n.x - 28} y={n.y - 12} width={56} height={24} rx={6}
                    fill={n.color + '22'} stroke={n.color} strokeWidth={1} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color}
                    fontSize={9} fontFamily="monospace" fontWeight="bold">{n.label}</text>
                </g>
              ))}
              {/* Arrows */}
              <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#475569" />
                </marker>
              </defs>
              {[
                { x1: 58, y1: 50, x2: 102, y2: 50 },  // NEW→READY
                { x1: 158, y1: 50, x2: 222, y2: 50 },  // READY→RUNNING
                { x1: 222, y1: 55, x2: 158, y2: 55 },  // RUNNING→READY (preempt)
                { x1: 250, y1: 62, x2: 185, y2: 88 },  // RUNNING→BLOCKED
                { x1: 130, y1: 83, x2: 130, y2: 62 },  // BLOCKED→READY
                { x1: 278, y1: 50, x2: 327, y2: 50 },  // RUNNING→TERM
              ].map((l, i) => (
                <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="#475569" strokeWidth={1.5} markerEnd="url(#arr)" />
              ))}
            </svg>
          </div>

          {/* Process Table */}
          <div className="mt-2 space-y-1">
            {state.processes.slice(0, 4).map(p => (
              <div key={p.pid} className="flex items-center gap-3 py-1.5 border-b border-white/3">
                <span className="text-xs font-mono text-slate-500 w-6">P{p.pid}</span>
                <span className="text-xs text-slate-300 flex-1">{p.name}</span>
                <Badge variant={stateBadge(p.state)}>{p.state}</Badge>
                <div className="w-20">
                  <ProgressBar
                    value={p.burstTime - p.remainingTime}
                    max={p.burstTime}
                    color={PROCESS_STATE_COLORS[p.state]}
                    height={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Memory Map */}
        <Card className="col-span-12 md:col-span-5" title="Memory Frame Map" subtitle={`${state.memory.usedFrames}/${state.memory.totalFrames} frames used`}>
          <div className="grid grid-cols-8 gap-1 mb-3">
            {state.memory.frameTable.map(frame => (
              <div
                key={frame.frameId}
                className="h-6 rounded text-[8px] font-mono flex items-center justify-center border"
                style={{
                  background: frame.pid ? PROCESS_STATE_COLORS['RUNNING'] + '33' : 'rgba(255,255,255,0.03)',
                  borderColor: frame.pid ? PROCESS_STATE_COLORS['RUNNING'] + '66' : 'rgba(255,255,255,0.05)',
                  color: frame.pid ? '#22c55e' : '#334155',
                }}
                title={frame.pid ? `P${frame.pid} pg${frame.pageNum}` : 'Free'}
              >
                {frame.pid ? `P${frame.pid}` : '·'}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
              <p className="text-lg font-bold font-mono text-red-400">{state.memory.pageFaults}</p>
              <p className="text-[10px] text-slate-500">Faults</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
              <p className="text-lg font-bold font-mono text-green-400">{state.memory.pageHits}</p>
              <p className="text-[10px] text-slate-500">Hits</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
              <p className="text-lg font-bold font-mono text-cyan-400">
                {state.memory.pageHits + state.memory.pageFaults > 0
                  ? ((state.memory.pageHits / (state.memory.pageHits + state.memory.pageFaults)) * 100).toFixed(0)
                  : '—'}%
              </p>
              <p className="text-[10px] text-slate-500">Hit Ratio</p>
            </div>
          </div>
        </Card>

        {/* Disk & I/O Status */}
        <Card className="col-span-12 md:col-span-4" title="Disk Scheduler" subtitle={`Algorithm: ${state.disk.algorithm}`}>
          <div className="relative h-12 flex items-center mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-white/10" />
            </div>
            <div
              className="absolute w-3 h-8 bg-cyan-500/30 border border-cyan-400 rounded"
              style={{ left: `${(state.disk.headPosition / 199) * 90}%`, transition: 'left 0.5s ease' }}
            >
              <div className="text-[8px] text-cyan-400 font-mono text-center mt-1">{state.disk.headPosition}</div>
            </div>
            <div className="absolute left-0 text-[8px] text-slate-600">0</div>
            <div className="absolute right-0 text-[8px] text-slate-600">199</div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500">Request Queue</p>
            <div className="flex flex-wrap gap-1">
              {state.disk.requestQueue.map((r, i) => (
                <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-slate-500">Total seek: <span className="text-amber-400 font-mono">{state.disk.totalSeekDistance}</span></span>
          </div>
        </Card>

        {/* I/O Status */}
        <Card className="col-span-12 md:col-span-4" title="I/O Devices">
          <div className="space-y-3">
            {[
              { name: 'Keyboard', active: true, queue: state.io.deviceQueues.keyboard ?? [], color: 'text-cyan-400' },
              { name: 'Disk', active: state.io.activeOperations > 0, queue: state.io.deviceQueues.disk ?? [], color: 'text-amber-400' },
              { name: 'Network', active: false, queue: [], color: 'text-purple-400' },
            ].map(dev => (
              <div key={dev.name} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${dev.active ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-xs text-slate-400 flex-1">{dev.name}</span>
                {dev.queue.length > 0
                  ? <Badge variant="warning">{dev.queue.length} waiting</Badge>
                  : <Badge variant={dev.active ? 'success' : 'default'}>{dev.active ? 'Busy' : 'Idle'}</Badge>
                }
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-white/5 pt-3">
            <p className="text-[10px] text-slate-500 mb-1">Buffer Utilization</p>
            <ProgressBar value={state.io.bufferUtilization} max={100} color="#fb923c" height={6} showLabel />
          </div>
        </Card>

        {/* Event Stream */}
        <Card className="col-span-12 md:col-span-4" title="System Event Stream">
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {recentEvents.map(ev => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 py-1 border-b border-white/3"
              >
                <span className="text-[9px] font-mono text-slate-600 w-10 flex-shrink-0 mt-0.5">
                  {ev.timestamp.toFixed(1)}ms
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                  style={{ background: EVENT_COLORS[ev.type] ?? '#475569' }}
                />
                <div>
                  <span className="text-[10px] font-medium" style={{ color: EVENT_COLORS[ev.type] ?? '#94a3b8' }}>
                    {ev.type.replace(/_/g, ' ')}
                  </span>
                  {ev.process && (
                    <span className="text-[10px] text-slate-500 ml-1">· {ev.process}</span>
                  )}
                  {ev.explanation && (
                    <p className="text-[9px] text-slate-600 mt-0.5">{ev.explanation}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Navigation */}
        <Card className="col-span-12" title="Quick Actions" subtitle="Navigate to any module">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[
              { label: 'CPU Scheduler', path: '/scheduling', color: 'border-blue-500/30 hover:border-blue-400/60' },
              { label: 'Process Mgr', path: '/processes', color: 'border-green-500/30 hover:border-green-400/60' },
              { label: 'Deadlocks', path: '/deadlocks', color: 'border-red-500/30 hover:border-red-400/60' },
              { label: 'Page Replace', path: '/page-replacement', color: 'border-violet-500/30 hover:border-violet-400/60' },
              { label: 'Disk Sched', path: '/disk', color: 'border-amber-500/30 hover:border-amber-400/60' },
              { label: 'Sync', path: '/synchronization', color: 'border-purple-500/30 hover:border-purple-400/60' },
              { label: 'What-If Lab', path: '/what-if', color: 'border-cyan-500/30 hover:border-cyan-400/60' },
              { label: 'Learn OS', path: '/learn', color: 'border-emerald-500/30 hover:border-emerald-400/60' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 bg-white/3 border rounded-lg text-[11px] text-slate-400 hover:text-white transition-all ${item.color}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
