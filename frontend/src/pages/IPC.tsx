import React, { useState } from 'react';
import { Play, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, PageHeader, Button, Input, Select, Badge } from '@/components/ui';
import { generateId } from '@/utils';

type Mechanism = 'PIPE' | 'MESSAGE_QUEUE' | 'SHARED_MEMORY' | 'SIGNALS';

interface IPCEvent { id:string; time:number; type:string; sender:string; receiver:string; content:string; }

const SIGNALS = ['SIGINT','SIGTERM','SIGSTOP','SIGCONT','SIGUSR1','SIGKILL'];
const SIG_COLORS: Record<string,string> = { SIGINT:'text-red-400',SIGTERM:'text-red-500',SIGSTOP:'text-amber-400',SIGCONT:'text-green-400',SIGUSR1:'text-cyan-400',SIGKILL:'text-red-600' };

function simulateIPC(mechanism: Mechanism, senders: number, receivers: number, messages: number, bufferSize: number): IPCEvent[] {
  const events: IPCEvent[] = [];
  let buffer: string[] = [];
  for (let i = 0; i < messages; i++) {
    const sender = `S${(i % senders) + 1}`;
    const receiver = `R${(i % receivers) + 1}`;
    const content = `msg_${i+1}`;
    if (mechanism === 'PIPE' || mechanism === 'MESSAGE_QUEUE') {
      if (buffer.length < bufferSize) {
        buffer.push(content);
        events.push({ id: generateId(), time: i*0.5, type:'SEND', sender, receiver:'BUFFER', content });
      } else {
        events.push({ id: generateId(), time: i*0.5, type:'BLOCKED', sender, receiver:'BUFFER', content:'Buffer full' });
      }
      if (buffer.length > 0 && Math.random() > 0.3) {
        const msg = buffer.shift()!;
        events.push({ id: generateId(), time: i*0.5+0.2, type:'RECEIVE', sender:'BUFFER', receiver, content: msg });
      }
    } else if (mechanism === 'SHARED_MEMORY') {
      events.push({ id: generateId(), time: i*0.3, type:'WRITE', sender, receiver:'SHM_0x4000', content });
      events.push({ id: generateId(), time: i*0.3+0.1, type:'READ', sender:'SHM_0x4000', receiver, content });
    } else {
      events.push({ id: generateId(), time: i*0.5, type:'SIGNAL', sender, receiver, content: SIGNALS[i%SIGNALS.length] });
    }
  }
  return events;
}

export default function IPC() {
  const [tab, setTab] = useState<Mechanism>('PIPE');
  const [senders, setSenders] = useState(2);
  const [receivers, setReceivers] = useState(2);
  const [messages, setMessages] = useState(10);
  const [bufferSize, setBufferSize] = useState(5);
  const [events, setEvents] = useState<IPCEvent[]>([]);
  const [signalTarget, setSignalTarget] = useState('P1');
  const [signalLog, setSignalLog] = useState<{sig:string;target:string;time:number}[]>([]);

  const run = () => setEvents(simulateIPC(tab, senders, receivers, messages, bufferSize));
  const sendSignal = (sig: string) => setSignalLog(l => [...l, {sig, target: signalTarget, time: Date.now()}]);

  const EVT_COLOR: Record<string,string> = { SEND:'text-cyan-400',RECEIVE:'text-purple-400',BLOCKED:'text-red-400',WRITE:'text-amber-400',READ:'text-green-400',SIGNAL:'text-orange-400' };

  return (
    <div className="space-y-4">
      <PageHeader title="Inter-Process Communication" subtitle="Pipes, Message Queues, Shared Memory, and Signals"/>

      <div className="flex gap-1 border-b border-white/5">
        {[{key:'PIPE',label:'Pipes'},{key:'MESSAGE_QUEUE',label:'Message Queues'},{key:'SHARED_MEMORY',label:'Shared Memory'},{key:'SIGNALS',label:'Signals'}].map(t=>(
          <button key={t.key} onClick={()=>{setTab(t.key as Mechanism);setEvents([]);}}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${tab===t.key?'border-cyan-400 text-cyan-400':'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {tab !== 'SIGNALS' && (
          <div className="col-span-12 md:col-span-4">
            <Card title="Configuration">
              <div className="space-y-3">
                <Input label="Senders" type="number" min={1} max={5} value={senders} onChange={e=>setSenders(+e.target.value)}/>
                <Input label="Receivers" type="number" min={1} max={5} value={receivers} onChange={e=>setReceivers(+e.target.value)}/>
                <Input label="Messages" type="number" min={5} max={50} value={messages} onChange={e=>setMessages(+e.target.value)}/>
                {(tab==='PIPE'||tab==='MESSAGE_QUEUE') && <Input label="Buffer Size" type="number" min={1} max={20} value={bufferSize} onChange={e=>setBufferSize(+e.target.value)}/>}
                <Button variant="primary" className="w-full" icon={<Play size={12}/>} onClick={run}>Simulate</Button>
              </div>
            </Card>
          </div>
        )}

        <div className={tab==='SIGNALS'?'col-span-12':'col-span-12 md:col-span-8'}>
          {tab === 'PIPE' && (
            <div className="space-y-4">
              <Card title="Pipe Visualization">
                <div className="flex items-center gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    {Array(senders).fill(0).map((_,i)=>(
                      <div key={i} className="w-14 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center text-xs text-cyan-400">S{i+1}</div>
                    ))}
                  </div>
                  <div className="text-slate-600">→</div>
                  <div className="flex-1 flex gap-1">
                    {Array(bufferSize).fill(0).map((_,i)=>(
                      <div key={i} className="flex-1 h-10 bg-white/3 border border-white/10 rounded flex items-center justify-center text-[9px] text-slate-600">{i+1}</div>
                    ))}
                  </div>
                  <div className="text-slate-600">→</div>
                  <div className="flex flex-col gap-2">
                    {Array(receivers).fill(0).map((_,i)=>(
                      <div key={i} className="w-14 h-10 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center text-xs text-purple-400">R{i+1}</div>
                    ))}
                  </div>
                </div>
              </Card>
              {events.length > 0 && <EventLog events={events} EVT_COLOR={EVT_COLOR}/>}
            </div>
          )}

          {tab === 'MESSAGE_QUEUE' && (
            <div className="space-y-4">
              <Card title="Message Queue">
                <div className="flex items-stretch gap-4 py-2">
                  <div className="flex flex-col gap-2 justify-center">
                    {Array(senders).fill(0).map((_,i)=>(
                      <div key={i} className="w-14 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded flex items-center justify-center text-xs text-cyan-400">S{i+1}</div>
                    ))}
                  </div>
                  <div className="text-slate-600 self-center">→</div>
                  <div className="flex-1 border-2 border-amber-500/20 rounded-lg p-2 min-h-[80px]">
                    <p className="text-[10px] text-amber-400 mb-2">Queue (priority ordered)</p>
                    {events.filter(e=>e.type==='SEND').slice(-bufferSize).map((e,i)=>(
                      <div key={i} className="text-[10px] font-mono flex justify-between px-2 py-0.5 bg-amber-500/5 border border-amber-500/10 rounded mb-1">
                        <span className="text-slate-400">[{i}]</span>
                        <span className="text-amber-400">{e.content}</span>
                        <span className="text-slate-500">from {e.sender}</span>
                      </div>
                    ))}
                    {events.length===0 && <p className="text-xs text-slate-600">Run simulation to populate queue</p>}
                  </div>
                  <div className="text-slate-600 self-center">→</div>
                  <div className="flex flex-col gap-2 justify-center">
                    {Array(receivers).fill(0).map((_,i)=>(
                      <div key={i} className="w-14 h-8 bg-purple-500/10 border border-purple-500/30 rounded flex items-center justify-center text-xs text-purple-400">R{i+1}</div>
                    ))}
                  </div>
                </div>
              </Card>
              {events.length > 0 && <EventLog events={events} EVT_COLOR={EVT_COLOR}/>}
            </div>
          )}

          {tab === 'SHARED_MEMORY' && (
            <div className="space-y-4">
              <Card title="Shared Memory Region">
                <div className="flex items-center gap-6 py-4">
                  <div className="flex flex-col gap-2">
                    {Array(senders).fill(0).map((_,i)=>(
                      <div key={i} className="w-14 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center text-xs text-cyan-400">P{i+1}</div>
                    ))}
                  </div>
                  <div className="flex-1 border-2 border-purple-500/30 rounded-xl p-4 bg-purple-500/5">
                    <p className="text-xs text-purple-400 font-mono mb-2">Shared Memory @ 0x4000</p>
                    <div className="grid grid-cols-4 gap-1">
                      {Array(8).fill(0).map((_,i)=>(
                        <div key={i} className="bg-purple-500/10 border border-purple-500/20 rounded p-1 text-center text-[9px] font-mono text-purple-300">
                          0x{(0x4000+i*4).toString(16).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">🔒 Protected by mutex semaphore</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {Array(receivers).fill(0).map((_,i)=>(
                      <div key={i} className="w-14 h-10 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center text-xs text-green-400">P{senders+i+1}</div>
                    ))}
                  </div>
                </div>
              </Card>
              {events.length > 0 && <EventLog events={events} EVT_COLOR={EVT_COLOR}/>}
            </div>
          )}

          {tab === 'SIGNALS' && (
            <div className="grid grid-cols-2 gap-4">
              <Card title="Send Signal">
                <div className="space-y-3">
                  <Input label="Target Process" value={signalTarget} onChange={e=>setSignalTarget(e.target.value)} placeholder="P1"/>
                  <div className="space-y-2">
                    {SIGNALS.map(sig=>(
                      <button key={sig} onClick={()=>sendSignal(sig)}
                        className={`w-full flex items-center justify-between px-3 py-2 bg-white/3 hover:bg-white/8 border border-white/5 hover:border-current rounded-lg transition-all ${SIG_COLORS[sig]}`}>
                        <span className="text-xs font-mono">{sig}</span>
                        <Send size={12}/>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
              <Card title="Signal Log">
                {signalLog.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">No signals sent yet.<br/>Click a signal button to send it.</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {[...signalLog].reverse().map((entry,i)=>(
                      <motion.div key={i} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} className="flex items-center gap-3 py-2 border-b border-white/3">
                        <span className={`text-xs font-mono font-bold ${SIG_COLORS[entry.sig]}`}>{entry.sig}</span>
                        <span className="text-xs text-slate-500">→</span>
                        <span className="text-xs text-slate-300">{entry.target}</span>
                        <span className="text-[10px] text-slate-600 ml-auto">{new Date(entry.time).toLocaleTimeString()}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventLog({ events, EVT_COLOR }: { events: IPCEvent[]; EVT_COLOR: Record<string,string> }) {
  return (
    <Card title="Event Log" subtitle={`${events.length} events`}>
      <div className="space-y-0.5 max-h-48 overflow-y-auto font-mono text-[10px]">
        {events.map(ev=>(
          <div key={ev.id} className="flex gap-2 py-0.5 border-b border-white/3">
            <span className="text-slate-600 w-10">{ev.time.toFixed(1)}s</span>
            <span className={EVT_COLOR[ev.type]??'text-slate-400'}>{ev.type}</span>
            <span className="text-slate-400">{ev.sender}→{ev.receiver}</span>
            <span className="text-slate-600">{ev.content}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
