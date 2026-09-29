import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const PROCESS_STATE_COLORS: Record<string, string> = {
  NEW: '#6366f1',
  READY: '#22d3ee',
  RUNNING: '#22c55e',
  BLOCKED: '#f59e0b',
  SUSPENDED: '#94a3b8',
  TERMINATED: '#64748b',
};

export const ALGORITHM_COLORS = [
  '#22d3ee', '#22c55e', '#f59e0b', '#f43f5e',
  '#a855f7', '#fb923c', '#38bdf8', '#4ade80',
];

export const EVENT_COLORS: Record<string, string> = {
  PROCESS_CREATED: '#22c55e',
  PROCESS_TERMINATED: '#64748b',
  PROCESS_BLOCKED: '#f59e0b',
  PROCESS_UNBLOCKED: '#22d3ee',
  CPU_START: '#22c55e',
  CPU_IDLE: '#64748b',
  CONTEXT_SWITCH: '#a855f7',
  PAGE_FAULT: '#f43f5e',
  PAGE_HIT: '#22c55e',
  TLB_HIT: '#22d3ee',
  TLB_MISS: '#f59e0b',
  RESOURCE_REQUEST: '#fb923c',
  RESOURCE_GRANTED: '#22c55e',
  DEADLOCK_DETECTED: '#f43f5e',
  IO_START: '#fb923c',
  IO_COMPLETE: '#22c55e',
  DISK_REQUEST: '#f59e0b',
  DISK_COMPLETE: '#22c55e',
  IPC_SEND: '#22d3ee',
  IPC_RECEIVE: '#a855f7',
  BUFFER_FULL: '#f43f5e',
  BUFFER_EMPTY: '#f59e0b',
};

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
