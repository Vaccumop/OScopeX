import React, { useState, useCallback } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateAddress } from '@/services/api';
import { Card, PageHeader, Button, Input, Badge, ExplainBox } from '@/components/ui';

interface TLBEntry { page: number; frame: number; }
interface PageTableEntry { frame: number | null; valid: boolean; dirty: boolean; }

function clientTranslate(virtualAddress: number, pageSize: number, physicalFrames: number, tlbEntries: TLBEntry[], pageTable: PageTableEntry[]) {
  const offsetBits = Math.log2(pageSize);
  const pageNumber = Math.floor(virtualAddress / pageSize);
  const offset = virtualAddress % pageSize;
  // Check TLB
  const tlbHit = tlbEntries.find(e => e.page === pageNumber);
  if (tlbHit) {
    return { pageNumber, offset, frameNumber: tlbHit.frame, physicalAddress: tlbHit.frame * pageSize + offset, tlbHit: true, pageFault: false };
  }
  // Check page table
  const entry = pageTable[pageNumber];
  if (!entry || entry.frame === null || !entry.valid) {
    return { pageNumber, offset, frameNumber: null, physicalAddress: null, tlbHit: false, pageFault: true };
  }
  return { pageNumber, offset, frameNumber: entry.frame, physicalAddress: entry.frame * pageSize + offset, tlbHit: false, pageFault: false };
}

const SAMPLE_CONFIGS = [
  { label: '8-bit (256B VA, 16B pages)', virtualBits: 8, pageSize: 16, frames: 8, tlbSize: 4 },
  { label: '16-bit (4KB pages)', virtualBits: 16, pageSize: 4096, frames: 16, tlbSize: 8 },
];

export default function VirtualMemory() {
  const [virtualBits, setVirtualBits] = useState(8);
  const [pageSize, setPageSize] = useState(16);
  const [frames, setFrames] = useState(8);
  const [tlbSize, setTlbSize] = useState(4);
  const [vaInput, setVaInput] = useState('42');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof clientTranslate>|null>(null);
  const [animating, setAnimating] = useState(false);
  const [tlbEntries, setTlbEntries] = useState<TLBEntry[]>([{ page: 0, frame: 2 }, { page: 1, frame: 5 }]);
  const [pageTable, setPageTable] = useState<PageTableEntry[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({ frame: i < 8 ? i : null, valid: i < 8, dirty: false }))
  );
  const [stats, setStats] = useState({ tlbHits: 0, tlbMisses: 0, pageFaults: 0 });

  const maxVA = Math.pow(2, virtualBits) - 1;
  const numPages = Math.pow(2, virtualBits) / pageSize;

  const translate = async () => {
    const va = parseInt(vaInput, vaInput.startsWith('0x') ? 16 : 10);
    if (isNaN(va) || va < 0 || va > maxVA) return;
    setAnimating(true);
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await translateAddress({ virtualAddress: va, pageSize, physicalFrames: frames, tlbSize, pageTable: Object.fromEntries(pageTable.map((e, i) => [i, e.frame])) });
      setResult(res as ReturnType<typeof clientTranslate>);
      setStats(s => ({ tlbHits: s.tlbHits + (res.tlbHit ? 1 : 0), tlbMisses: s.tlbMisses + (!res.tlbHit && !res.pageFault ? 1 : 0), pageFaults: s.pageFaults + (res.pageFault ? 1 : 0) }));
    } catch {
      const res = clientTranslate(va, pageSize, frames, tlbEntries, pageTable);
      setResult(res);
      setStats(s => ({ tlbHits: s.tlbHits + (res.tlbHit ? 1 : 0), tlbMisses: s.tlbMisses + (!res.tlbHit && !res.pageFault ? 1 : 0), pageFaults: s.pageFaults + (res.pageFault ? 1 : 0) }));
    } finally { setLoading(false); setAnimating(false); }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Virtual Memory" subtitle="Address translation, TLB, and page table simulation"/>

      <div className="grid grid-cols-12 gap-4">
        {/* Config */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <Card title="Memory Configuration">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">Sample Config</label>
                <div className="flex flex-col gap-1 mt-1">
                  {SAMPLE_CONFIGS.map(c => (
                    <button key={c.label} onClick={() => { setVirtualBits(c.virtualBits); setPageSize(c.pageSize); setFrames(c.frames); setTlbSize(c.tlbSize); setResult(null); }}
                      className="text-left text-xs px-2 py-1.5 rounded bg-white/3 hover:bg-white/8 border border-white/5 hover:border-cyan-500/30 text-slate-400 transition-all">
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Virtual Address Bits" type="number" min={4} max={16} value={virtualBits} onChange={e => { setVirtualBits(+e.target.value); setResult(null); }} hint={`Address space: 0 – ${Math.pow(2, virtualBits)-1}`}/>
              <Input label={`Page Size (bytes)`} type="number" value={pageSize} onChange={e => setPageSize(+e.target.value)} hint={`${numPages.toFixed(0)} virtual pages`}/>
              <Input label="Physical Frames" type="number" min={2} max={64} value={frames} onChange={e => setFrames(+e.target.value)}/>
              <Input label="TLB Size (entries)" type="number" min={2} max={32} value={tlbSize} onChange={e => setTlbSize(+e.target.value)}/>
            </div>
          </Card>

          <Card title="Address Translation">
            <div className="space-y-3">
              <Input label={`Virtual Address (0–${maxVA})`} value={vaInput} onChange={e => setVaInput(e.target.value)} placeholder="42 or 0x2A"/>
              <Button variant="primary" className="w-full" icon={<Play size={12}/>} loading={loading} onClick={translate}>Translate</Button>
            </div>
            {result && (
              <div className="mt-3 space-y-2 border-t border-white/5 pt-3 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-500">Virtual Address</span><span className="text-white">{vaInput} = 0x{parseInt(vaInput).toString(16).toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Page Number</span><span className="text-cyan-400">{result.pageNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Offset</span><span className="text-cyan-400">{result.offset}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">TLB</span><Badge variant={result.tlbHit?'success':'warning'}>{result.tlbHit?'HIT':'MISS'}</Badge></div>
                <div className="flex justify-between"><span className="text-slate-500">Frame</span><span className={result.pageFault?'text-red-400':'text-green-400'}>{result.pageFault?'PAGE FAULT':result.frameNumber}</span></div>
                {!result.pageFault && <div className="flex justify-between"><span className="text-slate-500">Physical Addr</span><span className="text-purple-400">{result.physicalAddress}</span></div>}
              </div>
            )}
          </Card>
        </div>

        {/* Main area */}
        <div className="col-span-12 md:col-span-8 space-y-4">
          {/* Translation Animation */}
          <Card title="Address Translation Pipeline">
            <div className="flex items-center justify-between gap-2 py-4 overflow-x-auto">
              {[
                { label: 'Virtual Address', value: vaInput || '?', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
                { label: 'Page# | Offset', value: result ? `${result.pageNumber} | ${result.offset}` : '? | ?', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
                { label: 'TLB', value: result ? (result.tlbHit ? 'HIT ✓' : 'MISS') : '...', color: result?.tlbHit ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
                { label: 'Page Table', value: result ? (result.pageFault ? 'FAULT!' : `Frame ${result.frameNumber}`) : '...', color: result?.pageFault ? 'border-red-500/40 text-red-400 bg-red-500/10' : 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
                { label: 'Physical Addr', value: result && !result.pageFault ? String(result.physicalAddress) : '—', color: 'border-green-500/40 text-green-400 bg-green-500/10' },
              ].map((step, i) => (
                <React.Fragment key={step.label}>
                  <motion.div animate={animating ? { scale: [1, 1.05, 1] } : {}} transition={{ delay: i * 0.1 }}
                    className={`flex-shrink-0 border rounded-lg px-3 py-2 text-center ${step.color}`}>
                    <p className="text-[9px] text-slate-500 mb-1">{step.label}</p>
                    <p className="text-xs font-mono font-bold">{step.value}</p>
                  </motion.div>
                  {i < 4 && <ArrowRight size={12} className="flex-shrink-0 text-slate-600"/>}
                </React.Fragment>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* TLB */}
            <Card title="TLB" subtitle={`${tlbEntries.length}/${tlbSize} entries`}>
              <div className="space-y-1">
                <div className="flex text-[10px] text-slate-500 mb-1">
                  <span className="flex-1">Page</span><span className="flex-1">Frame</span><span className="flex-1">Status</span>
                </div>
                {tlbEntries.map((e, i) => (
                  <div key={i} className={`flex text-xs font-mono py-1 border-b border-white/3 ${result?.pageNumber === e.page ? 'bg-green-500/5' : ''}`}>
                    <span className="flex-1 text-cyan-400">{e.page}</span>
                    <span className="flex-1 text-purple-400">{e.frame}</span>
                    <span className="flex-1">{result?.pageNumber === e.page ? <Badge variant="success">Hit</Badge> : <Badge variant="default">—</Badge>}</span>
                  </div>
                ))}
                {tlbEntries.length < tlbSize && <p className="text-[10px] text-slate-600">{tlbSize - tlbEntries.length} empty entries</p>}
              </div>
            </Card>

            {/* Page Table */}
            <Card title="Page Table" subtitle={`${pageTable.filter(e=>e.valid).length} valid pages`}>
              <div className="overflow-y-auto max-h-48">
                <div className="flex text-[10px] text-slate-500 mb-1">
                  <span className="w-10">Page</span><span className="flex-1">Frame</span><span className="w-10">Valid</span>
                </div>
                {pageTable.slice(0, Math.min(16, numPages)).map((entry, i) => (
                  <div key={i} className={`flex text-xs font-mono py-0.5 border-b border-white/3 ${result?.pageNumber === i ? 'bg-purple-500/5' : ''}`}>
                    <span className="w-10 text-slate-500">{i}</span>
                    <span className="flex-1 text-purple-400">{entry.frame ?? '—'}</span>
                    <span className={`w-10 ${entry.valid?'text-green-400':'text-red-400'}`}>{entry.valid?'✓':'✗'}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'TLB Hits', value: stats.tlbHits, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
              { label: 'TLB Misses', value: stats.tlbMisses, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Page Faults', value: stats.pageFaults, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            ].map(s => (
              <div key={s.label} className={`border rounded-lg p-3 text-center ${s.bg}`}>
                <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <Card><ExplainBox what="A virtual address is split into a page number and offset. The page number maps to a physical frame." why="Virtual memory allows processes to use more address space than physically available RAM, and provides isolation." concept="Virtual Memory — Each process gets its own virtual address space. The OS + MMU translate virtual to physical addresses using a page table." next="Enter a virtual address above to see it translated step-by-step through TLB → Page Table → Physical Memory."/></Card>
        </div>
      </div>
    </div>
  );
}
