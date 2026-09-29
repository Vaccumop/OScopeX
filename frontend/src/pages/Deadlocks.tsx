import React, { useState, useCallback } from 'react';
import { Play, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { runBankersAlgorithm, detectDeadlock } from '@/services/api';
import { Card, PageHeader, Button, Badge, Input, ExplainBox } from '@/components/ui';

// ── Client-side Banker's Algorithm ───────────────────────────
function clientBankers(processes: number, resources: number, available: number[], maximum: number[][], allocation: number[][]) {
  const need = maximum.map((row, i) => row.map((v, j) => v - allocation[i][j]));
  const work = [...available];
  const finish = Array(processes).fill(false);
  const safeSeq: number[] = [];
  const steps: { process: number; work: number[]; finish: boolean[]; allocated: boolean }[] = [];

  let progress = true;
  while (progress && safeSeq.length < processes) {
    progress = false;
    for (let i = 0; i < processes; i++) {
      if (!finish[i] && need[i].every((v, j) => v <= work[j])) {
        const prevWork = [...work];
        allocation[i].forEach((v, j) => { work[j] += v; });
        finish[i] = true;
        safeSeq.push(i);
        steps.push({ process: i, work: [...work], finish: [...finish], allocated: true });
        progress = true;
        break;
      }
    }
  }
  return { safe: safeSeq.length === processes, safeSequence: safeSeq, needMatrix: need, steps };
}

// ── Client-side Deadlock Detection (cycle in RAG) ───────────
function clientDetectDeadlock(procs: string[], ress: string[], allocation: Record<string,Record<string,number>>, request: Record<string,Record<string,number>>) {
  // Build adjacency: process→resource (request edge), resource→process (allocation edge)
  const visited = new Set<string>();
  const stack = new Set<string>();
  const cycle: string[] = [];

  function dfs(node: string): boolean {
    visited.add(node);
    stack.add(node);
    // Outgoing edges from node
    const neighbors: string[] = [];
    if (procs.includes(node)) {
      ress.forEach(r => { if ((request[node]?.[r] ?? 0) > 0) neighbors.push(r); });
    } else {
      procs.forEach(p => { if ((allocation[p]?.[node] ?? 0) > 0) neighbors.push(p); });
    }
    for (const nb of neighbors) {
      if (!visited.has(nb)) { if (dfs(nb)) { cycle.push(nb); return true; } }
      else if (stack.has(nb)) { cycle.push(nb); return true; }
    }
    stack.delete(node);
    return false;
  }

  for (const n of [...procs, ...ress]) {
    if (!visited.has(n) && dfs(n)) {
      return { deadlocked: true, cycle, involvedProcesses: cycle.filter(n => procs.includes(n)), involvedResources: cycle.filter(n => ress.includes(n)) };
    }
  }
  return { deadlocked: false, cycle: [], involvedProcesses: [], involvedResources: [] };
}

const SAMPLE_STATES = {
  'Safe State (5P/3R)': {
    processes: 5, resources: 3,
    available: [3, 3, 2],
    maximum: [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],
    allocation: [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]],
  },
  'Unsafe State': {
    processes: 3, resources: 2,
    available: [0, 0],
    maximum: [[2,2],[2,2],[2,2]],
    allocation: [[1,1],[1,1],[1,1]],
  },
};

export default function Deadlocks() {
  const [tab, setTab] = useState<'banker'|'detect'>('banker');
  const [loading, setLoading] = useState(false);

  // Banker state
  const [bankP, setBankP] = useState(5);
  const [bankR, setBankR] = useState(3);
  const [available, setAvailable] = useState([3,3,2]);
  const [maximum, setMaximum] = useState([[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]);
  const [allocation, setAllocation] = useState([[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]]);
  const [bankResult, setBankResult] = useState<ReturnType<typeof clientBankers>|null>(null);

  // Detection state
  const [detProcs, setDetProcs] = useState(['P0','P1','P2']);
  const [detRess, setDetRess] = useState(['R0','R1']);
  const [detAlloc, setDetAlloc] = useState<Record<string,Record<string,number>>>({P0:{R0:1},P1:{R1:1},P2:{R0:1}});
  const [detReq, setDetReq] = useState<Record<string,Record<string,number>>>({P0:{R1:1},P1:{R0:1},P2:{R1:1}});
  const [detectResult, setDetectResult] = useState<ReturnType<typeof clientDetectDeadlock>|null>(null);

  const loadSample = (name: keyof typeof SAMPLE_STATES) => {
    const s = SAMPLE_STATES[name];
    setBankP(s.processes); setBankR(s.resources);
    setAvailable([...s.available]);
    setMaximum(s.maximum.map(r=>[...r]));
    setAllocation(s.allocation.map(r=>[...r]));
    setBankResult(null);
  };

  const need = maximum.map((row,i) => row.map((v,j) => v - (allocation[i]?.[j]??0)));

  const runBanker = async () => {
    setLoading(true);
    try {
      const res = await runBankersAlgorithm({ processes: bankP, resources: bankR, available, maximum, allocation });
      setBankResult(res as ReturnType<typeof clientBankers>);
    } catch {
      setBankResult(clientBankers(bankP, bankR, [...available], maximum.map(r=>[...r]), allocation.map(r=>[...r])));
    } finally { setLoading(false); }
  };

  const runDetect = async () => {
    setLoading(true);
    try {
      const res = await detectDeadlock({ processes: detProcs, resources: detRess, allocation: detAlloc, request: detReq });
      setDetectResult(res as ReturnType<typeof clientDetectDeadlock>);
    } catch {
      setDetectResult(clientDetectDeadlock(detProcs, detRess, detAlloc, detReq));
    } finally { setLoading(false); }
  };

  const updateCell = (matrix: number[][], setMatrix: React.Dispatch<React.SetStateAction<number[][]>>, i: number, j: number, val: string) => {
    const m = matrix.map(r=>[...r]);
    m[i][j] = parseInt(val)||0;
    setMatrix(m);
  };

  const MatrixInput = ({ matrix, setMatrix, label }: { matrix: number[][], setMatrix: React.Dispatch<React.SetStateAction<number[][]>>, label: string }) => (
    <div>
      <p className="text-xs text-slate-500 mb-2 font-medium">{label}</p>
      <div className="space-y-1">
        {matrix.slice(0,bankP).map((row,i)=>(
          <div key={i} className="flex gap-1 items-center">
            <span className="text-[10px] text-slate-600 w-6 font-mono">P{i}</span>
            {row.slice(0,bankR).map((v,j)=>(
              <input key={j} type="number" min={0} value={v}
                onChange={e=>updateCell(matrix,setMatrix,i,j,e.target.value)}
                className="w-12 text-center bg-white/5 border border-white/10 rounded px-1 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/50"/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Deadlock Analysis" subtitle="Banker's Algorithm & Deadlock Detection"/>

      <div className="flex gap-1 border-b border-white/5">
        {[{key:'banker',label:"Banker's Algorithm"},{key:'detect',label:'Deadlock Detection'}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${tab===t.key?'border-cyan-400 text-cyan-400':'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==='banker' && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-5 space-y-4">
            <Card title="Configuration">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Input label="Processes" type="number" min={2} max={8} value={bankP} onChange={e=>{setBankP(+e.target.value);setBankResult(null);}}/>
                <Input label="Resources" type="number" min={2} max={5} value={bankR} onChange={e=>{setBankR(+e.target.value);setBankResult(null);}}/>
              </div>
              <div className="mb-3">
                <p className="text-xs text-slate-500 mb-2 font-medium">Available</p>
                <div className="flex gap-2">
                  {available.slice(0,bankR).map((v,j)=>(
                    <input key={j} type="number" min={0} value={v}
                      onChange={e=>{const a=[...available];a[j]=+e.target.value;setAvailable(a);}}
                      className="w-14 text-center bg-white/5 border border-white/10 rounded px-1 py-1 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500/50"/>
                  ))}
                </div>
              </div>
              <MatrixInput matrix={maximum} setMatrix={setMaximum} label="Maximum"/>
              <div className="mt-3">
                <MatrixInput matrix={allocation} setMatrix={setAllocation} label="Allocation"/>
              </div>
            </Card>
            <Card title="Sample States">
              <div className="space-y-2">
                {Object.keys(SAMPLE_STATES).map(name=>(
                  <button key={name} onClick={()=>loadSample(name as keyof typeof SAMPLE_STATES)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-400 bg-white/3 hover:bg-white/8 border border-white/5 hover:border-cyan-500/30 rounded-lg transition-all">
                    {name}
                  </button>
                ))}
              </div>
            </Card>
            <Button variant="primary" className="w-full" icon={<Play size={12}/>} loading={loading} onClick={runBanker}>
              Run Banker's Algorithm
            </Button>
          </div>

          <div className="col-span-12 md:col-span-7 space-y-4">
            {/* Need Matrix (read-only) */}
            <Card title="Need Matrix" subtitle="Maximum − Allocation (auto-calculated)">
              <div className="overflow-x-auto">
                <table className="text-xs font-mono">
                  <thead><tr className="text-slate-500"><th className="px-3 py-1">Proc</th>{Array(bankR).fill(0).map((_,j)=><th key={j} className="px-3 py-1">R{j}</th>)}</tr></thead>
                  <tbody>
                    {need.slice(0,bankP).map((row,i)=>(
                      <tr key={i} className={bankResult?.safeSequence.includes(i)?'bg-green-500/5':''}>
                        <td className="px-3 py-1 text-slate-500">P{i}</td>
                        {row.slice(0,bankR).map((v,j)=>(
                          <td key={j} className={`px-3 py-1 ${v<0?'text-red-400':'text-slate-300'}`}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {bankResult && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-3">
                <Card title="Result">
                  <div className="flex items-center gap-3 mb-4">
                    {bankResult.safe ? (
                      <><CheckCircle size={20} className="text-green-400"/><div><p className="text-sm font-semibold text-green-400">SAFE STATE</p><p className="text-xs text-slate-500">System can satisfy all requests without deadlock</p></div></>
                    ) : (
                      <><AlertTriangle size={20} className="text-red-400"/><div><p className="text-sm font-semibold text-red-400">UNSAFE STATE</p><p className="text-xs text-slate-500">No safe execution sequence exists — deadlock possible</p></div></>
                    )}
                  </div>
                  {bankResult.safe && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Safe Sequence:</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {bankResult.safeSequence.map((p,i)=>(
                          <React.Fragment key={p}>
                            <span className="px-3 py-1.5 bg-green-500/15 border border-green-500/30 rounded-lg text-xs font-mono text-green-400 font-bold">P{p}</span>
                            {i < bankResult.safeSequence.length-1 && <span className="text-slate-600">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
                <Card title="Step-by-Step Trace">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {bankResult.steps.map((step,i)=>(
                      <div key={i} className="flex gap-3 text-xs py-1 border-b border-white/3">
                        <span className="text-slate-500 w-4">{i+1}</span>
                        <span className="text-green-400 font-mono w-8">P{step.process}</span>
                        <span className="text-slate-400">Work: [{step.work.slice(0,bankR).join(',')}]</span>
                        <Badge variant="success">Allocated</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {!bankResult && (
              <Card><ExplainBox what="The Banker's Algorithm checks if a resource allocation state is safe before granting a request." why="Granting a request can leave the system in an unsafe state where no execution order avoids deadlock." concept="Banker's Algorithm — A deadlock avoidance algorithm that simulates allocation and checks for a safe sequence." next="Configure Available/Maximum/Allocation matrices and run the algorithm."/></Card>
            )}
          </div>
        </div>
      )}

      {tab==='detect' && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 space-y-4">
            <Card title="Resource Allocation Graph" subtitle="Pre-configured deadlock scenario">
              <div className="text-xs text-slate-500 mb-3">Circular wait: P0→R1→P1→R0→P2→R1</div>
              <div className="space-y-2 text-xs font-mono">
                <p className="text-slate-500">Allocation:</p>
                {detProcs.map(p=>(
                  <div key={p} className="flex gap-2 items-center">
                    <span className="text-cyan-400 w-6">{p}</span>
                    {detRess.map(r=>(
                      <input key={r} type="number" min={0} max={3} value={detAlloc[p]?.[r]??0}
                        onChange={e=>setDetAlloc({...detAlloc,[p]:{...detAlloc[p],[r]:+e.target.value}})}
                        className="w-10 text-center bg-white/5 border border-white/10 rounded px-1 py-0.5 text-white focus:outline-none"/>
                    ))}
                    <span className="text-slate-600">→ {detRess.join(',')}</span>
                  </div>
                ))}
                <p className="text-slate-500 mt-2">Request:</p>
                {detProcs.map(p=>(
                  <div key={p} className="flex gap-2 items-center">
                    <span className="text-cyan-400 w-6">{p}</span>
                    {detRess.map(r=>(
                      <input key={r} type="number" min={0} max={3} value={detReq[p]?.[r]??0}
                        onChange={e=>setDetReq({...detReq,[p]:{...detReq[p],[r]:+e.target.value}})}
                        className="w-10 text-center bg-white/5 border border-white/10 rounded px-1 py-0.5 text-white focus:outline-none"/>
                    ))}
                    <span className="text-slate-600">→ {detRess.join(',')}</span>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="w-full mt-4" icon={<Play size={12}/>} loading={loading} onClick={runDetect}>Detect Deadlock</Button>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-8 space-y-4">
            {/* RAG Visualization */}
            <Card title="Resource Allocation Graph">
              <svg width="100%" height="240" viewBox="0 0 500 240">
                {detProcs.map((p,i)=>{
                  const x = 60 + i*(350/(detProcs.length-1||1)); const y=60;
                  const isInvolved = detectResult?.involvedProcesses.includes(p);
                  return (
                    <g key={p}>
                      <circle cx={x} cy={y} r={28} fill={isInvolved?'rgba(239,68,68,0.2)':'rgba(34,211,238,0.1)'} stroke={isInvolved?'#ef4444':'#22d3ee'} strokeWidth={2}/>
                      <text x={x} y={y+5} textAnchor="middle" fill={isInvolved?'#ef4444':'#22d3ee'} fontSize={12} fontWeight="bold">{p}</text>
                    </g>
                  );
                })}
                {detRess.map((r,i)=>{
                  const x = 100 + i*(300/(detRess.length-1||1)); const y=180;
                  const isInvolved = detectResult?.involvedResources.includes(r);
                  return (
                    <g key={r}>
                      <rect x={x-28} y={y-20} width={56} height={40} rx={6} fill={isInvolved?'rgba(239,68,68,0.2)':'rgba(245,158,11,0.1)'} stroke={isInvolved?'#ef4444':'#f59e0b'} strokeWidth={2}/>
                      <text x={x} y={y+5} textAnchor="middle" fill={isInvolved?'#ef4444':'#f59e0b'} fontSize={12} fontWeight="bold">{r}</text>
                    </g>
                  );
                })}
                <defs>
                  <marker id="arrReq" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" opacity="0.7"/></marker>
                  <marker id="arrAlloc" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" opacity="0.7"/></marker>
                </defs>
                {detProcs.map((p,i)=>{
                  const px = 60 + i*(350/(detProcs.length-1||1)); const py=60;
                  return detRess.map((r,j)=>{
                    const rx = 100 + j*(300/(detRess.length-1||1)); const ry=180;
                    const reqVal = detReq[p]?.[r]??0;
                    const allocVal = detAlloc[p]?.[r]??0;
                    return (
                      <g key={`${p}-${r}`}>
                        {reqVal>0 && <line x1={px} y1={py+28} x2={rx} y2={ry-20} stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#arrReq)" opacity={0.7}/>}
                        {allocVal>0 && <line x1={rx} y1={ry-20} x2={px} y2={py+28} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arrAlloc)" opacity={0.7}/>}
                      </g>
                    );
                  });
                })}
              </svg>
              <div className="flex gap-4 text-[10px] text-slate-500 mt-2">
                <div className="flex items-center gap-1"><div className="w-6 border-t border-dashed border-cyan-400"/>Request edge (P→R)</div>
                <div className="flex items-center gap-1"><div className="w-6 border-t border-amber-400"/>Allocation edge (R→P)</div>
              </div>
            </Card>

            {detectResult && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                <Card title="Detection Result">
                  {detectResult.deadlocked ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2"><AlertTriangle size={18} className="text-red-400"/><span className="text-sm font-semibold text-red-400">DEADLOCK DETECTED</span></div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Cycle:</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {detectResult.cycle.map((n,i)=>(
                            <React.Fragment key={i}>
                              <span className="px-2 py-1 bg-red-500/15 border border-red-500/30 rounded text-xs font-mono text-red-400">{n}</span>
                              {i<detectResult.cycle.length-1 && <span className="text-red-600">→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-xs text-slate-400 font-semibold mb-1">Recovery Options:</p>
                        <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                          <li>Process Termination: Kill {detectResult.involvedProcesses[0]} to break the cycle</li>
                          <li>Resource Preemption: Preempt resources from {detectResult.involvedProcesses[1]}</li>
                          <li>Rollback: Roll back processes to a safe checkpoint</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-400"/><span className="text-sm font-semibold text-green-400">NO DEADLOCK — System is in a safe state</span></div>
                  )}
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
