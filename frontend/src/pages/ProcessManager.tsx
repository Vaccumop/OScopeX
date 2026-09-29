import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Play, Square, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '@/simulation/store';
import { Card, PageHeader, Button, Badge, Input, Select, EmptyState } from '@/components/ui';
import { PROCESS_STATE_COLORS } from '@/utils';
import type { Process, ProcessState } from '@/types';

const STATE_BADGE: Record<ProcessState, 'success' | 'info' | 'warning' | 'error' | 'default' | 'purple'> = {
  NEW: 'purple', READY: 'info', RUNNING: 'success',
  BLOCKED: 'warning', SUSPENDED: 'default', TERMINATED: 'default',
};

const EMPTY_FORM: Omit<Process, 'pid' | 'remainingTime' | 'programCounter' | 'registers'> = {
  name: '', state: 'NEW', arrivalTime: 0, burstTime: 4, priority: 1,
  memoryRequired: 128, ioBurst: 0, ioDevice: '', parentPid: null, numPages: 2,
};

export default function ProcessManager() {
  const { state, addProcess, updateProcess, removeProcess } = useSimulationStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const nextPid = Math.max(0, ...state.processes.map(p => p.pid)) + 1;

  const handleCreate = () => {
    if (!form.name) return;
    const p: Process = {
      ...form,
      pid: nextPid,
      remainingTime: form.burstTime,
      programCounter: Math.floor(Math.random() * 0xffff),
      registers: { AX: 0, BX: 0, CX: 0, DX: 0 },
    };
    addProcess(p);
    setShowForm(false);
    setForm({ ...EMPTY_FORM });
  };

  const setProcessState = (pid: number, newState: ProcessState) =>
    updateProcess(pid, { state: newState });

  const selectedProcess = state.processes.find(p => p.pid === selected);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Process Manager"
        subtitle="Create and manage simulated OS processes"
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={12} />} onClick={() => setShowForm(true)}>
            New Process
          </Button>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Process Table */}
        <div className="col-span-12 md:col-span-8 space-y-4">
          {/* State Summary */}
          <div className="grid grid-cols-6 gap-2">
            {(['NEW','READY','RUNNING','BLOCKED','SUSPENDED','TERMINATED'] as ProcessState[]).map(s => {
              const count = state.processes.filter(p => p.state === s).length;
              return (
                <div key={s} className="bg-[#0d1526] border border-white/5 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold font-mono" style={{ color: PROCESS_STATE_COLORS[s] }}>{count}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{s}</div>
                </div>
              );
            })}
          </div>

          <Card title="Process Table" subtitle={`${state.processes.length} processes`}>
            {state.processes.length === 0 ? (
              <EmptyState title="No processes" desc="Create a process to get started." action={
                <Button variant="primary" size="sm" icon={<Plus size={12} />} onClick={() => setShowForm(true)}>New Process</Button>
              }/>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 text-left">
                      {['PID','Name','State','Arrival','Burst','Rem','Priority','Mem','I/O','Parent','Actions'].map(h => (
                        <th key={h} className="py-2 px-2 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.processes.map(p => (
                      <motion.tr
                        key={p.pid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-t border-white/3 cursor-pointer transition-colors ${selected === p.pid ? 'bg-cyan-500/5' : 'hover:bg-white/2'}`}
                        onClick={() => setSelected(p.pid === selected ? null : p.pid)}
                      >
                        <td className="py-2 px-2 font-mono text-slate-500">P{p.pid}</td>
                        <td className="py-2 px-2 text-slate-300">{p.name}</td>
                        <td className="py-2 px-2"><Badge variant={STATE_BADGE[p.state]}>{p.state}</Badge></td>
                        <td className="py-2 px-2 text-slate-400">{p.arrivalTime}</td>
                        <td className="py-2 px-2 text-slate-400">{p.burstTime}</td>
                        <td className="py-2 px-2 text-cyan-400 font-mono">{p.remainingTime}</td>
                        <td className="py-2 px-2 text-slate-400">{p.priority}</td>
                        <td className="py-2 px-2 text-purple-400">{p.memoryRequired}B</td>
                        <td className="py-2 px-2 text-slate-500">{p.ioDevice || '—'}</td>
                        <td className="py-2 px-2 text-slate-500">{p.parentPid ? `P${p.parentPid}` : '—'}</td>
                        <td className="py-2 px-2">
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            {p.state !== 'RUNNING' && p.state !== 'TERMINATED' && (
                              <button title="Run" onClick={() => setProcessState(p.pid, 'RUNNING')}
                                className="p-1 text-green-500/50 hover:text-green-400 transition-colors">
                                <Play size={10} />
                              </button>
                            )}
                            {p.state === 'RUNNING' && (
                              <button title="Block" onClick={() => setProcessState(p.pid, 'BLOCKED')}
                                className="p-1 text-amber-500/50 hover:text-amber-400 transition-colors">
                                <Pause size={10} />
                              </button>
                            )}
                            {(p.state === 'BLOCKED' || p.state === 'SUSPENDED') && (
                              <button title="Resume" onClick={() => setProcessState(p.pid, 'READY')}
                                className="p-1 text-cyan-500/50 hover:text-cyan-400 transition-colors">
                                <Play size={10} />
                              </button>
                            )}
                            {p.state !== 'TERMINATED' && (
                              <button title="Terminate" onClick={() => setProcessState(p.pid, 'TERMINATED')}
                                className="p-1 text-red-500/50 hover:text-red-400 transition-colors">
                                <Square size={10} />
                              </button>
                            )}
                            <button title="Remove" onClick={() => removeProcess(p.pid)}
                              className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Process State Diagram */}
          <Card title="Process State Diagram">
            <div className="flex justify-center py-4">
              <svg width="520" height="160" viewBox="0 0 520 160">
                <defs>
                  <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" opacity="0.6"/>
                  </marker>
                  <marker id="arrowGray" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#475569" opacity="0.6"/>
                  </marker>
                </defs>
                {[
                  { x: 40, y: 80, label: 'NEW', color: '#6366f1', count: state.processes.filter(p=>p.state==='NEW').length },
                  { x: 150, y: 80, label: 'READY', color: '#22d3ee', count: state.processes.filter(p=>p.state==='READY').length },
                  { x: 280, y: 80, label: 'RUNNING', color: '#22c55e', count: state.processes.filter(p=>p.state==='RUNNING').length },
                  { x: 150, y: 140, label: 'BLOCKED', color: '#f59e0b', count: state.processes.filter(p=>p.state==='BLOCKED').length },
                  { x: 420, y: 80, label: 'TERM', color: '#475569', count: state.processes.filter(p=>p.state==='TERMINATED').length },
                ].map(n => (
                  <g key={n.label}>
                    <rect x={n.x-38} y={n.y-18} width={76} height={36} rx={8} fill={n.color+'1a'} stroke={n.color} strokeWidth={1.5}/>
                    <text x={n.x} y={n.y-4} textAnchor="middle" fill={n.color} fontSize={9} fontWeight="bold" fontFamily="monospace">{n.label}</text>
                    <text x={n.x} y={n.y+8} textAnchor="middle" fill={n.color} fontSize={11} fontWeight="bold">{n.count}</text>
                  </g>
                ))}
                {[
                  {x1:78,y1:80,x2:112,y2:80,m:'arrowBlue'},
                  {x1:188,y1:80,x2:242,y2:80,m:'arrowBlue'},
                  {x1:242,y1:72,x2:188,y2:72,m:'arrowGray'},
                  {x1:260,y1:98,x2:188,y2:130,m:'arrowGray'},
                  {x1:150,y1:122,x2:150,y2:98,m:'arrowBlue'},
                  {x1:318,y1:80,x2:382,y2:80,m:'arrowGray'},
                ].map((l,i)=>(
                  <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.m==='arrowBlue'?'#22d3ee':'#475569'} strokeWidth={1.5} strokeDasharray={l.m==='arrowGray'?'4 2':undefined} markerEnd={`url(#${l.m})`} opacity={0.7}/>
                ))}
              </svg>
            </div>
          </Card>
        </div>

        {/* PCB Panel */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <AnimatePresence>
            {selectedProcess ? (
              <motion.div key="pcb" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}>
                <Card title="Process Control Block" subtitle={`P${selectedProcess.pid} — ${selectedProcess.name}`}>
                  <div className="space-y-2 text-xs font-mono">
                    {[
                      {label:'PID', value:`${selectedProcess.pid}`, color:'text-cyan-400'},
                      {label:'State', value:selectedProcess.state, color:`text-${STATE_BADGE[selectedProcess.state]==='success'?'green':STATE_BADGE[selectedProcess.state]==='info'?'cyan':STATE_BADGE[selectedProcess.state]==='warning'?'amber':'slate'}-400`},
                      {label:'Program Counter', value:`0x${selectedProcess.programCounter.toString(16).padStart(4,'0').toUpperCase()}`, color:'text-purple-400'},
                      {label:'Priority', value:`${selectedProcess.priority}`, color:'text-slate-300'},
                      {label:'Burst Time', value:`${selectedProcess.burstTime}ms`, color:'text-slate-300'},
                      {label:'Remaining', value:`${selectedProcess.remainingTime}ms`, color:'text-amber-400'},
                      {label:'Memory Req', value:`${selectedProcess.memoryRequired}B`, color:'text-violet-400'},
                      {label:'Pages', value:`${selectedProcess.numPages}`, color:'text-slate-300'},
                      {label:'Parent PID', value:selectedProcess.parentPid?`P${selectedProcess.parentPid}`:'none', color:'text-slate-400'},
                      {label:'I/O Device', value:selectedProcess.ioDevice||'none', color:'text-orange-400'},
                    ].map(row=>(
                      <div key={row.label} className="flex justify-between py-1 border-b border-white/3">
                        <span className="text-slate-500">{row.label}</span>
                        <span className={row.color}>{row.value}</span>
                      </div>
                    ))}
                    <div className="pt-2">
                      <p className="text-slate-500 mb-2">CPU Registers (simulated)</p>
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(selectedProcess.registers).map(([reg, val])=>(
                          <div key={reg} className="flex justify-between bg-white/3 rounded px-2 py-1">
                            <span className="text-slate-500">{reg}</span>
                            <span className="text-green-400">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-600 pt-1">* Register values are simulated</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-slate-500 font-medium">Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>setProcessState(selectedProcess.pid,'READY')}>→ READY</Button>
                      <Button size="sm" variant="secondary" onClick={()=>setProcessState(selectedProcess.pid,'BLOCKED')}>→ BLOCK</Button>
                      <Button size="sm" variant="secondary" onClick={()=>setProcessState(selectedProcess.pid,'SUSPENDED')}>→ SUSPEND</Button>
                      <Button size="sm" variant="danger" onClick={()=>{setProcessState(selectedProcess.pid,'TERMINATED');setSelected(null);}}>TERMINATE</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{opacity:0}} animate={{opacity:1}}>
                <Card title="Process Control Block">
                  <p className="text-xs text-slate-500 text-center py-8">Click a process row to view its PCB</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Process Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={()=>setShowForm(false)}
          >
            <motion.div
              initial={{scale:0.95,y:20}} animate={{scale:1,y:0}} exit={{scale:0.95,y:20}}
              className="bg-[#0d1526] border border-cyan-500/20 rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={e=>e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-white mb-4">Create New Process (PID: {nextPid})</h3>
              <div className="space-y-3">
                <Input label="Process Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. nginx"/>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Arrival Time" type="number" min={0} value={form.arrivalTime} onChange={e=>setForm({...form,arrivalTime:+e.target.value})}/>
                  <Input label="Burst Time" type="number" min={1} value={form.burstTime} onChange={e=>setForm({...form,burstTime:+e.target.value})}/>
                  <Input label="Priority (1=high)" type="number" min={1} value={form.priority} onChange={e=>setForm({...form,priority:+e.target.value})}/>
                  <Input label="Memory (bytes)" type="number" min={1} value={form.memoryRequired} onChange={e=>setForm({...form,memoryRequired:+e.target.value})}/>
                  <Input label="I/O Burst" type="number" min={0} value={form.ioBurst} onChange={e=>setForm({...form,ioBurst:+e.target.value})}/>
                  <Input label="Pages" type="number" min={1} value={form.numPages} onChange={e=>setForm({...form,numPages:+e.target.value})}/>
                </div>
                <Input label="I/O Device" value={form.ioDevice} onChange={e=>setForm({...form,ioDevice:e.target.value})} placeholder="disk, keyboard, network"/>
                <Select label="Parent PID" value={form.parentPid?.toString()??''} onChange={e=>setForm({...form,parentPid:e.target.value?+e.target.value:null})}
                  options={[{value:'',label:'None (root process)'}, ...state.processes.filter(p=>p.state!=='TERMINATED').map(p=>({value:String(p.pid),label:`P${p.pid} — ${p.name}`}))]}/>
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="secondary" className="flex-1" onClick={()=>setShowForm(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleCreate} disabled={!form.name}>Create Process</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
