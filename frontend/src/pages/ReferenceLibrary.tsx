import React, { useState } from 'react';
import {
  Library,
  Terminal,
  Search,
  FileCode,
  Shield,
  Layers,
} from 'lucide-react';

interface SignalRef {
  number: number;
  name: string;
  defaultAction: string;
  description: string;
}

const SIGNALS: SignalRef[] = [
  { number: 1, name: 'SIGHUP', defaultAction: 'Terminate', description: 'Hangup detected on controlling terminal or death of controlling process.' },
  { number: 2, name: 'SIGINT', defaultAction: 'Terminate', description: 'Interrupt from keyboard (Ctrl+C). Process can catch and handle this.' },
  { number: 3, name: 'SIGQUIT', defaultAction: 'Core dump', description: 'Quit from keyboard (Ctrl+\\). Generates a memory core dump.' },
  { number: 9, name: 'SIGKILL', defaultAction: 'Immediate Terminate', description: 'Kill signal. CANNOT be caught, blocked, or ignored by any process.' },
  { number: 11, name: 'SIGSEGV', defaultAction: 'Core dump', description: 'Segmentation violation: invalid memory access or page permission fault.' },
  { number: 13, name: 'SIGPIPE', defaultAction: 'Terminate', description: 'Broken pipe: written to pipe with no readers available.' },
  { number: 15, name: 'SIGTERM', defaultAction: 'Terminate', description: 'Polite termination signal. Gives process opportunity to clean up files.' },
  { number: 17, name: 'SIGCHLD', defaultAction: 'Ignore', description: 'Child process status has changed (terminated, stopped, or resumed).' },
  { number: 18, name: 'SIGCONT', defaultAction: 'Continue', description: 'Continue executing if currently stopped.' },
  { number: 19, name: 'SIGSTOP', defaultAction: 'Stop', description: 'Stop execution. CANNOT be caught, blocked, or ignored by any process.' },
];

interface CommandRef {
  cmd: string;
  category: string;
  example: string;
  desc: string;
}

const LINUX_COMMANDS: CommandRef[] = [
  { cmd: 'ps aux', category: 'Process', example: 'ps aux | grep nginx', desc: 'Lists all currently running processes with PID, user, %CPU, %MEM.' },
  { cmd: 'top / htop', category: 'Process', example: 'top', desc: 'Real-time interactive dynamic process viewer and resource monitor.' },
  { cmd: 'kill -9 <PID>', category: 'Process', example: 'kill -9 4123', desc: 'Sends SIGKILL to immediately terminate a runaway or unresponsive process.' },
  { cmd: 'strace', category: 'System Calls', example: 'strace -c ./app', desc: 'Intercepts and records all system calls called by a process.' },
  { cmd: 'vmstat', category: 'Memory', example: 'vmstat 1 5', desc: 'Reports virtual memory statistics, swap activity, and CPU metrics.' },
  { cmd: 'free -m', category: 'Memory', example: 'free -h', desc: 'Displays total amount of free and used physical memory and swap in MB/GB.' },
  { cmd: 'iostat', category: 'I/O', example: 'iostat -xz 1', desc: 'Monitors system input/output device loading and disk transfer rates.' },
  { cmd: 'df -h', category: 'Storage', example: 'df -h /', desc: 'Shows file system disk space usage in human-readable format.' },
  { cmd: 'lsof', category: 'File', example: 'lsof -i :8001', desc: 'Lists open files and active network listening sockets.' },
  { cmd: 'chmod', category: 'Permissions', example: 'chmod 755 run.sh', desc: 'Changes file mode bits (read, write, execute permissions).' },
];

export default function ReferenceLibrary() {
  const [activeTab, setActiveTab] = useState<'signals' | 'commands'>('signals');
  const [filterText, setFilterText] = useState('');

  const filteredSignals = SIGNALS.filter(
    (s) =>
      !filterText ||
      s.name.toLowerCase().includes(filterText.toLowerCase()) ||
      s.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredCommands = LINUX_COMMANDS.filter(
    (c) =>
      !filterText ||
      c.cmd.toLowerCase().includes(filterText.toLowerCase()) ||
      c.desc.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Library size={14} /> Developer & Systems Reference
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          OS Reference Library & POSIX Cheat Sheet
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Standardized reference tables for POSIX signals, kernel system calls, and essential Linux terminal commands for operating systems debugging.
        </p>

        {/* Tab & Search */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'signals'
                  ? 'bg-cyan-500 text-[#080e1c] shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              POSIX Signals Table
            </button>
            <button
              onClick={() => setActiveTab('commands')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'commands'
                  ? 'bg-cyan-500 text-[#080e1c] shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Linux OS Commands
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter references..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'signals' ? (
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 uppercase font-mono text-[11px]">
                  <th className="py-3 px-4 w-16">Signal #</th>
                  <th className="py-3 px-4 text-cyan-400 w-28">Name</th>
                  <th className="py-3 px-4 w-32">Default Action</th>
                  <th className="py-3 px-4">Description & Handling Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                {filteredSignals.map((sig) => (
                  <tr key={sig.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-slate-400">{sig.number}</td>
                    <td className="py-3 px-4 font-bold text-white">{sig.name}</td>
                    <td className="py-3 px-4 text-amber-300 text-[11px]">{sig.defaultAction}</td>
                    <td className="py-3 px-4 font-sans text-xs text-slate-300 leading-relaxed">
                      {sig.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommands.map((c) => (
            <div
              key={c.cmd}
              className="p-5 rounded-2xl bg-[#0d1526] border border-white/5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 font-bold">
                    {c.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-mono">{c.cmd}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">{c.desc}</p>
              </div>

              <div className="pt-2 border-t border-white/5">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Example syntax:</div>
                <div className="p-2 rounded-lg bg-black/40 text-green-300 font-mono text-xs mt-1">
                  $ {c.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
