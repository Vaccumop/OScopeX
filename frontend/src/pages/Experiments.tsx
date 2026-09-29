import React, { useState, useEffect } from 'react';
import { Trash2, Copy, ExternalLink, Download, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { getExperiments, deleteExperiment, duplicateExperiment } from '@/services/api';
import { Card, PageHeader, Button, Badge, EmptyState } from '@/components/ui';
import { downloadJSON, downloadCSV } from '@/utils';
import type { Experiment } from '@/types';

export default function Experiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getExperiments();
      setExperiments(data);
    } catch {
      setError('Backend unavailable — experiment history requires the FastAPI server.');
      setExperiments([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    try { await deleteExperiment(id); setExperiments(exps => exps.filter(e => e.id !== id)); }
    catch { load(); }
  };

  const handleDuplicate = async (id: string) => {
    try { const copy = await duplicateExperiment(id); setExperiments(exps => [...exps, copy]); }
    catch { }
  };

  const MODULE_BADGE: Record<string, 'info'|'success'|'warning'|'error'|'purple'|'default'> = {
    scheduling: 'info', page_replacement: 'purple', disk: 'warning',
    deadlock: 'error', synchronization: 'success', memory: 'purple', ipc: 'default',
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Experiment History"
        subtitle="Saved simulation experiments"
        actions={<Button variant="secondary" size="sm" icon={<History size={12}/>} onClick={load}>Refresh</Button>}
      />

      {error && (
        <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"/></div>
      ) : experiments.length === 0 ? (
        <Card>
          <EmptyState
            title="No experiments saved"
            desc="Run a simulation and save it to build your experiment history. Requires the backend server to be running."
            action={<p className="text-xs text-slate-500 font-mono">Start: cd backend && python run.py</p>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {experiments.map(exp => (
            <motion.div key={exp.id} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>
              <Card>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white">{exp.name}</h3>
                      <Badge variant={MODULE_BADGE[exp.module] ?? 'default'}>{exp.module}</Badge>
                      <Badge variant="default">{exp.algorithm}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{new Date(exp.createdAt).toLocaleString()}</p>
                    {exp.metrics && (
                      <div className="flex gap-4 mt-2">
                        {Object.entries(exp.metrics).slice(0,4).map(([k,v])=>(
                          <span key={k} className="text-[10px] text-slate-500">
                            {k}: <span className="text-cyan-400">{typeof v === 'number' ? v.toFixed(2) : v}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="secondary" icon={<Download size={11}/>}
                      onClick={()=>downloadJSON(exp,`${exp.name}.json`)}>JSON</Button>
                    <Button size="sm" variant="secondary" icon={<Download size={11}/>}
                      onClick={()=>downloadCSV([exp.metrics as Record<string,unknown>],`${exp.name}_metrics.csv`)}>CSV</Button>
                    <Button size="sm" variant="secondary" icon={<Copy size={11}/>} onClick={()=>handleDuplicate(exp.id)}>Dupe</Button>
                    <Button size="sm" variant="danger" icon={<Trash2 size={11}/>} onClick={()=>handleDelete(exp.id)}>Delete</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
