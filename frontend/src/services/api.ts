import axios from 'axios';
import type {
  SchedulingConfig,
  SchedulingMetrics,
  GanttSlot,
  SimulationEvent,
  BankersInput,
  BankersResult,
  PageReplacementAlgorithm,
  PageReplacementResult,
  DiskAlgorithm,
  DiskSchedulingResult,
  WhatIfConfig,
  WhatIfResult,
  Experiment,
  Process,
} from '@/types';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// ── Scheduling ─────────────────────────────────────────────
export interface SchedulingRequest {
  processes: Pick<Process, 'pid' | 'name' | 'arrivalTime' | 'burstTime' | 'priority' | 'ioBurst'>[];
  config: SchedulingConfig;
}
export interface SchedulingResponse {
  gantt: GanttSlot[];
  metrics: SchedulingMetrics;
  events: SimulationEvent[];
}
export const simulateScheduling = (req: SchedulingRequest) =>
  api.post<SchedulingResponse>('/scheduling/simulate', {
    processes: req.processes.map(p => ({
      pid: p.pid,
      name: p.name,
      arrival_time: p.arrivalTime,
      burst_time: p.burstTime,
      priority: p.priority,
      io_burst: p.ioBurst,
    })),
    config: req.config,
  }).then(r => r.data);

export const compareScheduling = (
  req: {
    processes: SchedulingRequest['processes'];
    configs: SchedulingConfig[];
  }
) =>
  api.post<SchedulingResponse[]>('/scheduling/compare', {
    processes: req.processes.map(p => ({
      pid: p.pid,
      name: p.name,
      arrival_time: p.arrivalTime,
      burst_time: p.burstTime,
      priority: p.priority,
      io_burst: p.ioBurst,
    })),
    configs: req.configs,
  }).then(r => r.data);

// ── Page Replacement ────────────────────────────────────────
export const simulatePageReplacement = (req: {
  algorithm: PageReplacementAlgorithm;
  referenceString: number[];
  frames: number;
}) => api.post<PageReplacementResult>('/memory/page-replacement', req).then(r => r.data);

export const translateAddress = (req: {
  virtualAddress: number;
  pageSize: number;
  physicalFrames: number;
  tlbSize: number;
  pageTable: Record<number, number | null>;
}) => api.post<{
  pageNumber: number;
  offset: number;
  frameNumber: number | null;
  physicalAddress: number | null;
  tlbHit: boolean;
  pageFault: boolean;
}>('/memory/translate', req).then(r => r.data);

// ── Deadlock ────────────────────────────────────────────────
export const runBankersAlgorithm = (req: BankersInput) =>
  api.post<BankersResult>('/deadlock/banker', req).then(r => r.data);

export const detectDeadlock = (req: {
  processes: string[];
  resources: string[];
  allocation: Record<string, Record<string, number>>;
  request: Record<string, Record<string, number>>;
}) => api.post<{
  deadlocked: boolean;
  cycle: string[];
  involvedProcesses: string[];
  involvedResources: string[];
}>('/deadlock/detect', req).then(r => r.data);

// ── Synchronization ─────────────────────────────────────────
export const simulateProducerConsumer = (req: {
  producers: number;
  consumers: number;
  bufferSize: number;
  productionRate: number;
  consumptionRate: number;
  steps: number;
}) => api.post<{ events: SimulationEvent[]; bufferStates: number[]; metrics: Record<string, number> }>(
  '/sync/producer-consumer', req).then(r => r.data);

export const simulateReadersWriters = (req: {
  readers: number;
  writers: number;
  steps: number;
  writerPriority: boolean;
}) => api.post<{ events: SimulationEvent[]; metrics: Record<string, number> }>(
  '/sync/readers-writers', req).then(r => r.data);

export const simulateDiningPhilosophers = (req: {
  philosophers: number;
  steps: number;
  preventDeadlock: boolean;
}) => api.post<{ events: SimulationEvent[]; states: string[][] }>(
  '/sync/dining-philosophers', req).then(r => r.data);

// ── Disk Scheduling ─────────────────────────────────────────
export const simulateDisk = (req: {
  algorithm: DiskAlgorithm;
  initialHead: number;
  diskSize: number;
  requests: number[];
  direction?: 'left' | 'right';
}) => api.post<DiskSchedulingResult>('/disk/simulate', req).then(r => r.data);

// ── IPC ─────────────────────────────────────────────────────
export const simulateIPC = (req: {
  mechanism: string;
  senderCount: number;
  receiverCount: number;
  messageCount: number;
  bufferSize: number;
}) => api.post<{ events: SimulationEvent[]; metrics: Record<string, number> }>(
  '/ipc/simulate', req).then(r => r.data);

// ── I/O Buffering ───────────────────────────────────────────
export const simulateIOBuffer = (req: {
  mode: 'single' | 'double' | 'circular';
  bufferSize: number;
  producerRate: number;
  consumerRate: number;
  steps: number;
}) => api.post<{ events: SimulationEvent[]; bufferHistory: number[]; metrics: Record<string, number> }>(
  '/io/buffer', req).then(r => r.data);

// ── What-If ─────────────────────────────────────────────────
export const runWhatIf = (req: WhatIfConfig) =>
  api.post<WhatIfResult>('/whatif/compare', req).then(r => r.data);

// ── Experiments ─────────────────────────────────────────────
export const getExperiments = () =>
  api.get<Experiment[]>('/experiments').then(r => r.data);

export const getExperiment = (id: string) =>
  api.get<Experiment>(`/experiments/${id}`).then(r => r.data);

export const saveExperiment = (exp: Omit<Experiment, 'id' | 'createdAt'>) =>
  api.post<Experiment>('/experiments', exp).then(r => r.data);

export const deleteExperiment = (id: string) =>
  api.delete(`/experiments/${id}`).then(r => r.data);

export const duplicateExperiment = (id: string) =>
  api.post<Experiment>(`/experiments/${id}/duplicate`).then(r => r.data);

export default api;
