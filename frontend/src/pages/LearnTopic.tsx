import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, ExplainBox, Button } from '@/components/ui';

interface TopicContent {
  title: string;
  subtitle: string;
  concept: string;
  simpleExplanation: string;
  keyPoints: string[];
  tryItLink: string;
  tryItLabel: string;
  what: string;
  why: string;
  next: string;
}

const TOPIC_ORDER = ['processes','threads','scheduling','synchronization','deadlocks','memory','virtual-memory','page-replacement','ipc','io','disk'];

const TOPICS: Record<string, TopicContent> = {
  processes: {
    title: 'Processes',
    subtitle: 'The fundamental unit of program execution',
    concept: 'A process is a program in execution. It consists of the program code, current activity (program counter, registers), a stack, a data section, and a heap. The OS manages processes through the Process Control Block (PCB).',
    simpleExplanation: 'Think of a recipe as a program. When you cook using that recipe, the cooking activity is the process. Multiple people can cook from the same recipe simultaneously — those are multiple processes.',
    keyPoints: [
      'A process has a unique PID (Process ID)',
      'Process states: NEW → READY → RUNNING → BLOCKED → TERMINATED',
      'The PCB stores all context needed to pause and resume a process',
      'Context switching saves one process\'s state and loads another\'s',
      'Processes are isolated — they cannot directly access each other\'s memory',
    ],
    tryItLink: '/processes',
    tryItLabel: 'Open Process Manager',
    what: 'A process transitions through states as the OS schedules and manages it.',
    why: 'The OS must multiplex CPU time among many processes to give the illusion of parallelism.',
    next: 'Processes communicate via IPC mechanisms like pipes, shared memory, and message queues.',
  },
  threads: {
    title: 'Threads',
    subtitle: 'Lightweight units of execution within a process',
    concept: 'A thread is the smallest unit of CPU execution. Multiple threads within a process share the same code, data, and files but each has its own stack and registers. Threads are cheaper to create than processes.',
    simpleExplanation: 'A process is like a restaurant. Threads are like the individual waiters. They all share the same kitchen (memory) and menu (code), but each serves customers independently.',
    keyPoints: [
      'Threads share the process address space — faster communication than IPC',
      'User-level threads: managed by a thread library (fast)',
      'Kernel-level threads: managed by OS (slower but true parallelism)',
      'Multithreading models: many-to-one, one-to-one, many-to-many',
      'Thread safety: shared data requires synchronization (mutexes, semaphores)',
    ],
    tryItLink: '/scheduling',
    tryItLabel: 'Open CPU Scheduler',
    what: 'Multiple threads execute concurrently within a single process.',
    why: 'Threads improve responsiveness (UI thread stays alive while worker threads compute) and performance on multi-core CPUs.',
    next: 'Concurrent threads accessing shared data require synchronization to avoid race conditions.',
  },
  scheduling: {
    title: 'CPU Scheduling',
    subtitle: 'Deciding which process runs next',
    concept: 'CPU scheduling determines which process in the ready queue gets the CPU next. The goal is to maximize CPU utilization and throughput while minimizing waiting and turnaround time. Different algorithms make different trade-offs.',
    simpleExplanation: 'Imagine a bank with one teller and many customers. The bank manager must decide who gets served next — first in line, shortest transaction, or by membership level. Each policy has pros and cons.',
    keyPoints: [
      'FCFS: Simple, non-preemptive. Convoy effect: long jobs block short ones.',
      'SJF: Optimal avg waiting time when burst times known. Possible starvation.',
      'SRTF: Preemptive SJF. Optimal but requires knowing remaining time.',
      'Round Robin: Each process gets a fixed quantum. Good for interactive systems.',
      'Priority: Higher-priority process runs first. Risk of starvation (use aging).',
      'MLFQ: Multiple queues with different algorithms. Used in real OSes.',
    ],
    tryItLink: '/scheduling',
    tryItLabel: 'Open CPU Scheduler',
    what: 'The scheduler selects a process from the ready queue and dispatches it to the CPU.',
    why: 'Without scheduling, processes would monopolize the CPU or be starved forever.',
    next: 'Try the same workload with FCFS vs Round Robin and compare waiting times.',
  },
  synchronization: {
    title: 'Synchronization',
    subtitle: 'Coordinating concurrent access to shared resources',
    concept: 'When multiple processes or threads access shared data concurrently, race conditions can corrupt data. Synchronization mechanisms (semaphores, mutexes, monitors) ensure that only one process accesses a critical section at a time.',
    simpleExplanation: 'Two people editing the same Google Doc simultaneously. Without coordination, one person\'s changes overwrite the other\'s. Synchronization is like a "lock" that says "I\'m editing — wait your turn."',
    keyPoints: [
      'Race condition: outcome depends on the order of execution',
      'Critical section: code that accesses shared resources',
      'Mutex: binary lock — only one thread holds it at a time',
      'Semaphore: counting lock — allows N concurrent accesses',
      'Producer-Consumer, Readers-Writers, Dining Philosophers: classical problems',
      'Deadlock can occur if locking is not carefully ordered',
    ],
    tryItLink: '/synchronization',
    tryItLabel: 'Open Synchronization Lab',
    what: 'Synchronization prevents concurrent accesses from corrupting shared data.',
    why: 'Without synchronization, concurrent writes to shared memory produce unpredictable results.',
    next: 'Simulate the Dining Philosophers with and without deadlock prevention.',
  },
  deadlocks: {
    title: 'Deadlocks',
    subtitle: 'Processes waiting forever for resources held by each other',
    concept: 'A deadlock occurs when a set of processes each holds a resource and waits for a resource held by another — forming a circular wait. The system makes no progress. The four necessary conditions are: Mutual Exclusion, Hold-and-Wait, No Preemption, and Circular Wait.',
    simpleExplanation: 'Two cars on a narrow bridge from opposite ends. Each waits for the other to reverse. Neither moves — deadlock.',
    keyPoints: [
      'Four necessary conditions (all must hold): Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
      'Detection: find cycles in the Resource Allocation Graph',
      'Prevention: eliminate one of the four conditions',
      'Avoidance: Banker\'s Algorithm — only grant requests that keep system in safe state',
      'Recovery: terminate processes or preempt resources',
    ],
    tryItLink: '/deadlocks',
    tryItLabel: 'Open Deadlock Lab',
    what: 'A deadlock traps processes in a permanent waiting state.',
    why: 'Resources held by deadlocked processes are permanently unavailable until the deadlock is resolved.',
    next: 'Run the Banker\'s Algorithm on a safe and an unsafe state to see the difference.',
  },
  memory: {
    title: 'Memory Management',
    subtitle: 'Allocating RAM among processes',
    concept: 'The OS must allocate memory to processes, protect one process\'s memory from another, and efficiently reuse freed memory. Techniques include contiguous allocation, segmentation, and paging.',
    simpleExplanation: 'RAM is like a hotel. The OS is the receptionist assigning rooms (memory blocks) to guests (processes). Some guests take one room, some take ten. The receptionist must ensure they don\'t walk into each other\'s rooms.',
    keyPoints: [
      'Physical vs logical address space',
      'Contiguous allocation: simple but causes fragmentation',
      'Paging: divide memory into fixed-size frames; processes into pages',
      'Segmentation: divide process into logical segments (code, stack, heap)',
      'Internal fragmentation: wasted space inside an allocated block',
      'External fragmentation: enough total free space but not contiguous',
    ],
    tryItLink: '/memory',
    tryItLabel: 'Open Virtual Memory',
    what: 'The OS assigns memory regions to processes and translates logical to physical addresses.',
    why: 'Without memory management, processes could corrupt each other\'s data.',
    next: 'Try virtual address translation in the Virtual Memory simulator.',
  },
  'virtual-memory': {
    title: 'Virtual Memory',
    subtitle: 'Creating the illusion of unlimited RAM',
    concept: 'Virtual memory allows processes to use more address space than physically available RAM by storing inactive pages on disk. When a page is needed but not in RAM, a page fault occurs and the OS loads it from disk.',
    simpleExplanation: 'You have a small desk (RAM) but many books (process data). You only keep the books you\'re currently reading on the desk. Others sit on shelves (disk). When you need a shelf book, you swap it with a desk book you\'re done with.',
    keyPoints: [
      'Virtual address: what the process uses; Physical address: actual RAM location',
      'Page table: maps virtual pages to physical frames',
      'TLB (Translation Lookaside Buffer): cache of recent page table entries',
      'Page fault: required page not in RAM — OS loads it from disk',
      'Thrashing: too many page faults, system spends more time paging than computing',
      'Working set: set of pages a process actively uses',
    ],
    tryItLink: '/memory',
    tryItLabel: 'Open Virtual Memory',
    what: 'A virtual address is split into page number and offset, then translated via TLB/page table.',
    why: 'Virtual memory enables process isolation, efficient memory use, and running programs larger than RAM.',
    next: 'Enter a virtual address to see TLB lookup and page table translation step-by-step.',
  },
  'page-replacement': {
    title: 'Page Replacement',
    subtitle: 'Choosing which page to evict when RAM is full',
    concept: 'When a page fault occurs and all frames are occupied, the OS must evict a page. The choice of victim page critically affects performance. Good algorithms minimize future page faults.',
    simpleExplanation: 'Your desk is full. You need a new book. Which book do you put back on the shelf? The one you haven\'t touched in longest (LRU)? The one you won\'t need again for the longest (Optimal)? The first one you put there (FIFO)?',
    keyPoints: [
      'FIFO: evict oldest page. Simple but can have Bélády\'s anomaly.',
      'LRU: evict least recently used. Good approximation of Optimal.',
      'Optimal (OPT): evict page used farthest in future. Theoretical best.',
      'Second Chance (Clock): FIFO with reference bits. Practical approximation of LRU.',
      'Bélády\'s Anomaly: more frames can cause more faults (with FIFO).',
      'Working Set Model: keep recently referenced pages in memory.',
    ],
    tryItLink: '/page-replacement',
    tryItLabel: 'Open Page Replacement',
    what: 'When all frames are full, the page replacement algorithm selects a victim to evict.',
    why: 'A poor replacement choice forces future page faults, slowing the system dramatically.',
    next: 'Compare FIFO vs LRU on the reference string "7 0 1 2 0 3 0 4 2 3 0 3".',
  },
  ipc: {
    title: 'Inter-Process Communication',
    subtitle: 'How processes exchange data',
    concept: 'Processes are isolated — they cannot directly access each other\'s memory. IPC mechanisms provide controlled ways to share data: pipes (byte streams), message queues (structured messages), shared memory (fastest), and signals (notifications).',
    simpleExplanation: 'Processes are like offices with closed doors. Pipes are pneumatic tubes between offices. Message queues are mailboxes. Shared memory is a whiteboard both offices can see. Signals are doorbells.',
    keyPoints: [
      'Pipe: unidirectional byte stream between related processes',
      'Named pipe (FIFO): like a pipe but between unrelated processes',
      'Message queue: prioritized structured messages with a queue',
      'Shared memory: fastest IPC; requires synchronization (semaphores)',
      'Signal: asynchronous notification to a process (SIGINT, SIGTERM...)',
      'Socket: IPC over a network (client-server model)',
    ],
    tryItLink: '/ipc',
    tryItLabel: 'Open IPC Lab',
    what: 'Processes communicate through shared OS-managed resources.',
    why: 'Process isolation is a safety feature; IPC provides controlled communication channels.',
    next: 'Simulate pipe-based communication and observe blocking when the buffer is full.',
  },
  io: {
    title: 'I/O Management',
    subtitle: 'Bridging the gap between CPU and devices',
    concept: 'I/O devices are much slower than the CPU. The OS uses buffering, caching, and scheduling to maximize throughput. Buffering decouples producers and consumers so neither must wait for the other\'s exact pace.',
    simpleExplanation: 'A fast assembly line (CPU) and a slow truck driver (I/O device). Without a warehouse (buffer), the assembly line stops and waits. With a buffer, production continues while the truck is loading.',
    keyPoints: [
      'Device controllers: hardware interfaces between CPU and devices',
      'Polling vs interrupts: polling wastes CPU; interrupts are more efficient',
      'DMA (Direct Memory Access): device transfers data directly to memory',
      'Single buffering: one buffer, sequential access',
      'Double buffering: CPU fills one buffer while device drains the other',
      'Spooling: output buffered to disk (e.g., print queue)',
    ],
    tryItLink: '/io-buffer',
    tryItLabel: 'Open I/O Buffer',
    what: 'Buffering decouples the CPU from slow I/O devices to improve throughput.',
    why: 'Direct synchronous I/O would stall the CPU for milliseconds per operation.',
    next: 'Compare single vs double buffering throughput at different producer/consumer rates.',
  },
  disk: {
    title: 'Disk Scheduling',
    subtitle: 'Minimizing disk head movement',
    concept: 'Disk access time = seek time + rotational latency + transfer time. Seek time dominates. Disk scheduling algorithms order pending requests to minimize total head movement, improving throughput and reducing latency.',
    simpleExplanation: 'An elevator serves multiple floors. It\'s inefficient to go to floor 1, then floor 50, then floor 3, then floor 48. It\'s much better to sweep up (SCAN) or always go to the nearest floor (SSTF).',
    keyPoints: [
      'FCFS: fair but often high total seek distance',
      'SSTF: minimizes each individual seek but can cause starvation',
      'SCAN (Elevator): sweep in one direction; reverse at end',
      'C-SCAN: sweep one direction only, jump back to start',
      'LOOK/C-LOOK: like SCAN/C-SCAN but reverse at last request, not boundary',
      'SSD scheduling is different: SSDs have no mechanical seek cost',
    ],
    tryItLink: '/disk',
    tryItLabel: 'Open Disk Scheduler',
    what: 'Disk scheduling reorders I/O requests to minimize total head travel distance.',
    why: 'Mechanical disks have seek times of 5–15ms. Serving in FCFS order on a busy disk is very slow.',
    next: 'Compare FCFS vs SSTF vs SCAN on the same request queue.',
  },
};

export default function LearnTopic() {
  const { topic = '' } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const content = TOPICS[topic];
  const idx = TOPIC_ORDER.indexOf(topic);
  const prev = idx > 0 ? TOPIC_ORDER[idx - 1] : null;
  const next = idx < TOPIC_ORDER.length - 1 ? TOPIC_ORDER[idx + 1] : null;

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-400 mb-4">Topic not found: {topic}</p>
        <Button onClick={() => navigate('/learn')} icon={<ArrowLeft size={12}/>}>Back to Learn OS</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/learn')} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
        <ArrowLeft size={12}/> All Topics
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{content.title}</h1>
        <p className="text-slate-400 mt-1">{content.subtitle}</p>
      </div>

      {/* Concept */}
      <Card title="Concept">
        <p className="text-sm text-slate-300 leading-relaxed">{content.concept}</p>
      </Card>

      {/* Simple Explanation */}
      <Card title="Simple Explanation">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <p className="text-sm text-slate-300 leading-relaxed italic">{content.simpleExplanation}</p>
        </div>
      </Card>

      {/* Key Points */}
      <Card title="Key Points">
        <ul className="space-y-2">
          {content.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300">
              <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* ExplainBox */}
      <ExplainBox
        title="OS Internals"
        what={content.what}
        why={content.why}
        concept={content.title}
        next={content.next}
      />

      {/* Try It */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl p-6 text-center">
        <h3 className="text-sm font-semibold text-white mb-2">Try It Yourself</h3>
        <p className="text-xs text-slate-400 mb-4">See the concept in action in the interactive simulator.</p>
        <Button variant="primary" icon={<ExternalLink size={12}/>} onClick={() => navigate(content.tryItLink)}>
          {content.tryItLabel}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-white/5">
        {prev ? (
          <button onClick={() => navigate(`/learn/${prev}`)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={14}/> {TOPICS[prev]?.title}
          </button>
        ) : <div/>}
        {next ? (
          <button onClick={() => navigate(`/learn/${next}`)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            {TOPICS[next]?.title} <ArrowRight size={14}/>
          </button>
        ) : <div/>}
      </div>
    </div>
  );
}
