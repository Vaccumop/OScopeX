import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookMarked,
  Search,
  ArrowRight,
} from 'lucide-react';

interface Term {
  term: string;
  category: 'Process' | 'Memory' | 'Scheduling' | 'Deadlock' | 'Storage' | 'Kernel';
  definition: string;
}

const GLOSSARY_TERMS: Term[] = [
  { term: 'Aging', category: 'Scheduling', definition: 'A technique of gradually increasing the priority of processes that wait in the system for a long time to prevent starvation.' },
  { term: 'Atomic Operation', category: 'Process', definition: 'An indivisible instruction sequence that completes in its entirety without being interrupted or preempted.' },
  { term: 'Banker’s Algorithm', category: 'Deadlock', definition: 'Dijkstra’s deadlock avoidance algorithm that tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources.' },
  { term: 'Belady’s Anomaly', category: 'Memory', definition: 'The phenomenon in FIFO page replacement where increasing the number of physical page frames results in an increase in the number of page faults.' },
  { term: 'Binary Semaphore', category: 'Process', definition: 'A synchronization variable restricted to values 0 and 1, functionally equivalent to a mutual exclusion (mutex) lock.' },
  { term: 'Blocked State', category: 'Process', definition: 'The process lifecycle state where a process cannot execute because it is waiting for an external event such as I/O completion or signal.' },
  { term: 'Bounded Buffer Problem', category: 'Process', definition: 'The classic Producer-Consumer synchronization problem with a finite buffer pool protected by mutex and counting semaphores.' },
  { term: 'Clock Algorithm', category: 'Memory', definition: 'A circular list page replacement algorithm providing a practical approximation of Least Recently Used (LRU) using reference bits.' },
  { term: 'Coffman Conditions', category: 'Deadlock', definition: 'The four necessary conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.' },
  { term: 'Context Switch', category: 'Kernel', definition: 'The procedure of saving the hardware execution context of a running process into its PCB and restoring the state of another.' },
  { term: 'Convoy Effect', category: 'Scheduling', definition: 'The slowdown occurring in FCFS when many short I/O-bound processes are delayed behind one long CPU-bound process.' },
  { term: 'Counting Semaphore', category: 'Process', definition: 'A semaphore whose integer value can range over an unrestricted domain, used to manage a finite pool of resource instances.' },
  { term: 'Critical Section', category: 'Process', definition: 'The segment of code in concurrent programs where shared variables or memory are accessed and modified.' },
  { term: 'Deadlock', category: 'Deadlock', definition: 'A state where a set of processes are blocked because each holds a resource while waiting for another resource held by another process in the set.' },
  { term: 'Demand Paging', category: 'Memory', definition: 'A virtual memory management scheme where pages are loaded from secondary storage into RAM only when they are referenced.' },
  { term: 'Dining Philosophers', category: 'Process', definition: 'A classical synchronization problem illustrating deadlock and starvation risks when multiple processes compete for shared non-preemptible resources.' },
  { term: 'Direct Memory Access (DMA)', category: 'Kernel', definition: 'A hardware feature allowing peripheral controllers to transfer bulk data blocks directly between device and RAM without continuous CPU intervention.' },
  { term: 'Effective Access Time (EAT)', category: 'Memory', definition: 'The average memory latency taking into account TLB hit ratio, TLB lookup time, and page table memory access cycles.' },
  { term: 'Elevator Algorithm (SCAN)', category: 'Storage', definition: 'A disk scheduling algorithm where the read/write head sweeps across tracks in one direction, servicing requests, then reverses.' },
  { term: 'External Fragmentation', category: 'Memory', definition: 'A condition where total free memory space exists to satisfy an allocation request, but the memory is split into non-contiguous holes.' },
  { term: 'First-Come, First-Served (FCFS)', category: 'Scheduling', definition: 'The simplest non-preemptive CPU scheduling algorithm that dispatches processes in their exact order of arrival.' },
  { term: 'Fork', category: 'Kernel', definition: 'The POSIX system call that creates an exact duplicate child process of the calling parent process.' },
  { term: 'Gantt Chart', category: 'Scheduling', definition: 'A horizontal bar chart illustrating the CPU scheduling timeline and process execution intervals.' },
  { term: 'Internal Fragmentation', category: 'Memory', definition: 'Unused memory space lying within an allocated physical partition or page.' },
  { term: 'Interrupt', category: 'Kernel', definition: 'A hardware or software signal emitted to the processor indicating an event that requires immediate attention from an interrupt handler.' },
  { term: 'Inode', category: 'Storage', definition: 'An index node in UNIX file systems storing metadata, attributes, and direct/indirect disk block pointers for a file.' },
  { term: 'Kernel Mode', category: 'Kernel', definition: 'The privileged execution mode (Ring 0) where the CPU has unrestricted access to all hardware instructions and memory.' },
  { term: 'Least Recently Used (LRU)', category: 'Memory', definition: 'An optimal-approximating page replacement algorithm that evicts the frame whose contents have gone longest without being referenced.' },
  { term: 'Logical Address', category: 'Memory', definition: 'An address generated by the CPU during execution, mapped to a physical RAM address by the Memory Management Unit (MMU).' },
  { term: 'Multilevel Feedback Queue (MLFQ)', category: 'Scheduling', definition: 'A complex CPU scheduler with multiple priority queues that dynamically adjusts process priority based on past CPU burst behavior.' },
  { term: 'Mutual Exclusion', category: 'Process', definition: 'The requirement that one and only one process may execute within its critical section at any given time.' },
  { term: 'Mutex', category: 'Process', definition: 'A locking mechanism used to synchronize access to a resource, with ownership properties strictly enforcing lock and unlock by the same thread.' },
  { term: 'Page Fault', category: 'Memory', definition: 'A hardware interrupt raised by the MMU when a process accesses a page that is mapped in the virtual address space but not currently in physical RAM.' },
  { term: 'Page Table', category: 'Memory', definition: 'A kernel data structure mapping virtual page numbers to physical frame numbers.' },
  { term: 'Preemption', category: 'Scheduling', definition: 'The act of temporarily interrupting an executing process and switching the CPU to another task without the process\'s voluntary consent.' },
  { term: 'Process Control Block (PCB)', category: 'Process', definition: 'A repository of all information needed to track, pause, and resume a process (PID, registers, PC, state, priority, open files).' },
  { term: 'Race Condition', category: 'Process', definition: 'An undesirable situation where output depends on the non-deterministic timing or interleaving of concurrent execution threads.' },
  { term: 'Resource Allocation Graph (RAG)', category: 'Deadlock', definition: 'A directed bipartite graph representing processes and resources, used to detect deadlocks via cycle detection algorithms.' },
  { term: 'Round Robin (RR)', category: 'Scheduling', definition: 'A preemptive scheduling algorithm that shares CPU time among ready processes in uniform circular time slices called quanta.' },
  { term: 'Semaphore', category: 'Process', definition: 'A synchronization variable accessed only via atomic wait() and signal() operations.' },
  { term: 'Shortest Job First (SJF)', category: 'Scheduling', definition: 'An optimal non-preemptive scheduling policy that picks the waiting process with the smallest estimated CPU burst time.' },
  { term: 'Spooling', category: 'Storage', definition: 'Simultaneous Peripheral Operations On-Line; buffering data on secondary storage for slow unshareable devices like printers.' },
  { term: 'Starvation', category: 'Scheduling', definition: 'Indefinite postponement where a ready process is repeatedly denied CPU or resource allocation due to higher-priority processes.' },
  { term: 'System Call', category: 'Kernel', definition: 'The programmatic gateway between user-mode applications and privileged operating system kernel services.' },
  { term: 'Thrashing', category: 'Memory', definition: 'A state where the operating system spends more time swapping virtual memory pages to and from disk than executing user instructions.' },
  { term: 'Translation Lookaside Buffer (TLB)', category: 'Memory', definition: 'A high-speed associative hardware cache in the MMU that stores recent virtual-to-physical address mappings.' },
  { term: 'User Mode', category: 'Kernel', definition: 'The unprivileged CPU mode (Ring 3) in which application software executes, restricted from direct hardware access.' },
  { term: 'Virtual Memory', category: 'Memory', definition: 'A memory abstraction technique that creates the illusion of a vast contiguous memory space larger than physical RAM.' },
  { term: 'Working Set Model', category: 'Memory', definition: 'Denning’s model defining the set of memory pages actively referenced by a process during a sliding time window Delta.' },
  { term: 'Zombie Process', category: 'Process', definition: 'A process that has finished execution but still retains an entry in the process table so its parent can read its exit code via wait().' },
];

export default function OSGlossary() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Process', 'Memory', 'Scheduling', 'Deadlock', 'Storage', 'Kernel'];

  const filtered = GLOSSARY_TERMS.filter((t) => {
    const matchesSearch =
      !search ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookMarked size={14} /> Academic Encyclopedia
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Operating Systems Glossary
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Over 50 standardized technical definitions across process management, CPU scheduling, synchronization, deadlocks, memory management, and file systems.
        </p>

        {/* Search & Category filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search glossary terms (e.g. 'TLB', 'Thrashing', 'Zombie', 'Spooling')..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-[#080e1c] font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.term}
            className="p-5 rounded-2xl bg-[#0d1526] border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 font-semibold">
                  {item.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                {item.term}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-xs">
          No glossary terms match your search.
        </div>
      )}
    </div>
  );
}
