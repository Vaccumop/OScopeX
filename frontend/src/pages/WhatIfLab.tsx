import React, { useState } from 'react';
import { Play, FlaskConical, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, PageHeader, Button, Input, Select, Badge } from '@/components/ui';
import type { SchedulingAlgorithm, DiskAlgorithm, PageReplacementAlgorithm } from '@/types';

// Reuse client-side algorithms inline
function runClientFCFS(procs: {pid:number;arrivalTime:number;burstTime:number;priority:number}[]) {
  const sorted = [...procs].sort((a,b)=>a.arrivalTime-b.arrivalTime);
  let time = 0; let waits: number[] = []; let tats: number[] = [];
  let switches = 0;
  for (const p of sorted) {
    if (time < p.arrivalTime) time = p.arrivalTime;
    waits.push(time - p.arrivalTime);
    tats.push(time - p.arrivalTime + p.burstTime);
    time += p.burstTime; switches++;
  }
  const avg = (a:number[]) => a.length ? a.reduce((s,v)=>s+v,0)/a.length : 0;
  return { avgWait: avg(waits), avgTAT: avg(tats), utilization: 100, switches, throughput: procs.length/time };
}

function runClientRR(procs:{pid:number;arrivalTime:number;burstTime:number;priority:number}[], q:number) {
  const queue = [...procs].sort((a,b)=>a.arrivalTime-b.arrivalTime).map(p=>({...p,rem:p.burstTime,start:-1}));
  let time = 0; let done = 0; let switches = 0;
  const ready: typeof queue = [];
  const completed: {waitingTime:number;turnaroundTime:number}[] = [];
  while (done < queue.length) {
    const arrived = queue.filter(p=>p.arrivalTime<=time&&p.rem>0&&!ready.includes(p));
    ready.push(...arrived);
    if (ready.length === 0) { time++; continue; }
    const p = ready.shift()!;
    if (p.start === -1) p.start = time;
    const run = Math.min(q, p.rem);
    p.rem -= run; time += run; switches++;
    if (p.rem <= 0) { done++; completed.push({waitingTime:time-p.arrivalTime-p.burstTime,turnaroundTime:time-p.arrivalTime}); }
    else ready.push(p);
  }
  const avg = (a:number[]) => a.length ? a.reduce((s,v)=>s+v,0)/a.length : 0;
  const totalBurst = procs.reduce((s,p)=>s+p.burstTime,0);
  return { avgWait: avg(completed.map(c=>c.waitingTime)), avgTAT: avg(completed.map(c=>c.turnaroundTime)), utilization: (totalBurst/time)*100, switches, throughput: procs.length/time };
}

function diskTotalSeek(head:number, reqs:number[], algo:'FCFS'|'SSTF'): number {
  if (algo==='FCFS') {
    let dist=0, cur=head;
    for (const r of reqs) { dist+=Math.abs(r-cur); cur=r; }
    return dist;
  }
  let dist=0, cur=head, rem=[...reqs];
  while(rem.length>0){
    let idx=0, md=Math.abs(rem[0]-cur);
    for(let i=1;i<rem.length;i++){const d=Math.abs(rem[i]-cur);if(d<md){md=d;idx=i;}}
    dist+=md; cur=rem.splice(idx,1)[0];
  }
  return dist;
}

function fifoFaults(refs:number[],frames:number):number{
  const f:(number|null)[]=Array(frames).fill(null);const q:number[]=[];let faults=0;
  for(const r of refs){if(!f.includes(r)){faults++;if(q.length===frames){const e=q.shift()!;f[f.indexOf(e)]=r;}else{f[f.indexOf(null)]=r;}q.push(r);}}
  return faults;
}
function lruFaults(refs:number[],frames:number):number{
  const f:(number|null)[]=Array(frames).fill(null);const lu=new Map<number,number>();let faults=0;
  for(let t=0;t<refs.length;t++){const r=refs[t];if(!f.includes(r)){faults++;if(!f.includes(null)){let lp=-1,lt=Infinity;for(const x of f){if(x!==null&&(lu.get(x)??-1)<lt){lt=lu.get(x)??-1;lp=x;}}f[f.indexOf(lp)]=r;}else f[f.indexOf(null)]=r;}lu.set(r,t);}
  return faults;
}

type WhatIfModule = 'scheduling' | 'page_replacement' | 'disk';

const DEMO_PROCESSES = [{pid:1,name:'P1',arrivalTime:0,burstTime:8,priority:2},{pid:2,name:'P2',arrivalTime:1,burstTime:4,priority:1},{pid:3,name:'P3',arrivalTime:2,burstTime:9,priority:3},{pid:4,name:'P4',arrivalTime:3,burstTime:5,priority:2}];
const DEMO_REFS = [7,0,1,2,0,3,0,4,2,3,0,3];
const DEMO_DISK = [98,183,37,122,14,124,65];

interface CompResult { avgWait?: number; avgTAT?: number; utilization?: number; switches?: number; throughput?: number; faults?: number; hitRatio?: number; totalSeek?: number; avgSeek?: number; }

export default function WhatIfLab() {
  const [module, setModule] = useState<WhatIfModule>('scheduling');
  const [running, setRunning] = useState(false);
  const [baseline, setBaseline] = useState<CompResult|null>(null);
  const [alternative, setAlternative] = useState<CompResult|null>(null);

  // Scheduling config
  const [baseAlgo, setBaseAlgo] = useState<SchedulingAlgorithm>('FCFS');
  const [altAlgo, setAltAlgo] = useState<SchedulingAlgorithm>('RR');
  const [baseQ, setBaseQ] = useState(2);
  const [altQ, setAltQ] = useState(4);

  // Page replacement config
  const [basePageAlgo, setBasePageAlgo] = useState<PageReplacementAlgorithm>('FIFO');
  const [altPageAlgo, setAltPageAlgo] = useState<PageReplacementAlgorithm>('LRU');
  const [baseFrames, setBaseFrames] = useState(3);
  const [altFrames, setAltFrames] = useState(4);

  // Disk config
  const [baseDiskAlgo, setBaseDiskAlgo] = useState<'FCFS'|'SSTF'>('FCFS');
  const [altDiskAlgo, setAltDiskAlgo] = useState<'FCFS'|'SSTF'>('SSTF');

  const runComparison = async () => {
    setRunning(true);
    await new Promise(r=>setTimeout(r,600));
    try {
      if (module === 'scheduling') {
        const bRes = baseAlgo==='RR' ? runClientRR(DEMO_PROCESSES,baseQ) : runClientFCFS(DEMO_PROCESSES);
        const aRes = altAlgo==='RR' ? runClientRR(DEMO_PROCESSES,altQ) : runClientFCFS(DEMO_PROCESSES);
        setBaseline(bRes); setAlternative(aRes);
      } else if (module === 'page_replacement') {
        const bFaults = basePageAlgo==='FIFO' ? fifoFaults(DEMO_REFS,baseFrames) : lruFaults(DEMO_REFS,baseFrames);
        const aFaults = altPageAlgo==='FIFO' ? fifoFaults(DEMO_REFS,altFrames) : lruFaults(DEMO_REFS,altFrames);
        setBaseline({faults:bFaults,hitRatio:+(((DEMO_REFS.length-bFaults)/DEMO_REFS.length)*100).toFixed(1)});
        setAlternative({faults:aFaults,hitRatio:+(((DEMO_REFS.length-aFaults)/DEMO_REFS.length)*100).toFixed(1)});
      } else {
        const bSeek = diskTotalSeek(53,DEMO_DISK,baseDiskAlgo);
        const aSeek = diskTotalSeek(53,DEMO_DISK,altDiskAlgo);
        setBaseline({totalSeek:bSeek,avgSeek:+(bSeek/DEMO_DISK.length).toFixed(1)});
        setAlternative({totalSeek:aSeek,avgSeek:+(aSeek/DEMO_DISK.length).toFixed(1)});
      }
    } finally { setRunning(false); }
  };

  const metrics: {key:keyof CompResult;label:string;unit:string;lowerIsBetter:boolean}[] = module==='scheduling' ? [
    {key:'avgWait',label:'Avg Waiting Time',unit:'ms',lowerIsBetter:true},
    {key:'avgTAT',label:'Avg Turnaround Time',unit:'ms',lowerIsBetter:true},
    {key:'utilization',label:'CPU Utilization',unit:'%',lowerIsBetter:false},
    {key:'switches',label:'Context Switches',unit:'',lowerIsBetter:true},
    {key:'throughput',label:'Throughput',unit:'p/ms',lowerIsBetter:false},
  ] : module==='page_replacement' ? [
    {key:'faults',label:'Page Faults',unit:'',lowerIsBetter:true},
    {key:'hitRatio',label:'Hit Ratio',unit:'%',lowerIsBetter:false},
  ] : [
    {key:'totalSeek',label:'Total Seek Distance',unit:'',lowerIsBetter:true},
    {key:'avgSeek',label:'Avg Seek Distance',unit:'',lowerIsBetter:true},
  ];

  const SCHED_ALGOS: {value:SchedulingAlgorithm;label:string}[] = [{value:'FCFS',label:'FCFS'},{value:'SJF',label:'SJF'},{value:'SRTF',label:'SRTF'},{value:'RR',label:'Round Robin'},{value:'PRIORITY',label:'Priority'}];
  const PAGE_ALGOS: {value:PageReplacementAlgorithm;label:string}[] = [{value:'FIFO',label:'FIFO'},{value:'LRU',label:'LRU'},{value:'OPTIMAL',label:'Optimal'},{value:'SECOND_CHANCE',label:'Second Chance'}];

  return (
    <div className="space-y-4">
      <PageHeader title="What-If Lab" subtitle="Compare two configurations side-by-side on the same workload"/>

      <Card title="Module">
        <div className="flex gap-2">
          {[{k:'scheduling',l:'CPU Scheduling'},{k:'page_replacement',l:'Page Replacement'},{k:'disk',l:'Disk Scheduling'}].map(m=>(
            <button key={m.k} onClick={()=>{setModule(m.k as WhatIfModule);setBaseline(null);setAlternative(null);}}
              className={`px-4 py-2 text-xs rounded-lg border transition-all ${module===m.k?'bg-cyan-500/20 border-cyan-500/40 text-cyan-400':'bg-white/3 border-white/10 text-slate-400 hover:text-slate-200'}`}>
              {m.l}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Baseline */}
        <Card title="Baseline Configuration" subtitle="Config A">
          <div className="space-y-3">
            {module==='scheduling' && (
              <>
                <Select label="Algorithm" value={baseAlgo} onChange={e=>setBaseAlgo(e.target.value as SchedulingAlgorithm)} options={SCHED_ALGOS}/>
                {baseAlgo==='RR' && <Input label="Time Quantum" type="number" min={1} value={baseQ} onChange={e=>setBaseQ(+e.target.value)}/>}
              </>
            )}
            {module==='page_replacement' && (
              <>
                <Select label="Algorithm" value={basePageAlgo} onChange={e=>setBasePageAlgo(e.target.value as PageReplacementAlgorithm)} options={PAGE_ALGOS}/>
                <Input label="Frames" type="number" min={1} max={8} value={baseFrames} onChange={e=>setBaseFrames(+e.target.value)}/>
              </>
            )}
            {module==='disk' && (
              <Select label="Algorithm" value={baseDiskAlgo} onChange={e=>setBaseDiskAlgo(e.target.value as 'FCFS'|'SSTF')} options={[{value:'FCFS',label:'FCFS'},{value:'SSTF',label:'SSTF'}]}/>
            )}
            <div className="bg-[#111c35] rounded-lg p-3">
              <p className="text-[10px] text-slate-500 mb-1">Workload (shared)</p>
              <p className="text-xs text-slate-400 font-mono">{module==='scheduling'?'P1(0,8,p2) P2(1,4,p1) P3(2,9,p3) P4(3,5,p2)':module==='page_replacement'?'7 0 1 2 0 3 0 4 2 3 0 3':'Head=53 Reqs=[98,183,37,122,14,124,65]'}</p>
            </div>
          </div>
        </Card>

        {/* Alternative */}
        <Card title="Alternative Configuration" subtitle="Config B">
          <div className="space-y-3">
            {module==='scheduling' && (
              <>
                <Select label="Algorithm" value={altAlgo} onChange={e=>setAltAlgo(e.target.value as SchedulingAlgorithm)} options={SCHED_ALGOS}/>
                {altAlgo==='RR' && <Input label="Time Quantum" type="number" min={1} value={altQ} onChange={e=>setAltQ(+e.target.value)}/>}
              </>
            )}
            {module==='page_replacement' && (
              <>
                <Select label="Algorithm" value={altPageAlgo} onChange={e=>setAltPageAlgo(e.target.value as PageReplacementAlgorithm)} options={PAGE_ALGOS}/>
                <Input label="Frames" type="number" min={1} max={8} value={altFrames} onChange={e=>setAltFrames(+e.target.value)}/>
              </>
            )}
            {module==='disk' && (
              <Select label="Algorithm" value={altDiskAlgo} onChange={e=>setAltDiskAlgo(e.target.value as 'FCFS'|'SSTF')} options={[{value:'FCFS',label:'FCFS'},{value:'SSTF',label:'SSTF'}]}/>
            )}
            <div className="bg-[#111c35] rounded-lg p-3">
              <p className="text-[10px] text-slate-500 mb-1">Workload (shared — same as baseline)</p>
              <p className="text-xs text-cyan-400/60 font-mono">identical workload</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button variant="primary" size="lg" icon={<Play size={14}/>} loading={running} onClick={runComparison}>
          Run Comparison
        </Button>
      </div>

      {baseline && alternative && (
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <Card title="Comparison Results" subtitle="Same workload, different configurations">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs">
                    <th className="text-left py-2 px-3">Metric</th>
                    <th className="text-left py-2 px-3">Baseline</th>
                    <th className="text-left py-2 px-3">Alternative</th>
                    <th className="text-left py-2 px-3">Change</th>
                    <th className="text-left py-2 px-3">Better?</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(m=>{
                    const bv = baseline[m.key] as number ?? 0;
                    const av = alternative[m.key] as number ?? 0;
                    const diff = av - bv;
                    const pct = bv !== 0 ? ((diff/bv)*100).toFixed(1) : '0';
                    const improved = m.lowerIsBetter ? diff < 0 : diff > 0;
                    return (
                      <tr key={m.key} className="border-t border-white/5">
                        <td className="py-3 px-3 text-slate-400 text-xs">{m.label}</td>
                        <td className="py-3 px-3 text-white font-mono text-xs">{bv.toFixed?.(bv%1===0?0:2)??bv}{m.unit}</td>
                        <td className="py-3 px-3 text-cyan-400 font-mono text-xs">{av.toFixed?.(av%1===0?0:2)??av}{m.unit}</td>
                        <td className={`py-3 px-3 font-mono text-xs ${improved?'text-green-400':'text-red-400'}`}>
                          {diff>0?'+':''}{diff.toFixed?.(diff%1===0?0:2)??diff} ({pct}%)
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={improved?'success':'error'}>{improved?'✓ Yes':'✗ No'}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-slate-400">
                <span className="text-cyan-400 font-medium">Observation:</span> Both configurations were run on the same workload.
                The metrics above show the quantitative impact of the configuration change.
                Neither is universally "better" — the optimal choice depends on system requirements (fairness vs. throughput vs. latency).
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
