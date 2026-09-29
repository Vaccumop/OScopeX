import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Bell, Activity, Cpu, HardDrive, Users } from 'lucide-react';
import { useSimulationStore } from '@/simulation/store';
import { cn } from '@/utils';

export default function TopBar() {
  const { state, resetSimulation } = useSimulationStore();

  const cpuUtil = state.cpu.utilization;
  const memUtil = state.memory.totalFrames > 0
    ? (state.memory.usedFrames / state.memory.totalFrames) * 100
    : 0;
  const processCount = state.processes.length;
  const simTime = state.currentTime.toFixed(1);
  const simStatus = state.status;

  const statusColor = {
    idle: 'text-slate-400',
    running: 'text-green-400',
    paused: 'text-amber-400',
    completed: 'text-cyan-400',
  }[simStatus];

  const statusDot = {
    idle: 'bg-slate-400',
    running: 'bg-green-400 animate-pulse',
    paused: 'bg-amber-400',
    completed: 'bg-cyan-400',
  }[simStatus];

  return (
    <header className="h-[60px] bg-[#080e1c] border-b border-cyan-500/10 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={cn('w-2 h-2 rounded-full', statusDot)} />
        <span className={cn('text-xs font-medium uppercase tracking-wider', statusColor)}>
          {simStatus}
        </span>
      </div>

      <div className="h-4 w-px bg-cyan-500/20" />

      {/* Sim time */}
      <div className="flex items-center gap-1.5">
        <Activity size={12} className="text-cyan-400/60" />
        <span className="text-xs text-slate-400">
          Sim Time: <span className="text-cyan-400 font-mono">{simTime}ms</span>
        </span>
      </div>

      {/* CPU */}
      <div className="flex items-center gap-1.5">
        <Cpu size={12} className="text-blue-400/60" />
        <span className="text-xs text-slate-400">
          CPU: <span className={cn('font-mono', cpuUtil > 90 ? 'text-red-400' : cpuUtil > 70 ? 'text-amber-400' : 'text-blue-400')}>
            {cpuUtil.toFixed(1)}%
          </span>
        </span>
      </div>

      {/* Memory */}
      <div className="flex items-center gap-1.5">
        <HardDrive size={12} className="text-purple-400/60" />
        <span className="text-xs text-slate-400">
          Mem: <span className={cn('font-mono', memUtil > 90 ? 'text-red-400' : memUtil > 70 ? 'text-amber-400' : 'text-purple-400')}>
            {memUtil.toFixed(1)}%
          </span>
        </span>
      </div>

      {/* Processes */}
      <div className="flex items-center gap-1.5">
        <Users size={12} className="text-green-400/60" />
        <span className="text-xs text-slate-400">
          Processes: <span className="text-green-400 font-mono">{processCount}</span>
        </span>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative p-1.5 text-slate-400 hover:text-slate-200 transition-colors">
        <Bell size={15} />
        {state.events.length > 0 && (
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        )}
      </button>

      {/* Reset */}
      <button
        onClick={resetSimulation}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
      >
        <RefreshCw size={12} />
        Reset
      </button>
    </header>
  );
}
