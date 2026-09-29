// ============================================================
// Core simulation types shared across the entire application
// ============================================================

export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'BLOCKED' | 'SUSPENDED' | 'TERMINATED';

export interface Process {
  pid: number;
  name: string;
  state: ProcessState;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  priority: number;
  memoryRequired: number;
  ioBurst: number;
  ioDevice: string;
  parentPid: number | null;
  numPages: number;
  completionTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  responseTime?: number;
  programCounter: number;
  registers: Record<string, number>;
}

export type EventType =
  | 'PROCESS_CREATED'
  | 'PROCESS_TERMINATED'
  | 'PROCESS_BLOCKED'
  | 'PROCESS_UNBLOCKED'
  | 'CPU_START'
  | 'CPU_IDLE'
  | 'CONTEXT_SWITCH'
  | 'PAGE_FAULT'
  | 'PAGE_HIT'
  | 'TLB_HIT'
  | 'TLB_MISS'
  | 'RESOURCE_REQUEST'
  | 'RESOURCE_GRANTED'
  | 'DEADLOCK_DETECTED'
  | 'IO_START'
  | 'IO_COMPLETE'
  | 'DISK_REQUEST'
  | 'DISK_COMPLETE'
  | 'IPC_SEND'
  | 'IPC_RECEIVE'
  | 'BUFFER_FULL'
  | 'BUFFER_EMPTY'
  | 'SIMULATION_START'
  | 'SIMULATION_END';

export interface SimulationEvent {
  id: string;
  timestamp: number;
  type: EventType;
  process?: string;
  from?: string;
  to?: string;
  details: Record<string, unknown>;
  explanation?: string;
}

export interface CPUState {
  utilization: number;
  currentProcess: string | null;
  contextSwitches: number;
  idleTime: number;
  algorithm: string;
  quantum?: number;
}

export interface MemoryState {
  totalFrames: number;
  usedFrames: number;
  pageFaults: number;
  pageHits: number;
  tlbHits: number;
  tlbMisses: number;
  frameTable: FrameEntry[];
}

export interface FrameEntry {
  frameId: number;
  pid: number | null;
  pageNum: number | null;
  dirty: boolean;
  referenced: boolean;
}

export interface IOState {
  activeOperations: number;
  deviceQueues: Record<string, string[]>;
  bufferUtilization: number;
  throughput: number;
}

export interface DiskState {
  headPosition: number;
  requestQueue: number[];
  totalSeekDistance: number;
  algorithm: string;
}

export interface SimulationState {
  currentTime: number;
  processes: Process[];
  cpu: CPUState;
  memory: MemoryState;
  io: IOState;
  disk: DiskState;
  resources: ResourceState[];
  events: SimulationEvent[];
  status: 'idle' | 'running' | 'paused' | 'completed';
}

export interface ResourceState {
  resourceId: string;
  name: string;
  totalInstances: number;
  availableInstances: number;
  allocatedTo: Record<string, number>; // pid -> count
  requestedBy: Record<string, number>; // pid -> count
}

// CPU Scheduling Types
export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'PRIORITY' | 'MLQ' | 'MLFQ';

export interface SchedulingConfig {
  algorithm: SchedulingAlgorithm;
  quantum?: number;
  preemptive?: boolean;
  agingEnabled?: boolean;
  agingThreshold?: number;
}

export interface GanttSlot {
  pid: string;
  start: number;
  end: number;
  color?: string;
}

export interface SchedulingMetrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  throughput: number;
  contextSwitches: number;
  processMetrics: ProcessMetric[];
}

export interface ProcessMetric {
  pid: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

// Page Replacement Types
export type PageReplacementAlgorithm = 'FIFO' | 'LRU' | 'OPTIMAL' | 'SECOND_CHANCE';

export interface PageReplacementStep {
  reference: number;
  frames: (number | null)[];
  fault: boolean;
  evicted: number | null;
  hit: boolean;
}

export interface PageReplacementResult {
  steps: PageReplacementStep[];
  totalFaults: number;
  totalHits: number;
  faultRatio: number;
  hitRatio: number;
  events: SimulationEvent[];
}

// Disk Scheduling Types
export type DiskAlgorithm = 'FCFS' | 'SSTF' | 'SCAN' | 'CSCAN' | 'LOOK' | 'CLOOK';

export interface DiskSchedulingResult {
  order: number[];
  seekSequence: number[];
  totalSeekDistance: number;
  avgSeekDistance: number;
  serviceOrder: number[];
  events: SimulationEvent[];
}

// Banker's Algorithm Types
export interface BankersInput {
  processes: number;
  resources: number;
  available: number[];
  maximum: number[][];
  allocation: number[][];
}

export interface BankersResult {
  safe: boolean;
  safeSequence: number[];
  needMatrix: number[][];
  steps: BankersStep[];
}

export interface BankersStep {
  process: number;
  work: number[];
  finish: boolean[];
  allocated: boolean;
}

// Experiment Types
export interface Experiment {
  id: string;
  name: string;
  module: string;
  createdAt: string;
  config: Record<string, unknown>;
  workload: unknown[];
  algorithm: string;
  metrics: Record<string, number>;
  eventLog: SimulationEvent[];
}

// What-If Types
export interface WhatIfConfig {
  baselineConfig: Record<string, unknown>;
  alternativeConfig: Record<string, unknown>;
  workload: unknown[];
  module: string;
}

export interface WhatIfResult {
  baseline: Record<string, number>;
  alternative: Record<string, number>;
  diff: Record<string, { absolute: number; percent: number; improved: boolean }>;
  baselineEvents: SimulationEvent[];
  alternativeEvents: SimulationEvent[];
}

// IPC Types
export type IPCMechanism = 'PIPE' | 'MESSAGE_QUEUE' | 'SHARED_MEMORY' | 'SIGNALS';

export interface IPCMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: number;
  priority?: number;
}

// Sync Types
export type SyncProblem = 'PRODUCER_CONSUMER' | 'READERS_WRITERS' | 'DINING_PHILOSOPHERS';

export interface SyncStep {
  time: number;
  entity: string;
  action: string;
  state: Record<string, unknown>;
}
