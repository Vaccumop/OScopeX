import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface NumericalProblem {
  id: string;
  category: 'Scheduling' | 'Banker' | 'Memory' | 'Disk';
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'University Exam';
  prompt: string;
  inputsDesc: string;
  userInputs: { key: string; label: string; placeholder: string }[];
  expectedValues: Record<string, number | string>;
  solutionSteps: string[];
}

const PROBLEMS: NumericalProblem[] = [
  {
    id: 'num-sched-1',
    category: 'Scheduling',
    title: 'FCFS Turnaround & Waiting Time',
    difficulty: 'Beginner',
    prompt: 'Three processes arrive at time 0 with burst times: P1 = 24 ms, P2 = 3 ms, P3 = 3 ms. Using First-Come, First-Served (FCFS) in order P1, P2, P3, compute the average waiting time and average turnaround time.',
    inputsDesc: 'Enter values rounded to 2 decimal places:',
    userInputs: [
      { key: 'avgWT', label: 'Average Waiting Time (ms)', placeholder: 'e.g. 17.0' },
      { key: 'avgTAT', label: 'Average Turnaround Time (ms)', placeholder: 'e.g. 27.0' },
    ],
    expectedValues: {
      avgWT: 17,
      avgTAT: 27,
    },
    solutionSteps: [
      'Gantt Chart timeline: P1 runs from 0 to 24; P2 runs from 24 to 27; P3 runs from 27 to 30.',
      'Waiting Times: P1 WT = 0; P2 WT = 24; P3 WT = 27.',
      'Average Waiting Time = (0 + 24 + 27) / 3 = 51 / 3 = 17.0 ms.',
      'Turnaround Times: P1 TAT = 24; P2 TAT = 27; P3 TAT = 30.',
      'Average Turnaround Time = (24 + 27 + 30) / 3 = 81 / 3 = 27.0 ms.',
    ],
  },
  {
    id: 'num-eat-1',
    category: 'Memory',
    title: 'Effective Memory Access Time (EAT) with TLB',
    difficulty: 'Intermediate',
    prompt: 'Consider a paging system where the main memory access time is 100 ns and the TLB lookup time is 20 ns. If the TLB hit ratio is 80%, what is the Effective Access Time (EAT)?',
    inputsDesc: 'Enter calculated EAT in nanoseconds:',
    userInputs: [
      { key: 'eat', label: 'Effective Access Time (ns)', placeholder: 'e.g. 140' },
    ],
    expectedValues: {
      eat: 140,
    },
    solutionSteps: [
      'Formula: EAT = h * (tlb + mem) + (1 - h) * (tlb + 2 * mem)',
      'On TLB Hit (probability h = 0.80): time = 20 ns + 100 ns = 120 ns.',
      'On TLB Miss (probability 1 - h = 0.20): time = 20 ns (TLB search) + 100 ns (page table read in RAM) + 100 ns (data read in RAM) = 220 ns.',
      'EAT = 0.80 * 120 + 0.20 * 220 = 96 + 44 = 140.0 ns.',
    ],
  },
  {
    id: 'num-page-trans',
    category: 'Memory',
    title: 'Logical to Physical Address Translation',
    difficulty: 'Intermediate',
    prompt: 'In a paging system with Page Size = 1 KB (1024 bytes), a process references logical address 3500. If logical page 3 is mapped to physical frame 6, calculate the Page Number, Offset, and final Physical Address.',
    inputsDesc: 'Enter calculated integer values:',
    userInputs: [
      { key: 'page', label: 'Page Number (p)', placeholder: 'e.g. 3' },
      { key: 'offset', label: 'Page Offset (d)', placeholder: 'e.g. 428' },
      { key: 'physAddr', label: 'Physical Address', placeholder: 'e.g. 6572' },
    ],
    expectedValues: {
      page: 3,
      offset: 428,
      physAddr: 6572,
    },
    solutionSteps: [
      'Page Size = 1024 bytes.',
      'Page Number p = floor(3500 / 1024) = 3.',
      'Offset d = 3500 mod 1024 = 3500 - 3072 = 428.',
      'Frame number f = 6 (given by Page Table).',
      'Physical Address = (Frame Number * Page Size) + Offset = (6 * 1024) + 428 = 6144 + 428 = 6572.',
    ],
  },
  {
    id: 'num-disk-sstf',
    category: 'Disk',
    title: 'SSTF Total Seek Distance Calculation',
    difficulty: 'University Exam',
    prompt: 'A disk head is initially at cylinder 50. The queue of pending requests in FIFO order is: [82, 170, 43, 140, 24, 16, 190]. Using Shortest Seek Time First (SSTF), calculate the Total Head Movement (cylinders traversed).',
    inputsDesc: 'Enter total cylinders traversed:',
    userInputs: [
      { key: 'seekDistance', label: 'Total Seek Distance (cylinders)', placeholder: 'e.g. 208' },
    ],
    expectedValues: {
      seekDistance: 208,
    },
    solutionSteps: [
      'Initial head = 50.',
      'Pending: [82, 170, 43, 140, 24, 16, 190].',
      'From 50: nearest is 43 (dist = 7). Head -> 43.',
      'From 43: nearest is 24 (dist = 19). Head -> 24.',
      'From 24: nearest is 16 (dist = 8). Head -> 16.',
      'From 16: nearest is 82 (dist = 66). Head -> 82.',
      'From 82: nearest is 140 (dist = 58). Head -> 140.',
      'From 140: nearest is 170 (dist = 30). Head -> 170.',
      'From 170: nearest is 190 (dist = 20). Head -> 190.',
      'Total Seek = 7 + 19 + 8 + 66 + 58 + 30 + 20 = 208 cylinders.',
    ],
  },
];

export default function NumericalPractice() {
  const [selectedProblem, setSelectedProblem] = useState<NumericalProblem>(PROBLEMS[0]);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [evaluated, setEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleInputChange = (key: string, val: string) => {
    setUserInputs((prev) => ({ ...prev, [key]: val }));
    setEvaluated(false);
  };

  const handleVerify = () => {
    let allRight = true;
    for (const [key, expected] of Object.entries(selectedProblem.expectedValues)) {
      const userVal = parseFloat(userInputs[key] || '');
      const expectedNum = typeof expected === 'number' ? expected : parseFloat(expected);
      if (isNaN(userVal) || Math.abs(userVal - expectedNum) > 0.05) {
        allRight = false;
        break;
      }
    }
    setIsCorrect(allRight);
    setEvaluated(true);
  };

  const handleReset = () => {
    setUserInputs({});
    setEvaluated(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator size={14} /> Mathematical & Analytical OS Mastery
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          OS Numerical Problem Practice Engine
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Solve standard university examination numerical problems in CPU scheduling, memory translation, EAT with TLB, page faults, and disk head movements with real-time validation and step-by-step solutions.
        </p>

        {/* Problem Picker */}
        <div className="flex flex-wrap gap-2 mt-6">
          {PROBLEMS.map((prob) => (
            <button
              key={prob.id}
              onClick={() => {
                setSelectedProblem(prob);
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedProblem.id === prob.id
                  ? 'bg-amber-500 text-[#080e1c] shadow-md shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {prob.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Problem Card */}
      <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {selectedProblem.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Difficulty: <strong className="text-amber-400">{selectedProblem.difficulty}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{selectedProblem.title}</h2>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 self-start sm:self-auto"
          >
            <RotateCcw size={12} /> Clear Answers
          </button>
        </div>

        {/* Problem Prompt */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-slate-200 leading-relaxed font-sans">
          {selectedProblem.prompt}
        </div>

        {/* Structured Input Fields */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400">{selectedProblem.inputsDesc}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedProblem.userInputs.map((inp) => (
              <div key={inp.key} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">{inp.label}</label>
                <input
                  type="text"
                  value={userInputs[inp.key] || ''}
                  onChange={(e) => handleInputChange(inp.key, e.target.value)}
                  placeholder={inp.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit & Result */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#080e1c] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <CheckCircle2 size={14} /> Verify Solution
          </button>

          {evaluated && (
            <div
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border animate-in fade-in ${
                isCorrect
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{isCorrect ? 'Correct Answer! +50 XP' : 'Incorrect. Check the step-by-step solution below.'}</span>
            </div>
          )}
        </div>

        {/* Step-by-Step Solution Breakdown */}
        {evaluated && (
          <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-3 animate-in fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <BookOpen size={14} /> Complete Step-by-Step Mathematical Derivation
            </h3>
            <div className="space-y-2 text-xs font-mono text-slate-200">
              {selectedProblem.solutionSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-cyan-400 font-bold">{i + 1}.</span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
