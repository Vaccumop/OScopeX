import { create } from 'zustand';
import type { SimulationState, SimulationEvent, Process } from '@/types';
import { generateId } from '@/utils';

const DEFAULT_STATE: SimulationState = {
  currentTime: 0,
  processes: [],
  cpu: {
    utilization: 0,
    currentProcess: null,
    contextSwitches: 0,
    idleTime: 0,
    algorithm: 'FCFS',
  },
  memory: {
    totalFrames: 16,
    usedFrames: 0,
    pageFaults: 0,
    pageHits: 0,
    tlbHits: 0,
    tlbMisses: 0,
    frameTable: Array.from({ length: 16 }, (_, i) => ({
      frameId: i,
      pid: null,
      pageNum: null,
      dirty: false,
      referenced: false,
    })),
  },
  io: {
    activeOperations: 0,
    deviceQueues: {},
    bufferUtilization: 0,
    throughput: 0,
  },
  disk: {
    headPosition: 53,
    requestQueue: [],
    totalSeekDistance: 0,
    algorithm: 'FCFS',
  },
  resources: [],
  events: [],
  status: 'idle',
};

// Demo scenario loaded on first visit
const DEMO_PROCESSES: Process[] = [
  { pid: 1, name: 'init', state: 'RUNNING', arrivalTime: 0, burstTime: 8, remainingTime: 4, priority: 1, memoryRequired: 256, ioBurst: 0, ioDevice: '', parentPid: null, numPages: 4, programCounter: 0x1000, registers: { AX: 0, BX: 0, CX: 0, DX: 0 } },
  { pid: 2, name: 'bash', state: 'READY', arrivalTime: 1, burstTime: 4, remainingTime: 4, priority: 2, memoryRequired: 128, ioBurst: 2, ioDevice: 'keyboard', parentPid: 1, numPages: 2, programCounter: 0x2000, registers: { AX: 0, BX: 0, CX: 0, DX: 0 } },
  { pid: 3, name: 'firefox', state: 'BLOCKED', arrivalTime: 2, burstTime: 12, remainingTime: 9, priority: 3, memoryRequired: 512, ioBurst: 4, ioDevice: 'disk', parentPid: 1, numPages: 8, programCounter: 0x3000, registers: { AX: 0, BX: 0, CX: 0, DX: 0 } },
  { pid: 4, name: 'python', state: 'READY', arrivalTime: 3, burstTime: 6, remainingTime: 6, priority: 2, memoryRequired: 256, ioBurst: 1, ioDevice: 'network', parentPid: 2, numPages: 4, programCounter: 0x4000, registers: { AX: 0, BX: 0, CX: 0, DX: 0 } },
];

const DEMO_EVENTS: SimulationEvent[] = [
  { id: generateId(), timestamp: 0, type: 'PROCESS_CREATED', process: 'P1', details: { name: 'init' }, explanation: 'init process created as PID 1' },
  { id: generateId(), timestamp: 0.5, type: 'PROCESS_CREATED', process: 'P2', details: { name: 'bash' }, explanation: 'bash shell spawned by init' },
  { id: generateId(), timestamp: 1.0, type: 'CPU_START', process: 'P1', details: {}, explanation: 'P1 starts executing on CPU' },
  { id: generateId(), timestamp: 2.0, type: 'PROCESS_CREATED', process: 'P3', details: { name: 'firefox' }, explanation: 'firefox browser spawned' },
  { id: generateId(), timestamp: 2.5, type: 'CONTEXT_SWITCH', from: 'P1', to: 'P2', details: {}, explanation: 'Context switch from P1 to P2' },
  { id: generateId(), timestamp: 3.0, type: 'IO_START', process: 'P3', details: { device: 'disk' }, explanation: 'P3 initiates disk I/O request' },
  { id: generateId(), timestamp: 3.2, type: 'PROCESS_BLOCKED', process: 'P3', details: {}, explanation: 'P3 blocked waiting for disk I/O' },
  { id: generateId(), timestamp: 4.0, type: 'PAGE_FAULT', process: 'P2', details: { page: 3 }, explanation: 'Page fault: page 3 not in memory' },
  { id: generateId(), timestamp: 4.5, type: 'PROCESS_CREATED', process: 'P4', details: { name: 'python' }, explanation: 'python interpreter spawned by bash' },
  { id: generateId(), timestamp: 5.0, type: 'IO_COMPLETE', process: 'P3', details: { device: 'disk' }, explanation: 'Disk I/O completed for P3' },
  { id: generateId(), timestamp: 5.2, type: 'PROCESS_UNBLOCKED', process: 'P3', details: {}, explanation: 'P3 moves back to READY queue' },
  { id: generateId(), timestamp: 6.0, type: 'DISK_REQUEST', process: 'P4', details: { track: 98 }, explanation: 'P4 requests disk track 98' },
];

interface SimulationStore {
  state: SimulationState;
  replayIndex: number;
  replaySpeed: number;
  isReplaying: boolean;
  loadDemoScenario: () => void;
  resetSimulation: () => void;
  addProcess: (process: Process) => void;
  updateProcess: (pid: number, updates: Partial<Process>) => void;
  removeProcess: (pid: number) => void;
  addEvent: (event: Omit<SimulationEvent, 'id'>) => void;
  loadEvents: (events: SimulationEvent[]) => void;
  updateCPU: (cpu: Partial<SimulationState['cpu']>) => void;
  updateMemory: (memory: Partial<SimulationState['memory']>) => void;
  setSimulationStatus: (status: SimulationState['status']) => void;
  setCurrentTime: (time: number) => void;
  stepReplay: (direction: 'forward' | 'backward') => void;
  setReplaySpeed: (speed: number) => void;
  setReplayIndex: (index: number) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  state: {
    ...DEFAULT_STATE,
    processes: DEMO_PROCESSES,
    events: DEMO_EVENTS,
    currentTime: 6.0,
    status: 'paused',
    cpu: {
      ...DEFAULT_STATE.cpu,
      utilization: 72.5,
      currentProcess: 'P2',
      contextSwitches: 3,
      algorithm: 'RR',
      quantum: 2,
    },
    memory: {
      ...DEFAULT_STATE.memory,
      usedFrames: 6,
      pageFaults: 1,
      pageHits: 4,
    },
    io: {
      activeOperations: 1,
      deviceQueues: { disk: ['P4'], keyboard: [] },
      bufferUtilization: 45,
      throughput: 12.3,
    },
    disk: {
      headPosition: 53,
      requestQueue: [98, 183, 37, 122, 14],
      totalSeekDistance: 236,
      algorithm: 'SCAN',
    },
  },
  replayIndex: DEMO_EVENTS.length,
  replaySpeed: 1,
  isReplaying: false,

  loadDemoScenario: () =>
    set(s => ({
      state: {
        ...s.state,
        processes: DEMO_PROCESSES,
        events: DEMO_EVENTS,
        currentTime: 6.0,
        status: 'paused',
        cpu: { ...s.state.cpu, utilization: 72.5, currentProcess: 'P2', contextSwitches: 3 },
        memory: { ...s.state.memory, usedFrames: 6, pageFaults: 1 },
      },
      replayIndex: DEMO_EVENTS.length,
    })),

  resetSimulation: () =>
    set({
      state: { ...DEFAULT_STATE },
      replayIndex: 0,
      isReplaying: false,
    }),

  addProcess: (process) =>
    set(s => ({ state: { ...s.state, processes: [...s.state.processes, process] } })),

  updateProcess: (pid, updates) =>
    set(s => ({
      state: {
        ...s.state,
        processes: s.state.processes.map(p => p.pid === pid ? { ...p, ...updates } : p),
      },
    })),

  removeProcess: (pid) =>
    set(s => ({
      state: {
        ...s.state,
        processes: s.state.processes.filter(p => p.pid !== pid),
      },
    })),

  addEvent: (event) =>
    set(s => ({
      state: {
        ...s.state,
        events: [...s.state.events, { ...event, id: generateId() }],
      },
    })),

  loadEvents: (events) =>
    set(s => ({ state: { ...s.state, events }, replayIndex: events.length })),

  updateCPU: (cpu) =>
    set(s => ({ state: { ...s.state, cpu: { ...s.state.cpu, ...cpu } } })),

  updateMemory: (memory) =>
    set(s => ({ state: { ...s.state, memory: { ...s.state.memory, ...memory } } })),

  setSimulationStatus: (status) =>
    set(s => ({ state: { ...s.state, status } })),

  setCurrentTime: (time) =>
    set(s => ({ state: { ...s.state, currentTime: time } })),

  stepReplay: (direction) => {
    const { replayIndex, state } = get();
    if (direction === 'forward' && replayIndex < state.events.length) {
      set({ replayIndex: replayIndex + 1 });
    } else if (direction === 'backward' && replayIndex > 0) {
      set({ replayIndex: replayIndex - 1 });
    }
  },

  setReplaySpeed: (speed) => set({ replaySpeed: speed }),
  setReplayIndex: (index) => set({ replayIndex: index }),
}));
