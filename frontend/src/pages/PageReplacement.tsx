import React, { useState, useCallback } from 'react';
import { Play, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { simulatePageReplacement } from '@/services/api';
import type { PageReplacementAlgorithm, PageReplacementStep } from '@/types';
import { Card, PageHeader, Button, Select, Input, Badge, ExplainBox } from '@/components/ui';

// ── Client-side algorithms ────────────────────────────────────

function runFIFO(refs: number[], frameCount: number): PageReplacementStep[] {
  const frames: (number|null)[] = Array(frameCount).fill(null);
  const queue: number[] = [];
  return refs.map(ref => {
    const hit = frames.includes(ref);
    let evicted: number|null = null;
    if (!hit) {
      if (queue.length === frameCount) { evicted = queue.shift()!; const idx = frames.indexOf(evicted); frames[idx] = ref; } else { const idx = frames.indexOf(null); frames[idx] = ref; }
      queue.push(ref);
    }
    return { reference: ref, frames: [...frames], fault: !hit, evicted, hit };
  });
}

function runLRU(refs: number[], frameCount: number): PageReplacementStep[] {
  const frames: (number|null)[] = Array(frameCount).fill(null);
  const lastUsed: Map<number,number> = new Map();
  return refs.map((ref, t) => {
    const hit = frames.includes(ref);
    let evicted: number|null = null;
    if (!hit) {
      if (!frames.includes(null)) {
        let lruPage = -1, lruTime = Infinity;
        for (const f of frames) { if (f !== null && (lastUsed.get(f) ?? -1) < lruTime) { lruTime = lastUsed.get(f) ?? -1; lruPage = f; } }
        evicted = lruPage;
        frames[frames.indexOf(lruPage)] = ref;
      } else { frames[frames.indexOf(null)] = ref; }
    }
    lastUsed.set(ref, t);
    return { reference: ref, frames: [...frames], fault: !hit, evicted, hit };
  });
}

function runOptimal(refs: number[], frameCount: number): PageReplacementStep[] {
  const frames: (number|null)[] = Array(frameCount).fill(null);
  return refs.map((ref, t) => {
    const hit = frames.includes(ref);
    let evicted: number|null = null;
    if (!hit) {
      if (!frames.includes(null)) {
        let furthest = -1, evictPage: number|null = null;
        for (const f of frames) {
          if (f === null) continue;
          const nextUse = refs.slice(t+1).indexOf(f);
          const dist = nextUse === -1 ? Infinity : nextUse;
          if (dist > furthest) { furthest = dist; evictPage = f; }
        }
        evicted = evictPage;
        frames[frames.indexOf(evictPage)] = ref;
      } else { frames[frames.indexOf(null)] = ref; }
    }
    return { reference: ref, frames: [...frames], fault: !hit, evicted, hit };
  });
}

function runSecondChance(refs: number[], frameCount: number): PageReplacementStep[] {
  const frames: (number|null)[] = Array(frameCount).fill(null);
  const refBits: boolean[] = Array(frameCount).fill(false);
  let hand = 0;
  return refs.map(ref => {
    const idx = frames.indexOf(ref);
    const hit = idx !== -1;
    let evicted: number|null = null;
    if (hit) { refBits[idx] = true; }
    else {
      while (true) {
        if (!frames.includes(null)) {
          if (refBits[hand]) { refBits[hand] = false; hand = (hand+1)%frameCount; }
          else { evicted = frames[hand]; frames[hand] = ref; refBits[hand] = false; hand = (hand+1)%frameCount; break; }
        } else { const empty = frames.indexOf(null); frames[empty] = ref; refBits[empty] = false; break; }
      }
    }
    return { reference: ref, frames: [...frames], fault: !hit, evicted, hit };
  });
}

function runAlgo(algo: PageReplacementAlgorithm, refs: number[], frames: number): PageReplacementStep[] {
  switch (algo) {
    case 'FIFO': return runFIFO(refs, frames);
    case 'LRU': return runLRU(refs, frames);
    case 'OPTIMAL': return runOptimal(refs, frames);
    case 'SECOND_CHANCE': return runSecondChance(refs, frames);
    default: return runFIFO(refs, frames);
  }
}

const SAMPLE_STRINGS = [
  { label: 'Classic (Belady)', value: '7 0 1 2 0 3 0 4 2 3 0 3' },
  { label: 'Locality', value: '1 2 3 4 1 2 5 1 2 3 4 5' },
  { label: 'Long', value: '0 1 2 3 0 1 4 0 1 2 3 4' },
];

const ALGOS: { value: PageReplacementAlgorithm; label: string }[] = [
  { value: 'FIFO', label: 'FIFO — First In First Out' },
  { value: 'LRU', label: 'LRU — Least Recently Used' },
  { value: 'OPTIMAL', label: 'Optimal (OPT)' },
  { value: 'SECOND_CHANCE', label: 'Second Chance (Clock)' },
];

const ALGO_EXPLANATIONS: Record<PageReplacementAlgorithm, { what:string;why:string;concept:string;next:string }> = {
  FIFO: { what:'Evicts the page that has been in memory the longest.', why:'Simple to implement with a queue; no need to track usage patterns.', concept:'FIFO — Can suffer from Bélády\'s anomaly: more frames can cause more faults.', next:'Watch for cases where a frequently needed page keeps getting evicted.' },
  LRU: { what:'Evicts the page that was least recently used.', why:'Uses temporal locality — recently used pages are likely to be used again soon.', concept:'LRU — Approximates the optimal algorithm. More expensive to implement precisely.', next:'LRU generally outperforms FIFO. Compare fault counts on the same reference string.' },
  OPTIMAL: { what:'Evicts the page that will not be used for the longest time in the future.', why:'Since it knows the future, it makes the theoretically best decision every time.', concept:'Optimal (OPT/MIN) — Theoretical lower bound. Cannot be implemented in practice.', next:'Use OPT as a benchmark — how close does LRU or FIFO come to this ideal?' },
  SECOND_CHANCE: { what:'Modified FIFO: pages get a second chance via a reference bit before eviction.', why:'Approximates LRU without the overhead of tracking exact usage times.', concept:'Second Chance (Clock Algorithm) — Used in many real OS implementations. O(1) per reference.', next:'Watch the clock hand sweep around and how reference bits are cleared.' },
};

export default function PageReplacement() {
  const [algorithm, setAlgorithm] = useState<PageReplacementAlgorithm>('FIFO');
  const [refString, setRefString] = useState('7 0 1 2 0 3 0 4 2 3 0 3');
  const [frameCount, setFrameCount] = useState(3);
  const [steps, setSteps] = useState<PageReplacementStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparison, setComparison] = useState<{algo:string;faults:number}[]>([]);

  const refs = refString.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0);

  const run = useCallback(async () => {
    if (refs.length === 0) return;
    setLoading(true);
    try {
      const res = await simulatePageReplacement({ algorithm, referenceString: refs, frames: frameCount });
      setSteps(res.steps);
    } catch {
      setSteps(runAlgo(algorithm, refs, frameCount));
    } finally { setLoading(false); }
  }, [algorithm, refs, frameCount]);

  const runComparison = () => {
    const algos: PageReplacementAlgorithm[] = ['FIFO','LRU','OPTIMAL','SECOND_CHANCE'];
    const r = algos.map(a => {
      const s = runAlgo(a, refs, frameCount);
      return { algo: a, faults: s.filter(x=>x.fault).length };
    });
    setComparison(r);
    setShowComparison(true);
  };

  const faults = steps.filter(s=>s.fault).length;
  const hits = steps.filter(s=>s.hit).length;

  return (
    <div className="space-y-4">
      <PageHeader title="Page Replacement" subtitle="Compare FIFO, LRU, Optimal, and Second Chance algorithms"/>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4 space-y-4">
          <Card title="Configuration">
            <div className="space-y-3">
              <Select label="Algorithm" value={algorithm} onChange={e=>setAlgorithm(e.target.value as PageReplacementAlgorithm)} options={ALGOS}/>
              <div>
                <label className="text-xs text-slate-400 font-medium">Reference String</label>
                <input className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono"
                  value={refString} onChange={e=>setRefString(e.target.value)} placeholder="7 0 1 2 0 3..."/>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {SAMPLE_STRINGS.map(s=>(
                    <button key={s.label} onClick={()=>setRefString(s.value)}
                      className="text-[10px] px-2 py-0.5 bg-white/3 hover:bg-white/8 border border-white/5 rounded text-slate-500 hover:text-slate-300 transition-all">
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Number of Frames" type="number" min={1} max={8} value={frameCount} onChange={e=>setFrameCount(+e.target.value)}/>
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1" icon={<Play size={12}/>} loading={loading} onClick={run}>Run</Button>
                <Button variant="secondary" icon={<BarChart2 size={12}/>} onClick={runComparison}>Compare</Button>
              </div>
            </div>
          </Card>

          {steps.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {[
                {label:'Page Faults',value:faults,color:'text-red-400',bg:'bg-red-500/10 border-red-500/20'},
                {label:'Page Hits',value:hits,color:'text-green-400',bg:'bg-green-500/10 border-green-500/20'},
                {label:'Hit Ratio',value:`${((hits/steps.length)*100).toFixed(1)}%`,color:'text-cyan-400',bg:'bg-cyan-500/10 border-cyan-500/20'},
                {label:'Fault Ratio',value:`${((faults/steps.length)*100).toFixed(1)}%`,color:'text-amber-400',bg:'bg-amber-500/10 border-amber-500/20'},
              ].map(m=>(
                <div key={m.label} className={`border rounded-lg p-3 text-center ${m.bg}`}>
                  <div className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {showComparison && (
            <Card title="Algorithm Comparison" subtitle={`${frameCount} frames, ${refs.length} references`}>
              {comparison.map(c=>(
                <div key={c.algo} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{c.algo}</span>
                    <span className="text-red-400 font-mono">{c.faults} faults</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400/60 rounded-full" style={{width:`${(c.faults/refs.length)*100}%`}}/>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        <div className="col-span-12 md:col-span-8 space-y-4">
          {steps.length > 0 ? (
            <Card title="Step-by-Step Execution" subtitle={`${algorithm} — ${frameCount} frames`}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left py-2 px-2">Ref</th>
                      {Array(frameCount).fill(0).map((_,i)=>(
                        <th key={i} className="text-left py-2 px-2">Frame {i+1}</th>
                      ))}
                      <th className="text-left py-2 px-2">Evicted</th>
                      <th className="text-left py-2 px-2">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((step,i)=>(
                      <motion.tr key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}
                        className={`border-t border-white/3 ${step.fault?'bg-red-500/5':step.hit?'bg-green-500/3':''}`}>
                        <td className="py-2 px-2 text-white font-bold">{step.reference}</td>
                        {step.frames.map((f,j)=>(
                          <td key={j} className={`py-2 px-2 ${f===step.reference&&step.fault?'text-red-400 font-bold':f===step.reference?'text-green-400 font-bold':'text-slate-400'}`}>
                            {f ?? '—'}
                          </td>
                        ))}
                        <td className="py-2 px-2 text-amber-400">{step.evicted ?? '—'}</td>
                        <td className="py-2 px-2">
                          {step.fault ? <Badge variant="error">FAULT</Badge> : <Badge variant="success">HIT</Badge>}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card><ExplainBox {...ALGO_EXPLANATIONS[algorithm]}/></Card>
          )}

          {steps.length > 0 && (
            <Card title="Visual Frame History">
              <div className="overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col gap-1 items-center">
                      <span className="text-[9px] text-slate-600 font-mono">{step.reference}</span>
                      {step.frames.map((f, j) => (
                        <div key={j} className={`w-8 h-8 rounded text-[10px] flex items-center justify-center border font-mono transition-all ${
                          f === step.reference && step.fault ? 'bg-red-500/30 border-red-500/60 text-red-300' :
                          f === step.reference ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                          f !== null ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-transparent border-white/5 text-slate-700'
                        }`}>
                          {f ?? '—'}
                        </div>
                      ))}
                      <div className={`w-2 h-2 rounded-full ${step.fault?'bg-red-400':'bg-green-400'}`}/>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
