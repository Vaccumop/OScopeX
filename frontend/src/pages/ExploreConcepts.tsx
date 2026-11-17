import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  BookOpen,
  FlaskConical,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ConceptEntry {
  id: string;
  name: string;
  unit: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tag: string;
  summary: string;
  lessonSlug: string;
  simUrl?: string;
}

const CONCEPTS: ConceptEntry[] = [
  { id: 'c1', name: 'Dual-Mode Operation (User vs Kernel)', unit: 1, difficulty: 'Beginner', tag: 'Architecture', summary: 'CPU privilege rings protecting memory and privileged instructions using mode bit traps.', lessonSlug: 'what-is-an-os', simUrl: '/dashboard' },
  { id: 'c2', name: 'System Calls & Trap Instructions', unit: 1, difficulty: 'Beginner', tag: 'Kernel Services', summary: 'Well-defined software traps allowing user-space applications to request privileged OS operations.', lessonSlug: 'system-calls-and-services', simUrl: '/ipc' },
  { id: 'c3', name: 'Process Control Block (PCB)', unit: 2, difficulty: 'Beginner', tag: 'Process', summary: 'Kernel data structure holding CPU registers, program counter, open files, and scheduling state.', lessonSlug: 'process-concept-and-states', simUrl: '/processes' },
  { id: 'c4', name: '5-State & 7-State Lifecycle', unit: 2, difficulty: 'Beginner', tag: 'Process', summary: 'Transitions between New, Ready, Running, Blocked, Terminated, and swapped Suspended states.', lessonSlug: 'process-concept-and-states', simUrl: '/processes' },
  { id: 'c5', name: 'Context Switching Overhead', unit: 2, difficulty: 'Intermediate', tag: 'CPU', summary: 'Cost of saving outgoing CPU register context and loading incoming state, causing TLB flushes.', lessonSlug: 'context-switching-and-threads', simUrl: '/scheduling' },
  { id: 'c6', name: 'Threads & Multithreading Models', unit: 2, difficulty: 'Intermediate', tag: 'Concurrency', summary: 'Lightweight execution units sharing process heap and memory with thread-private stacks.', lessonSlug: 'context-switching-and-threads', simUrl: '/scheduling' },
  { id: 'c7', name: 'Critical Section & Race Conditions', unit: 2, difficulty: 'Intermediate', tag: 'Synchronization', summary: 'Non-deterministic errors arising from unsynchronized concurrent shared memory writes.', lessonSlug: 'concurrency-mutex-semaphores', simUrl: '/synchronization' },
  { id: 'c8', name: 'Counting & Binary Semaphores', unit: 2, difficulty: 'Intermediate', tag: 'Synchronization', summary: 'Dijkstra wait() and signal() atomic operations managing shared resource access queues.', lessonSlug: 'concurrency-mutex-semaphores', simUrl: '/synchronization' },
  { id: 'c9', name: 'Turnaround & Waiting Time Metrics', unit: 3, difficulty: 'Beginner', tag: 'Scheduling', summary: 'Mathematical metrics evaluating turnaround time (CT - AT) and waiting time (TAT - BT).', lessonSlug: 'scheduling-criteria-and-formulas', simUrl: '/scheduling' },
  { id: 'c10', name: 'Convoy Effect in FCFS', unit: 3, difficulty: 'Beginner', tag: 'Scheduling', summary: 'Slowdown occurring when short I/O processes wait behind a massive CPU burst process.', lessonSlug: 'fcfs-sjf-srtf-algorithms', simUrl: '/scheduling' },
  { id: 'c11', name: 'Shortest Job First (SJF) Optimality', unit: 3, difficulty: 'Intermediate', tag: 'Scheduling', summary: 'Mathematical proof minimizing average waiting time by scheduling shorter bursts first.', lessonSlug: 'fcfs-sjf-srtf-algorithms', simUrl: '/scheduling' },
  { id: 'c12', name: 'Round Robin Quantum Trade-Off', unit: 3, difficulty: 'Intermediate', tag: 'Scheduling', summary: 'Balancing interactive response time against context switching CPU overhead.', lessonSlug: 'round-robin-priority-mlfq', simUrl: '/scheduling' },
  { id: 'c13', name: 'Priority Scheduling & Aging', unit: 3, difficulty: 'Intermediate', tag: 'Scheduling', summary: 'Gradually elevating waiting process priority over time to eliminate starvation.', lessonSlug: 'round-robin-priority-mlfq', simUrl: '/scheduling' },
  { id: 'c14', name: 'Multilevel Feedback Queue (MLFQ)', unit: 3, difficulty: 'Advanced', tag: 'Scheduling', summary: 'Adaptive priority demotion rewarding I/O-bound jobs and penalizing CPU hogs.', lessonSlug: 'round-robin-priority-mlfq', simUrl: '/scheduling' },
  { id: 'c15', name: 'Coffman’s 4 Deadlock Conditions', unit: 4, difficulty: 'Beginner', tag: 'Deadlock', summary: 'Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait necessary conditions.', lessonSlug: 'deadlock-concept-and-conditions', simUrl: '/deadlocks' },
  { id: 'c16', name: 'Resource Allocation Graph (RAG)', unit: 4, difficulty: 'Intermediate', tag: 'Deadlock', summary: 'Bipartite graph where cycles indicate deadlock for single-instance resource systems.', lessonSlug: 'deadlock-concept-and-conditions', simUrl: '/deadlocks' },
  { id: 'c17', name: 'Banker’s Algorithm & Safe Sequences', unit: 4, difficulty: 'Advanced', tag: 'Deadlock', summary: 'Dijkstra\'s deadlock avoidance algorithm evaluating Need <= Work for state safety.', lessonSlug: 'bankers-algorithm-and-avoidance', simUrl: '/deadlocks' },
  { id: 'c18', name: 'Internal vs External Fragmentation', unit: 5, difficulty: 'Beginner', tag: 'Memory', summary: 'Unused memory inside allocated partitions vs scattered holes between allocations.', lessonSlug: 'memory-partitioning-and-allocation', simUrl: '/memory' },
  { id: 'c19', name: 'MMU Address Translation in Paging', unit: 5, difficulty: 'Intermediate', tag: 'Memory', summary: 'Dividing logical address into Page Number and Offset to index the physical frame table.', lessonSlug: 'paging-and-address-translation', simUrl: '/memory' },
  { id: 'c20', name: 'Translation Lookaside Buffer (TLB)', unit: 5, difficulty: 'Intermediate', tag: 'Memory', summary: 'Fast associative hardware cache storing recent page-to-frame address translations.', lessonSlug: 'paging-and-address-translation', simUrl: '/memory' },
  { id: 'c21', name: 'Belady’s Anomaly in FIFO', unit: 5, difficulty: 'Intermediate', tag: 'Memory', summary: 'Counterintuitive situation where adding physical frames increases page fault count.', lessonSlug: 'page-replacement-algorithms', simUrl: '/page-replacement' },
  { id: 'c22', name: 'Optimal Page Replacement (OPT)', unit: 5, difficulty: 'Advanced', tag: 'Memory', summary: 'Theoretical benchmark evicting the page that will not be accessed for the longest future time.', lessonSlug: 'page-replacement-algorithms', simUrl: '/page-replacement' },
  { id: 'c23', name: 'Clock / Second Chance Algorithm', unit: 5, difficulty: 'Intermediate', tag: 'Memory', summary: 'Hardware-friendly circular ring approximation of LRU using page reference bits.', lessonSlug: 'page-replacement-algorithms', simUrl: '/page-replacement' },
  { id: 'c24', name: 'Direct Memory Access (DMA)', unit: 6, difficulty: 'Beginner', tag: 'I/O', summary: 'Hardware controller transferring bulk data directly to RAM with single block interrupt.', lessonSlug: 'io-buffering-and-device-management', simUrl: '/io-buffer' },
  { id: 'c25', name: 'Double Buffering (Ping-Pong)', unit: 6, difficulty: 'Intermediate', tag: 'I/O', summary: 'Overlapping device data transfer with CPU computation using alternating buffers.', lessonSlug: 'io-buffering-and-device-management', simUrl: '/io-buffer' },
  { id: 'c26', name: 'SCAN & LOOK Elevator Scheduling', unit: 6, difficulty: 'Intermediate', tag: 'Storage', summary: 'Disk head sweep algorithm servicing requests in directional sweeps to minimize seek latency.', lessonSlug: 'disk-scheduling-algorithms', simUrl: '/disk' },
  { id: 'c27', name: 'UNIX Inodes & Index Allocation', unit: 6, difficulty: 'Intermediate', tag: 'Storage', summary: 'Multi-level indexing combining direct, single indirect, and double indirect block pointers.', lessonSlug: 'file-systems-and-directory-structures', simUrl: '/dashboard' },
];

export default function ExploreConcepts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  const filteredConcepts = CONCEPTS.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.tag.toLowerCase().includes(search.toLowerCase());

    const matchesUnit = selectedUnit === 'ALL' || c.unit === selectedUnit;
    const matchesDiff = selectedDifficulty === 'ALL' || c.difficulty === selectedDifficulty;

    return matchesSearch && matchesUnit && matchesDiff;
  });

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers size={14} /> Knowledge Directory
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Explore Operating Systems Concepts
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Quickly search and jump into any of the 27+ core syllabus concepts across all six units. Filter by unit or difficulty, and launch matching simulators.
        </p>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 pt-4 border-t border-white/10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concept, algorithm, or mechanism (e.g. 'TLB', 'Banker', 'PCB', 'Inodes')..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-[#080d1a] border border-white/10 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Units (1-6)</option>
              <option value="1">Unit 1: Intro</option>
              <option value="2">Unit 2: Processes</option>
              <option value="3">Unit 3: CPU</option>
              <option value="4">Unit 4: Deadlocks</option>
              <option value="5">Unit 5: Memory</option>
              <option value="6">Unit 6: I/O & Files</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#080d1a] border border-white/10 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.map((concept) => (
          <div
            key={concept.id}
            className="bg-[#0d1526] border border-white/5 hover:border-cyan-500/20 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                  Unit {concept.unit} · {concept.tag}
                </span>
                <span className="text-[10px] text-slate-400 border border-white/5 px-2 py-0.5 rounded-full">
                  {concept.difficulty}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                {concept.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {concept.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              {concept.simUrl && (
                <button
                  onClick={() => navigate(concept.simUrl!)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <FlaskConical size={12} /> Lab
                </button>
              )}

              <button
                onClick={() => navigate(`/learn/${concept.lessonSlug}`)}
                className="text-xs text-white hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors ml-auto"
              >
                Study Lesson <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredConcepts.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-xs">
          No concepts match your filter criteria. Try clearing your search query.
        </div>
      )}
    </div>
  );
}
