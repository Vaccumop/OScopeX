import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AssignmentDef {
  id: string;
  title: string;
  unit: string;
  difficulty: 'Intermediate' | 'Advanced';
  scenario: string;
  tasks: string[];
  rubric: { criterion: string; marks: number }[];
  modelSolution: string;
}

const ASSIGNMENTS: AssignmentDef[] = [
  {
    id: 'asg-1',
    title: 'Design a Real-Time OS Scheduler for an Autonomous Drone',
    unit: 'Unit 3: CPU Scheduling',
    difficulty: 'Advanced',
    scenario: 'You are designing the flight controller software for a quadcopter drone running FreeRTOS on a single-core ARM Cortex-M4 microcontroller. The drone has 3 recurring tasks: (1) Sensor Fusion IMU reading every 5ms (burst 1ms), (2) Motor Output PWM update every 10ms (burst 2ms), and (3) Video telemetry streaming every 50ms (burst 15ms). A missed motor or IMU deadline causes catastrophic crash.',
    tasks: [
      'Analyze whether Rate Monotonic Scheduling (RMS) or Earliest Deadline First (EDF) is appropriate.',
      'Calculate total processor utilization: U = sum(C_i / T_i) and verify if it satisfies the Liu & Layland bound.',
      'Explain how priority inversion could occur if the video task and IMU task share a hardware I2C bus lock, and how Priority Inheritance resolves it.',
    ],
    rubric: [
      { criterion: 'Processor Utilization & Schedulability Test', marks: 30 },
      { criterion: 'Algorithm Choice (RMS vs EDF) Evaluation', marks: 35 },
      { criterion: 'Priority Inversion & Priority Inheritance Protocol explanation', marks: 35 },
    ],
    modelSolution: `1. Processor Utilization Analysis:
   - Task 1 (IMU): C1 = 1ms, T1 = 5ms -> U1 = 1/5 = 0.20 (20%)
   - Task 2 (Motor): C2 = 2ms, T2 = 10ms -> U2 = 2/10 = 0.20 (20%)
   - Task 3 (Video): C3 = 15ms, T3 = 50ms -> U3 = 15/50 = 0.30 (30%)
   - Total Utilization U = 0.20 + 0.20 + 0.30 = 0.70 (70%).
   - Liu & Layland bound for n=3 tasks: U_bound = 3 * (2^(1/3) - 1) approx 0.779 (77.9%).
   - Since 0.70 <= 0.779, the task set is mathematically guaranteed to meet all deadlines under Rate Monotonic Scheduling (RMS)!

2. Schedulability Choice:
   - Rate Monotonic Scheduling (RMS) is ideal because static priority assignments (shorter period = higher priority) have minimal overhead on microcontrollers compared to dynamic EDF deadline tracking.
   - Priority ranking: IMU (Priority 3, highest) -> Motor (Priority 2) -> Video (Priority 1, lowest).

3. Priority Inversion Solution:
   - If low-priority Video task acquires the I2C mutex, and intermediate Motor task preempts Video, the high-priority IMU task is blocked waiting for Video while Motor executes.
   - Priority Inheritance Protocol: Temporarily elevate the Video task\'s priority to that of the waiting IMU task (Priority 3) until it unlocks the I2C bus, preventing the Motor task from delaying it!`,
  },
  {
    id: 'asg-2',
    title: 'Diagnose Memory Thrashing & Working Set in Web Server',
    unit: 'Unit 5: Memory Management',
    difficulty: 'Intermediate',
    scenario: 'An e-commerce backend server experiences sudden performance collapse during Black Friday: CPU utilization drops from 95% down to 8%, while disk I/O queue length spikes to 100%. The team suspects Memory Thrashing.',
    tasks: [
      'Explain why CPU utilization drops dramatically when thrashing occurs.',
      'Formulate Peter Denning’s Working Set Model for virtual memory management.',
      'Propose 2 concrete kernel-level interventions to recover system throughput.',
    ],
    rubric: [
      { criterion: 'Explanation of Thrashing mechanics & page fault storm', marks: 30 },
      { criterion: 'Mathematical formulation of Working Set Model (WSS)', marks: 35 },
      { criterion: 'Remediation strategies (process suspension, Page Fault Frequency)', marks: 35 },
    ],
    modelSolution: `1. Thrashing Mechanics:
   - Thrashing occurs when total memory demand of active processes exceeds physical RAM capacity.
   - When page replacement cannot find unneeded pages, it evicts pages currently needed by other processes.
   - This triggers a cascading Page Fault Storm: all processes block waiting for disk swap reads. Because all processes are in the BLOCKED state waiting for I/O, CPU utilization plummets near zero while the disk swap channel is 100% saturated.

2. Working Set Model (Denning):
   - Working Set Window Delta: The most recent Delta page references of process P_i.
   - Working Set Size WSS_i: Number of distinct pages referenced in the window Delta.
   - Total Memory Demand D = sum(WSS_i).
   - If D > Total Physical Frames M, Thrashing is guaranteed to occur!

3. Remediation & Recovery:
   - Medium-Term Scheduler Swapping: The OS must immediately suspend 1 or 2 processes (transition to READY-SUSPENDED on disk), freeing all their allocated frames for the remaining processes.
   - Page Fault Frequency (PFF) Strategy: Establish upper and lower bounds for acceptable page fault rate per process. If fault rate exceeds upper bound, assign more frames; if no frames exist, suspend the process.`,
  },
];

export default function Assignments() {
  const [expandedId, setExpandedId] = useState<string>('asg-1');
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  const toggleSolution = (id: string) => {
    setShowSolution((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ClipboardList size={14} /> Practical System Design
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Practical OS Problem Assignments
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Real-world engineering scenarios testing real-time scheduling bounds, memory thrashing diagnosis, and concurrency synchronization. Work through the tasks and compare with the model solutions.
        </p>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {ASSIGNMENTS.map((asg) => {
          const isExpanded = expandedId === asg.id;
          const solVisible = showSolution[asg.id];

          return (
            <div
              key={asg.id}
              className="bg-[#0d1526] border border-white/5 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? '' : asg.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 font-bold">
                      {asg.unit}
                    </span>
                    <span className="text-xs text-slate-400">{asg.difficulty}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{asg.title}</h3>
                </div>

                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 border-t border-white/5 space-y-5 bg-[#0a101f]">
                  {/* Scenario */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engineering Scenario</h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                      {asg.scenario}
                    </p>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Deliverables</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {asg.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">{i + 1}.</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rubric */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Rubric (100 Marks)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {asg.rubric.map((r, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs flex justify-between items-center">
                          <span className="text-slate-300 text-[11px]">{r.criterion}</span>
                          <span className="font-mono text-cyan-400 font-bold text-[11px]">{r.marks} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Model Solution Toggle */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleSolution(asg.id)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-semibold flex items-center gap-2 border border-cyan-500/20 transition-all"
                    >
                      <BookOpen size={14} />
                      {solVisible ? 'Hide Model Solution' : 'View Verified Model Solution'}
                    </button>

                    {solVisible && (
                      <div className="mt-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed animate-in fade-in">
                        {asg.modelSolution}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
