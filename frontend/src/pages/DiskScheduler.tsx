import React, { useState, useCallback } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { simulateDisk } from '@/services/api';
import type { DiskAlgorithm } from '@/types';
import { Card, PageHeader, Button, Input, Select, ExplainBox } from '@/components/ui';

// ── Client-side disk scheduling implementations ───────────────

function fcfs(head: number, requests: number[]): number[] {
  return [head, ...requests];
}

function sstf(head: number, requests: number[]): number[] {
  const seq = [head];
  const remaining = [...requests];
  let cur = head;
  while (remaining.length > 0) {
    let nearestIdx = 0;
    let minDist = Math.abs(remaining[0] - cur);
    for (let i = 1; i < remaining.length; i++) {
      const d = Math.abs(remaining[i] - cur);
      if (d < minDist) { minDist = d; nearestIdx = i; }
    }
    cur = remaining.splice(nearestIdx, 1)[0];
    seq.push(cur);
  }
  return seq;
}

function scan(head: number, requests: number[], diskSize: number, dir: 'left'|'right'): number[] {
  const seq = [head];
  const sorted = [...requests].sort((a,b)=>a-b);
  const left = sorted.filter(r=>r<head).reverse();
  const right = sorted.filter(r=>r>=head);
  if (dir === 'right') { [...right,...left].forEach(r=>seq.push(r)); }
  else { [...left,...right].forEach(r=>seq.push(r)); }
  return seq;
}

function cscan(head: number, requests: number[], diskSize: number): number[] {
  const seq = [head];
  const sorted = [...requests].sort((a,b)=>a-b);
  const right = sorted.filter(r=>r>=head);
  const left = sorted.filter(r=>r<head);
  [...right,...left].forEach(r=>seq.push(r));
  return seq;
}

function look(head: number, requests: number[], dir: 'left'|'right'): number[] {
  const seq = [head];
  const sorted = [...requests].sort((a,b)=>a-b);
  const left = sorted.filter(r=>r<head).reverse();
  const right = sorted.filter(r=>r>=head);
  if (dir === 'right') { [...right,...left].forEach(r=>seq.push(r)); }
  else { [...left,...right].forEach(r=>seq.push(r)); }
  return seq;
}

function clook(head: number, requests: number[]): number[] {
  const seq = [head];
  const sorted = [...requests].sort((a,b)=>a-b);
  const right = sorted.filter(r=>r>=head);
  const left = sorted.filter(r=>r<head);
  [...right,...left].forEach(r=>seq.push(r));
  return seq;
}

function runDiskAlgo(algo: DiskAlgorithm, head: number, requests: number[], diskSize: number, dir: 'left'|'right'): number[] {
  switch (algo) {
    case 'FCFS': return fcfs(head, requests);
    case 'SSTF': return sstf(head, requests);
    case 'SCAN': return scan(head, requests, diskSize, dir);
    case 'CSCAN': return cscan(head, requests, diskSize);
    case 'LOOK': return look(head, requests, dir);
    case 'CLOOK': return clook(head, requests);
    default: return fcfs(head, requests);
  }
}

const SAMPLE_WORKLOADS: Record<string, number[]> = {
  'Random Requests': [98, 183, 37, 122, 14, 124, 65, 67],
  'Sequential': [10, 20, 30, 40, 50, 60, 70],
  'Heavy Load': [55, 58, 60, 70, 18, 90, 150, 160, 184, 45],
};

const ALGOS: { value: DiskAlgorithm; label: string }[] = [
  { value: 'FCFS', label: 'FCFS — First Come First Serve' },
  { value: 'SSTF', label: 'SSTF — Shortest Seek Time First' },
  { value: 'SCAN', label: 'SCAN — Elevator' },
  { value: 'CSCAN', label: 'C-SCAN — Circular SCAN' },
  { value: 'LOOK', label: 'LOOK' },
  { value: 'CLOOK', label: 'C-LOOK — Circular LOOK' },
];

export default function DiskScheduler() {
  const [algorithm, setAlgorithm] = useState<DiskAlgorithm>('FCFS');
  const [initialHead, setInitialHead] = useState(53);
  const [diskSize, setDiskSize] = useState(200);
  const [requestInput, setRequestInput] = useState('98 183 37 122 14 124 65 67');
  const [direction, setDirection] = useState<'left'|'right'>('right');
  const [seekSequence, setSeekSequence] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const requests = requestInput.split(/[\s,]+/).map(Number).filter(n=>!isNaN(n)&&n>=0&&n<diskSize);

  const totalSeek = seekSequence.length > 1
    ? seekSequence.reduce((sum,pos,i) => i===0?0:sum+Math.abs(pos-seekSequence[i-1]), 0) : 0;
  const avgSeek = seekSequence.length > 1 ? (totalSeek/(seekSequence.length-1)).toFixed(2) : '0';

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const res = await simulateDisk({ algorithm, initialHead, diskSize, requests, direction });
      setSeekSequence(res.seekSequence);
    } catch {
      setSeekSequence(runDiskAlgo(algorithm, initialHead, requests, diskSize, direction));
    } finally { setLoading(false); }
  }, [algorithm, initialHead, diskSize, requests, direction]);

  const chartData = seekSequence.map((pos,i) => ({ step: i, position: pos }));

  return (
    <div className="space-y-4">
      <PageHeader title="Disk Scheduler" subtitle="Visualize FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK disk scheduling"/>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4 space-y-4">
          <Card title="Configuration">
            <div className="space-y-3">
              <Select label="Algorithm" value={algorithm} onChange={e=>setAlgorithm(e.target.value as DiskAlgorithm)} options={ALGOS}/>
              <Input label="Initial Head Position" type="number" min={0} max={diskSize-1} value={initialHead} onChange={e=>setInitialHead(+e.target.value)}/>
              <Input label="Disk Size (tracks)" type="number" min={100} max={500} value={diskSize} onChange={e=>setDiskSize(+e.target.value)}/>
              <div>
                <label className="text-xs text-slate-400 font-medium">Request Queue</label>
                <input className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50"
                  value={requestInput} onChange={e=>setRequestInput(e.target.value)}/>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {Object.keys(SAMPLE_WORKLOADS).map(name=>(
                    <button key={name} onClick={()=>setRequestInput(SAMPLE_WORKLOADS[name].join(' '))}
                      className="text-[10px] px-2 py-0.5 bg-white/3 hover:bg-white/8 border border-white/5 rounded text-slate-500 hover:text-slate-300 transition-all">
                      {name}
                    </button>
                  ))}
                </div>
              </div>
              {['SCAN','LOOK'].includes(algorithm) && (
                <Select label="Initial Direction" value={direction} onChange={e=>setDirection(e.target.value as 'left'|'right')} options={[{value:'right',label:'Right (ascending)'},{value:'left',label:'Left (descending)'}]}/>
              )}
              <Button variant="primary" className="w-full" icon={<Play size={12}/>} loading={loading} onClick={run}>Run Simulation</Button>
            </div>
          </Card>

          {seekSequence.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold font-mono text-amber-400">{totalSeek}</div>
                  <div className="text-[10px] text-slate-500">Total Seek</div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold font-mono text-cyan-400">{avgSeek}</div>
                  <div className="text-[10px] text-slate-500">Avg Seek</div>
                </div>
              </div>
              <Card title="Service Order">
                <div className="flex flex-wrap gap-1">
                  {seekSequence.slice(1).map((pos,i)=>(
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300">{pos}</span>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-8 space-y-4">
          {/* Track Visualization */}
          <Card title="Disk Track" subtitle={`Head starts at ${initialHead}`}>
            <div className="relative py-6 px-4">
              <div className="relative h-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-0.5 bg-white/10"/>
                </div>
                {/* Request marks */}
                {requests.map((r,i)=>(
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{left:`${(r/diskSize)*100}%`}}>
                    <div className="w-2 h-4 bg-amber-500/40 border border-amber-500/60 rounded-sm"/>
                    <span className="text-[8px] text-amber-400 font-mono absolute top-5 left-1/2 -translate-x-1/2">{r}</span>
                  </div>
                ))}
                {/* Head */}
                <motion.div
                  animate={{left:`${(initialHead/diskSize)*100}%`}}
                  className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 -translate-x-1/2"
                  style={{boxShadow:'0 0 8px rgba(34,211,238,0.5)'}}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-400">{initialHead}</div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400"/>
                </motion.div>
              </div>
              <div className="flex justify-between text-[9px] text-slate-600 mt-1 font-mono">
                <span>0</span><span>{Math.floor(diskSize/4)}</span><span>{Math.floor(diskSize/2)}</span><span>{Math.floor(diskSize*3/4)}</span><span>{diskSize-1}</span>
              </div>
            </div>
          </Card>

          {/* Head Movement Chart */}
          {seekSequence.length > 1 && (
            <Card title="Head Movement Over Time">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <XAxis dataKey="step" tick={{fill:'#475569',fontSize:10}} axisLine={false} tickLine={false} label={{value:'Step',position:'insideBottom',fill:'#475569',fontSize:10}}/>
                  <YAxis domain={[0,diskSize]} tick={{fill:'#475569',fontSize:10}} axisLine={false} tickLine={false} label={{value:'Track',angle:-90,position:'insideLeft',fill:'#475569',fontSize:10}}/>
                  <Tooltip contentStyle={{background:'#111c35',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,fontSize:11}} labelFormatter={v=>`Step ${v}`} formatter={(v)=>[`Track ${v}`,'Position']}/>
                  <ReferenceLine y={initialHead} stroke="#22d3ee" strokeDasharray="4 2" strokeWidth={1} opacity={0.4}/>
                  <Line type="linear" dataKey="position" stroke="#f59e0b" strokeWidth={2} dot={{r:3,fill:'#f59e0b'}} activeDot={{r:5}}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Step table */}
          {seekSequence.length > 1 && (
            <Card title="Step Details">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead><tr className="text-slate-500"><th className="text-left py-1 px-2">Step</th><th className="text-left py-1 px-2">From</th><th className="text-left py-1 px-2">To</th><th className="text-left py-1 px-2">Seek Dist</th><th className="text-left py-1 px-2">Cumulative</th></tr></thead>
                  <tbody>
                    {seekSequence.slice(1).map((pos,i)=>{
                      const from=seekSequence[i], dist=Math.abs(pos-from);
                      const cumulative=seekSequence.slice(0,i+2).reduce((s,p,j)=>j===0?0:s+Math.abs(p-seekSequence[j-1]),0);
                      return (
                        <tr key={i} className="border-t border-white/3">
                          <td className="py-1 px-2 text-slate-500">{i+1}</td>
                          <td className="py-1 px-2 text-slate-400">{from}</td>
                          <td className="py-1 px-2 text-white">{pos}</td>
                          <td className="py-1 px-2 text-amber-400">{dist}</td>
                          <td className="py-1 px-2 text-cyan-400">{cumulative}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {seekSequence.length === 0 && (
            <Card>
              <ExplainBox what="Disk scheduling algorithms determine the order in which disk I/O requests are serviced." why="Random disk access is expensive — smart ordering reduces total head movement and latency." concept="Disk scheduling reduces seek time. SSTF minimizes each seek; SCAN prevents starvation by sweeping in one direction." next="Enter a request queue and run the simulation to see head movement."/>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
