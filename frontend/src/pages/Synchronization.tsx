import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulateProducerConsumer, simulateReadersWriters, simulateDiningPhilosophers } from '@/services/api';
import { Card, PageHeader, Button, Input, Badge, ExplainBox } from '@/components/ui';
import { generateId } from '@/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ── Client-side fallbacks ─────────────────────────────────────

function clientProducerConsumer(producers: number, consumers: number, bufferSize: number, prodRate: number, consRate: number, steps: number) {
  const events: { time: number; type: string; actor: string; detail: string }[] = [];
  const bufferStates: number[] = [];
  let buffer = 0;
  let overflows = 0, underflows = 0, produced = 0, consumed = 0;
  for (let t = 0; t < steps; t++) {
    for (let p = 0; p < producers; p++) {
      if (Math.random() < prodRate / 10) {
        if (buffer < bufferSize) {
          buffer++;
          produced++;
          events.push({ time: t, type: 'PRODUCE', actor: `P${p+1}`, detail: `Buffer: ${buffer}/${bufferSize}` });
        } else {
          overflows++;
          events.push({ time: t, type: 'BLOCKED', actor: `P${p+1}`, detail: 'Buffer full' });
        }
      }
    }
    for (let c = 0; c < consumers; c++) {
      if (Math.random() < consRate / 10) {
        if (buffer > 0) {
          buffer--;
          consumed++;
          events.push({ time: t, type: 'CONSUME', actor: `C${c+1}`, detail: `Buffer: ${buffer}/${bufferSize}` });
        } else {
          underflows++;
          events.push({ time: t, type: 'BLOCKED', actor: `C${c+1}`, detail: 'Buffer empty' });
        }
      }
    }
    bufferStates.push(buffer);
  }
  return { events, bufferStates, metrics: { throughput: consumed / steps, avgBufferLevel: bufferStates.reduce((a,b)=>a+b,0)/bufferStates.length, overflowCount: overflows, underflowCount: underflows } };
}

function clientReadersWriters(readers: number, writers: number, steps: number) {
  const events: { time: number; type: string; actor: string; detail: string }[] = [];
  let activeReaders = 0, activeWriters = 0;
  for (let t = 0; t < steps; t++) {
    if (activeWriters === 0 && Math.random() < 0.4 && activeReaders < readers) {
      activeReaders++;
      events.push({ time: t, type: 'READ_START', actor: `R${activeReaders}`, detail: `${activeReaders} readers active` });
    }
    if (activeReaders === 0 && activeWriters === 0 && Math.random() < 0.2) {
      activeWriters = 1;
      events.push({ time: t, type: 'WRITE_START', actor: `W1`, detail: 'Exclusive write lock' });
    }
    if (activeReaders > 0 && Math.random() < 0.3) {
      events.push({ time: t, type: 'READ_END', actor: `R${activeReaders}`, detail: 'Reader finished' });
      activeReaders = Math.max(0, activeReaders - 1);
    }
    if (activeWriters > 0 && Math.random() < 0.4) {
      events.push({ time: t, type: 'WRITE_END', actor: 'W1', detail: 'Write complete' });
      activeWriters = 0;
    }
  }
  return { events, metrics: { totalReads: events.filter(e=>e.type==='READ_END').length, totalWrites: events.filter(e=>e.type==='WRITE_END').length } };
}

function clientDiningPhilosophers(n: number, steps: number, preventDeadlock: boolean) {
  const stateNames = ['THINKING','HUNGRY','EATING'];
  const states: string[][] = [];
  const pStates = Array(n).fill('THINKING');
  const forks = Array(n).fill(false); // false = available
  for (let t = 0; t < steps; t++) {
    for (let i = 0; i < n; i++) {
      if (pStates[i] === 'THINKING' && Math.random() < 0.3) pStates[i] = 'HUNGRY';
      else if (pStates[i] === 'HUNGRY') {
        const left = i, right = (i + 1) % n;
        const pickLeft = preventDeadlock && i === n-1 ? right : left;
        const pickRight = preventDeadlock && i === n-1 ? left : right;
        if (!forks[pickLeft] && !forks[pickRight]) {
          forks[pickLeft] = true; forks[pickRight] = true;
          pStates[i] = 'EATING';
        }
      } else if (pStates[i] === 'EATING' && Math.random() < 0.4) {
        const left = i, right = (i + 1) % n;
        forks[left] = false; forks[right] = false;
        pStates[i] = 'THINKING';
      }
    }
    states.push([...pStates]);
  }
  return { events: [], states };
}

const PHIL_COLORS: Record<string,string> = { THINKING:'#22d3ee', HUNGRY:'#f59e0b', EATING:'#22c55e' };

export default function Synchronization() {
  const [tab, setTab] = useState<'pc'|'rw'|'dp'>('pc');
  const [loading, setLoading] = useState(false);

  // Producer-Consumer state
  const [pcConfig, setPcConfig] = useState({ producers:2, consumers:2, bufferSize:5, productionRate:3, consumptionRate:2, steps:30 });
  const [pcResult, setPcResult] = useState<ReturnType<typeof clientProducerConsumer>|null>(null);

  // Readers-Writers state
  const [rwConfig, setRwConfig] = useState({ readers:3, writers:2, steps:30, writerPriority:false });
  const [rwResult, setRwResult] = useState<ReturnType<typeof clientReadersWriters>|null>(null);

  // Dining Philosophers state
  const [dpConfig, setDpConfig] = useState({ philosophers:5, steps:20, preventDeadlock:true });
  const [dpResult, setDpResult] = useState<ReturnType<typeof clientDiningPhilosophers>|null>(null);
  const [dpStep, setDpStep] = useState(0);

  const runPC = async () => {
    setLoading(true);
    try {
      const r = await simulateProducerConsumer({ ...pcConfig });
      setPcResult({ events: (r.events as unknown as {time:number;type:string;actor:string;detail:string}[]), bufferStates: r.bufferStates, metrics: r.metrics as ReturnType<typeof clientProducerConsumer>['metrics'] });
    } catch {
      setPcResult(clientProducerConsumer(pcConfig.producers, pcConfig.consumers, pcConfig.bufferSize, pcConfig.productionRate, pcConfig.consumptionRate, pcConfig.steps));
    } finally { setLoading(false); }
  };

  const runRW = async () => {
    setLoading(true);
    try {
      const r = await simulateReadersWriters({ ...rwConfig });
      setRwResult({ events: r.events as unknown as {time:number;type:string;actor:string;detail:string}[], metrics: r.metrics as ReturnType<typeof clientReadersWriters>['metrics'] });
    } catch {
      setRwResult(clientReadersWriters(rwConfig.readers, rwConfig.writers, rwConfig.steps));
    } finally { setLoading(false); }
  };

  const runDP = async () => {
    setLoading(true);
    try {
      const r = await simulateDiningPhilosophers({ ...dpConfig });
      setDpResult({ events: [], states: r.states });
      setDpStep(0);
    } catch {
      const res = clientDiningPhilosophers(dpConfig.philosophers, dpConfig.steps, dpConfig.preventDeadlock);
      setDpResult(res);
      setDpStep(0);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Synchronization" subtitle="Simulate classical OS synchronization problems"/>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5">
        {[{key:'pc',label:'Producer-Consumer'},{key:'rw',label:'Readers-Writers'},{key:'dp',label:'Dining Philosophers'}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${tab===t.key?'border-cyan-400 text-cyan-400':'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pc' && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 space-y-4">
            <Card title="Configuration">
              <div className="space-y-3">
                {[
                  {label:'Producers',key:'producers',min:1,max:5},
                  {label:'Consumers',key:'consumers',min:1,max:5},
                  {label:'Buffer Size',key:'bufferSize',min:1,max:20},
                  {label:'Production Rate',key:'productionRate',min:1,max:10},
                  {label:'Consumption Rate',key:'consumptionRate',min:1,max:10},
                  {label:'Steps',key:'steps',min:10,max:100},
                ].map(f=>(
                  <Input key={f.key} label={f.label} type="number" min={f.min} max={f.max}
                    value={pcConfig[f.key as keyof typeof pcConfig]}
                    onChange={e=>setPcConfig({...pcConfig,[f.key]:+e.target.value})}/>
                ))}
                <Button variant="primary" className="w-full" icon={<Play size={12}/>} loading={loading} onClick={runPC}>Run Simulation</Button>
              </div>
            </Card>
          </div>
          <div className="col-span-12 md:col-span-8 space-y-4">
            {pcResult ? (
              <>
                {/* Visual Buffer */}
                <Card title="Buffer State Visualization">
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-slate-500">Producers</div>
                    <div className="flex gap-1">
                      {Array(pcConfig.producers).fill(0).map((_,i)=>(
                        <div key={i} className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-400">P{i+1}</div>
                      ))}
                    </div>
                    <div className="text-slate-600">→</div>
                    <div className="flex gap-1 flex-1">
                      {Array(pcConfig.bufferSize).fill(0).map((_,i)=>(
                        <div key={i} className={`h-8 flex-1 rounded border text-[8px] flex items-center justify-center transition-all ${i < (pcResult.bufferStates[pcResult.bufferStates.length-1]??0) ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-white/3 border-white/10 text-slate-600'}`}>
                          {i < (pcResult.bufferStates[pcResult.bufferStates.length-1]??0) ? '●' : '○'}
                        </div>
                      ))}
                    </div>
                    <div className="text-slate-600">→</div>
                    <div className="flex gap-1">
                      {Array(pcConfig.consumers).fill(0).map((_,i)=>(
                        <div key={i} className="w-8 h-8 rounded bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[10px] text-purple-400">C{i+1}</div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">Consumers</div>
                  </div>
                </Card>
                <Card title="Buffer Level Over Time">
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={pcResult.bufferStates.map((v,i)=>({t:i,v}))}>
                      <defs><linearGradient id="bufGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs>
                      <XAxis dataKey="t" tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                      <YAxis domain={[0,pcConfig.bufferSize]} tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:'#111c35',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,fontSize:11}}/>
                      <Area type="monotone" dataKey="v" stroke="#22c55e" fill="url(#bufGrad)" strokeWidth={2} dot={false}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {label:'Throughput',value:pcResult.metrics.throughput.toFixed(2),color:'text-cyan-400'},
                    {label:'Avg Buffer',value:pcResult.metrics.avgBufferLevel.toFixed(1),color:'text-green-400'},
                    {label:'Overflows',value:pcResult.metrics.overflowCount,color:'text-red-400'},
                    {label:'Underflows',value:pcResult.metrics.underflowCount,color:'text-amber-400'},
                  ].map(m=>(
                    <div key={m.label} className="bg-[#111c35] rounded-lg p-3 text-center border border-white/5">
                      <div className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
                <Card title="Event Log" subtitle={`${pcResult.events.slice(-20).length} recent events`}>
                  <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-[10px]">
                    {pcResult.events.slice(-20).map((ev,i)=>(
                      <div key={i} className="flex gap-2 py-0.5">
                        <span className="text-slate-600 w-8">t{ev.time}</span>
                        <span className={ev.type==='BLOCKED'?'text-red-400':ev.type==='PRODUCE'?'text-cyan-400':'text-purple-400'}>{ev.type}</span>
                        <span className="text-slate-400">{ev.actor}</span>
                        <span className="text-slate-600">{ev.detail}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card><ExplainBox what="Producers add items to a shared bounded buffer; consumers remove them." why="Without synchronization, producers overfill the buffer or consumers read from an empty one, causing race conditions." concept="Producer-Consumer Problem — Uses semaphores (empty, full) and a mutex to coordinate access to the shared buffer." next="Run the simulation to see buffer state changes and blocking events."/></Card>
            )}
          </div>
        </div>
      )}

      {tab === 'rw' && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <Card title="Configuration">
              <div className="space-y-3">
                <Input label="Readers" type="number" min={1} max={5} value={rwConfig.readers} onChange={e=>setRwConfig({...rwConfig,readers:+e.target.value})}/>
                <Input label="Writers" type="number" min={1} max={3} value={rwConfig.writers} onChange={e=>setRwConfig({...rwConfig,writers:+e.target.value})}/>
                <Input label="Steps" type="number" min={10} max={100} value={rwConfig.steps} onChange={e=>setRwConfig({...rwConfig,steps:+e.target.value})}/>
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input type="checkbox" className="accent-cyan-400" checked={rwConfig.writerPriority} onChange={e=>setRwConfig({...rwConfig,writerPriority:e.target.checked})}/>
                  Writer Priority
                </label>
                <Button variant="primary" className="w-full" icon={<Play size={12}/>} loading={loading} onClick={runRW}>Run</Button>
              </div>
            </Card>
          </div>
          <div className="col-span-12 md:col-span-8 space-y-4">
            {rwResult ? (
              <>
                <Card title="Event Timeline">
                  <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-[10px]">
                    {rwResult.events.map((ev,i)=>(
                      <div key={i} className="flex gap-2 py-0.5 border-b border-white/3">
                        <span className="text-slate-600 w-8">t{ev.time}</span>
                        <span className={ev.type.includes('WRITE')?'text-red-400':'text-cyan-400'}>{ev.type}</span>
                        <span className="text-slate-400">{ev.actor}</span>
                        <span className="text-slate-600">{ev.detail}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-400">{rwResult.metrics.totalReads}</div>
                    <div className="text-xs text-slate-500 mt-1">Total Reads</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{rwResult.metrics.totalWrites}</div>
                    <div className="text-xs text-slate-500 mt-1">Total Writes</div>
                  </div>
                </div>
              </>
            ) : (
              <Card><ExplainBox what="Multiple readers can access a shared resource simultaneously, but writers require exclusive access." why="If readers and writers access simultaneously without coordination, data corruption occurs." concept="Readers-Writers Problem — Solved with read/write locks. Writer priority prevents reader starvation." next="Run to see read/write scheduling and potential starvation scenarios."/></Card>
            )}
          </div>
        </div>
      )}

      {tab === 'dp' && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <Card title="Configuration">
              <div className="space-y-3">
                <Input label="Philosophers" type="number" min={3} max={7} value={dpConfig.philosophers} onChange={e=>setDpConfig({...dpConfig,philosophers:+e.target.value})}/>
                <Input label="Steps" type="number" min={5} max={50} value={dpConfig.steps} onChange={e=>setDpConfig({...dpConfig,steps:+e.target.value})}/>
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input type="checkbox" className="accent-cyan-400" checked={dpConfig.preventDeadlock} onChange={e=>setDpConfig({...dpConfig,preventDeadlock:e.target.checked})}/>
                  Prevent Deadlock (asymmetric)
                </label>
                <Button variant="primary" className="w-full" icon={<Play size={12}/>} loading={loading} onClick={runDP}>Run</Button>
              </div>
            </Card>
            {dpResult && (
              <Card title="Step Replay" className="mt-4">
                <div className="space-y-2">
                  <input type="range" min={0} max={dpResult.states.length-1} value={dpStep} onChange={e=>setDpStep(+e.target.value)} className="w-full accent-cyan-400"/>
                  <p className="text-xs text-slate-500 text-center">Step {dpStep}/{dpResult.states.length-1}</p>
                  <div className="space-y-1">
                    {dpResult.states[dpStep]?.map((s,i)=>(
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Philosopher {i+1}</span>
                        <Badge variant={s==='EATING'?'success':s==='HUNGRY'?'warning':'info'}>{s}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
          <div className="col-span-12 md:col-span-8">
            {dpResult ? (
              <Card title="Dining Table Visualization">
                <div className="flex justify-center">
                  <svg width="320" height="320" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                    <circle cx="160" cy="160" r="40" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                    {dpResult.states[dpStep]?.map((s,i)=>{
                      const n = dpConfig.philosophers;
                      const angle = (2*Math.PI*i/n) - Math.PI/2;
                      const px = 160 + 110*Math.cos(angle);
                      const py = 160 + 110*Math.sin(angle);
                      const fx = 160 + 72*Math.cos(angle + Math.PI/n);
                      const fy = 160 + 72*Math.sin(angle + Math.PI/n);
                      const color = PHIL_COLORS[s];
                      return (
                        <g key={i}>
                          <circle cx={fx} cy={fy} r={8} fill="rgba(255,255,255,0.05)" stroke="#475569" strokeWidth={1}/>
                          <text x={fx} y={fy+4} textAnchor="middle" fill="#64748b" fontSize={7}>🍴</text>
                          <circle cx={px} cy={py} r={22} fill={color+'22'} stroke={color} strokeWidth={2}/>
                          <text x={px} y={py-6} textAnchor="middle" fill={color} fontSize={10} fontWeight="bold">{i+1}</text>
                          <text x={px} y={py+6} textAnchor="middle" fill={color} fontSize={7}>{s.slice(0,4)}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </Card>
            ) : (
              <Card><ExplainBox what="N philosophers sit at a round table with one fork between each adjacent pair. Each must pick up both adjacent forks to eat." why="If all philosophers pick up their left fork simultaneously, no one can pick up their right fork — deadlock." concept="Dining Philosophers — Demonstrates deadlock, starvation, and solutions like asymmetric resource ordering." next="Run to see philosophers cycling through THINKING→HUNGRY→EATING states."/></Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
