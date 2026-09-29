import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, PageHeader, Button, Input, Select, ExplainBox } from '@/components/ui';
import { generateId } from '@/utils';

type BufferMode = 'single' | 'double' | 'circular';

interface BufferEvent { id: string; time: number; type: string; detail: string; }

function simulateBuffer(mode: BufferMode, bufferSize: number, prodRate: number, consRate: number, steps: number) {
  const history: number[] = [];
  const events: BufferEvent[] = [];
  let bufA = 0, bufB = 0, activeBuffer = 0;
  let overflows = 0, underflows = 0, totalProduced = 0, totalConsumed = 0;
  let ringBuffer: number[] = Array(bufferSize).fill(0);
  let head = 0, tail = 0, count = 0;

  for (let t = 0; t < steps; t++) {
    const produce = Math.random() < prodRate / 10 ? Math.ceil(Math.random() * 3) : 0;
    const consume = Math.random() < consRate / 10 ? Math.ceil(Math.random() * 2) : 0;

    if (mode === 'single') {
      for (let i = 0; i < produce; i++) {
        if (bufA < bufferSize) { bufA++; totalProduced++; }
        else { overflows++; events.push({ id: generateId(), time: t, type: 'OVERFLOW', detail: 'Single buffer full' }); }
      }
      for (let i = 0; i < consume; i++) {
        if (bufA > 0) { bufA--; totalConsumed++; }
        else { underflows++; events.push({ id: generateId(), time: t, type: 'UNDERFLOW', detail: 'Single buffer empty' }); }
      }
      history.push(bufA);
    } else if (mode === 'double') {
      const buf = activeBuffer === 0 ? bufA : bufB;
      const setBuf = (v: number) => { if (activeBuffer === 0) bufA = v; else bufB = v; };
      let cur = buf;
      for (let i = 0; i < produce; i++) { if (cur < bufferSize) { cur++; totalProduced++; } else { overflows++; } }
      for (let i = 0; i < consume; i++) { if (cur > 0) { cur--; totalConsumed++; } else { underflows++; } }
      setBuf(cur);
      if (cur >= bufferSize * 0.8) { activeBuffer = 1 - activeBuffer; events.push({ id: generateId(), time: t, type: 'SWITCH', detail: `Switched to buffer ${activeBuffer + 1}` }); }
      history.push(bufA + bufB);
    } else {
      for (let i = 0; i < produce; i++) {
        if (count < bufferSize) { ringBuffer[tail] = t; tail = (tail+1)%bufferSize; count++; totalProduced++; }
        else { overflows++; }
      }
      for (let i = 0; i < consume; i++) {
        if (count > 0) { head = (head+1)%bufferSize; count--; totalConsumed++; }
        else { underflows++; }
      }
      history.push(count);
    }
  }
  const throughput = totalConsumed / steps;
  const avgFill = history.reduce((a,b)=>a+b,0)/history.length;
  return { history, events, metrics: { throughput, avgFill, overflows, underflows, totalProduced, totalConsumed } };
}

export default function IOBuffer() {
  const [mode, setMode] = useState<BufferMode>('single');
  const [bufferSize, setBufferSize] = useState(10);
  const [prodRate, setProdRate] = useState(5);
  const [consRate, setConsRate] = useState(4);
  const [steps, setSteps] = useState(50);
  const [result, setResult] = useState<ReturnType<typeof simulateBuffer>|null>(null);

  const run = () => setResult(simulateBuffer(mode, bufferSize, prodRate, consRate, steps));

  const chartData = result?.history.map((v,i)=>({t:i,v})) ?? [];

  return (
    <div className="space-y-4">
      <PageHeader title="I/O Buffering" subtitle="Simulate single, double, and circular buffering strategies"/>

      <div className="flex gap-1 border-b border-white/5 mb-4">
        {[{k:'single',l:'Single Buffer'},{k:'double',l:'Double Buffer'},{k:'circular',l:'Circular Buffer'}].map(t=>(
          <button key={t.k} onClick={()=>{setMode(t.k as BufferMode);setResult(null);}}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${mode===t.k?'border-cyan-400 text-cyan-400':'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4 space-y-4">
          <Card title="Configuration">
            <div className="space-y-3">
              <Input label="Buffer Size" type="number" min={2} max={32} value={bufferSize} onChange={e=>setBufferSize(+e.target.value)}/>
              <Input label="Producer Rate (0-10)" type="number" min={1} max={10} value={prodRate} onChange={e=>setProdRate(+e.target.value)}/>
              <Input label="Consumer Rate (0-10)" type="number" min={1} max={10} value={consRate} onChange={e=>setConsRate(+e.target.value)}/>
              <Input label="Steps" type="number" min={10} max={200} value={steps} onChange={e=>setSteps(+e.target.value)}/>
              <Button variant="primary" className="w-full" icon={<Play size={12}/>} onClick={run}>Run Simulation</Button>
            </div>
          </Card>

          {result && (
            <div className="grid grid-cols-2 gap-2">
              {[
                {label:'Throughput',value:result.metrics.throughput.toFixed(2),color:'text-cyan-400'},
                {label:'Avg Fill',value:result.metrics.avgFill.toFixed(1),color:'text-green-400'},
                {label:'Overflows',value:result.metrics.overflows,color:'text-red-400'},
                {label:'Underflows',value:result.metrics.underflows,color:'text-amber-400'},
              ].map(m=>(
                <div key={m.label} className="bg-[#111c35] border border-white/5 rounded-lg p-3 text-center">
                  <div className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-8 space-y-4">
          {/* Buffer Visualization */}
          <Card title={`${mode.charAt(0).toUpperCase()+mode.slice(1)} Buffer Diagram`}>
            {mode === 'single' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center gap-6">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-cyan-400">CPU / Producer</div>
                  <div className="text-slate-600">→</div>
                  <div className="border-2 border-orange-500/40 rounded-xl p-3 text-center min-w-[160px]">
                    <p className="text-[10px] text-orange-400 mb-2">Buffer A</p>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden w-full">
                      <div className="h-full bg-orange-400/60 rounded-full transition-all" style={{width:`${result?Math.min(100,(result.history[result.history.length-1]/bufferSize)*100):0}%`}}/>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{result?result.history[result.history.length-1]:0}/{bufferSize}</p>
                  </div>
                  <div className="text-slate-600">→</div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-3 text-sm text-purple-400">Device / Consumer</div>
                </div>
              </div>
            )}
            {mode === 'double' && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-3 text-sm text-cyan-400">CPU</div>
                  <div className="text-slate-600">→</div>
                  <div className="flex flex-col gap-2">
                    {['Buffer A','Buffer B'].map((buf,i)=>(
                      <div key={buf} className="border-2 border-orange-500/40 rounded-xl p-2 min-w-[120px] text-center">
                        <p className="text-[10px] text-orange-400">{buf}</p>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-orange-400/60 rounded-full" style={{width:`${result?50:0}%`}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-slate-600">→</div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-3 text-sm text-purple-400">Device</div>
                </div>
              </div>
            )}
            {mode === 'circular' && (
              <div className="flex justify-center py-4">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {Array(bufferSize<=16?bufferSize:16).fill(0).map((_,i)=>{
                    const n = Math.min(bufferSize, 16);
                    const angle = (2*Math.PI*i/n) - Math.PI/2;
                    const x = 100 + 70*Math.cos(angle);
                    const y = 100 + 70*Math.sin(angle);
                    const filled = result ? i < result.history[result.history.length-1] : false;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r={14} fill={filled?'rgba(249,115,22,0.3)':'rgba(255,255,255,0.03)'} stroke={filled?'#fb923c':'rgba(255,255,255,0.1)'} strokeWidth={1.5}/>
                        <text x={x} y={y+4} textAnchor="middle" fill={filled?'#fb923c':'#475569'} fontSize={9} fontFamily="monospace">{i}</text>
                      </g>
                    );
                  })}
                  <text x={100} y={104} textAnchor="middle" fill="#94a3b8" fontSize={10}>Ring</text>
                </svg>
              </div>
            )}
          </Card>

          {result && (
            <Card title="Buffer Level Over Time">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="bufferGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,bufferSize]} tick={{fill:'#475569',fontSize:9}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:'#111c35',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,fontSize:11}}/>
                  <Area type="monotone" dataKey="v" stroke="#fb923c" fill="url(#bufferGrad)" strokeWidth={2} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          )}

          {!result && (
            <Card>
              <ExplainBox
                what={`${mode==='single'?'A single':'Two alternating'} buffer sits between the CPU and the I/O device, decoupling their speeds.`}
                why="Without buffering, a fast CPU waits for a slow device or vice versa, wasting time."
                concept={`${mode==='single'?'Single Buffering — simple but CPU and device can\'t overlap.':mode==='double'?'Double Buffering — CPU fills one buffer while device drains the other.':'Circular Buffering — multiple slots in a ring, maximizes overlap between producer and consumer.'}`}
                next="Configure rates and run to see overflow/underflow events and throughput."
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
