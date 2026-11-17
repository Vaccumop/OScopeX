import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';

interface QuizQuestion {
  id: string;
  unit: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    unit: 1,
    question: 'Which CPU instruction triggers a software interrupt to switch execution from User Mode to Kernel Mode?',
    options: ['HALT', 'TRAP / SYSCALL', 'NOP', 'JMP'],
    correctIndex: 1,
    explanation: 'A trap or syscall instruction triggers a software interrupt that sets the CPU mode bit to kernel mode.',
  },
  {
    id: 'q2',
    unit: 1,
    question: 'In which type of operating system do users have rapid interactive access through time slicing?',
    options: ['Batch OS', 'Time-Sharing / Multitasking OS', 'Hard Real-Time OS', 'Distributed File System'],
    correctIndex: 1,
    explanation: 'Time-sharing uses timer preemption and rapid round-robin CPU scheduling to allow multiple users to interact with their programs concurrently.',
  },
  {
    id: 'q3',
    unit: 2,
    question: 'What is the primary difference between a Process and a Thread?',
    options: [
      'Threads run in kernel mode while processes run in user mode',
      'Threads within the same process share code, heap, and address space, but have private stacks and registers',
      'Processes share their memory automatically without IPC',
      'Threads cannot be scheduled by the CPU',
    ],
    correctIndex: 1,
    explanation: 'Threads share the same virtual address space, data, and open files of their enclosing process, but each thread has its own execution stack and registers.',
  },
  {
    id: 'q4',
    unit: 2,
    question: 'If a counting semaphore is initialized to 5, and 8 consecutive wait() calls execute, how many processes are blocked?',
    options: ['0', '3', '5', '8'],
    correctIndex: 1,
    explanation: 'Semaphore value = 5 - 8 = -3. A negative value indicates that exactly 3 processes are blocked on the waiting queue.',
  },
  {
    id: 'q5',
    unit: 3,
    question: 'Which CPU scheduling algorithm is mathematically proven to produce the minimal average waiting time for stationary processes?',
    options: ['FCFS', 'Shortest Job First (SJF)', 'Round Robin', 'Multilevel Queue'],
    correctIndex: 1,
    explanation: 'Shortest Job First (SJF) is provably optimal for minimizing average waiting time by scheduling shorter jobs first.',
  },
  {
    id: 'q6',
    unit: 3,
    question: 'What is the Convoy Effect in CPU scheduling?',
    options: [
      'Short processes are delayed while waiting behind a long CPU-bound process in FCFS',
      'Memory thrashing due to high page faults',
      'Starvation of low-priority processes in Priority Scheduling',
      'Deadlock caused by circular resource waiting',
    ],
    correctIndex: 0,
    explanation: 'The Convoy Effect occurs in FCFS when many short, I/O-bound jobs wait for one large CPU-bound process to release the CPU.',
  },
  {
    id: 'q7',
    unit: 4,
    question: 'Which of the following is NOT one of Coffman’s four necessary conditions for deadlock?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Aging', 'Circular Wait'],
    correctIndex: 2,
    explanation: 'Aging is a scheduling technique to prevent starvation, not a condition for deadlock. The 4 conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
  },
  {
    id: 'q8',
    unit: 4,
    question: 'In the Banker’s Algorithm, what formula computes the Need matrix for process i and resource j?',
    options: ['Need = Max + Allocation', 'Need = Max - Allocation', 'Need = Allocation - Available', 'Need = Available - Max'],
    correctIndex: 1,
    explanation: 'Need[i][j] = Max[i][j] - Allocation[i][j], representing the remaining resources process i may request to complete.',
  },
  {
    id: 'q9',
    unit: 5,
    question: 'What is Belady’s Anomaly in virtual memory page replacement?',
    options: [
      'Allocating more physical page frames causes the total page fault count to increase under FIFO',
      'A page fault triggers a system reboot',
      'The TLB cache hit ratio drops to 0%',
      'External fragmentation exceeds 50%',
    ],
    correctIndex: 0,
    explanation: 'Belady\'s Anomaly is the phenomenon where adding more physical frames leads to an increased number of page faults under FIFO.',
  },
  {
    id: 'q10',
    unit: 5,
    question: 'If page size is 4 KB (2^12 bytes), how many bits of a 32-bit virtual address represent the page offset?',
    options: ['10 bits', '12 bits', '20 bits', '16 bits'],
    correctIndex: 1,
    explanation: 'Since 4 KB = 2^12 bytes, the lowest 12 bits represent the displacement (offset) within the page.',
  },
  {
    id: 'q11',
    unit: 6,
    question: 'Which disk scheduling algorithm services requests like an elevator, moving in one direction to the end and then reversing?',
    options: ['FCFS', 'SSTF', 'SCAN', 'C-LOOK'],
    correctIndex: 2,
    explanation: 'SCAN (the Elevator Algorithm) sweeps across disk cylinders in one direction, servicing requests, then reverses direction at the boundary.',
  },
  {
    id: 'q12',
    unit: 6,
    question: 'What technique enables large blocks of data to transfer between I/O controllers and RAM without continuous CPU intervention?',
    options: ['Polling', 'Direct Memory Access (DMA)', 'Spooling', 'Contiguous File Allocation'],
    correctIndex: 1,
    explanation: 'DMA controllers transfer bulk data blocks directly between peripheral controllers and system RAM over the bus.',
  },
];

export default function Quizzes() {
  const { recordQuizAttempt } = useLearningStore();
  const [selectedUnit, setSelectedUnit] = useState<number | 'ALL'>('ALL');
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 mins in timed mode
  const [timerActive, setTimerActive] = useState(false);

  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  const activeQuestions =
    selectedUnit === 'ALL'
      ? QUIZ_BANK
      : QUIZ_BANK.filter((q) => q.unit === selectedUnit);

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && isTimedMode && timeLeft > 0 && !submitted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isTimedMode, timeLeft, submitted]);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (submitted) return;
    setCurrentAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    if (isTimedMode && !timerActive) {
      setTimerActive(true);
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    activeQuestions.forEach((q) => {
      if (currentAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    const total = activeQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;

    setScoreResult({ score, total, percentage });
    setSubmitted(true);
    setTimerActive(false);

    recordQuizAttempt({
      quizId: `quiz-u${selectedUnit}`,
      title: selectedUnit === 'ALL' ? 'Comprehensive OS Mock Exam' : `Unit ${selectedUnit} Assessment`,
      unitId: `unit-${selectedUnit}`,
      score,
      totalQuestions: total,
      percentage,
      passed,
    });
  };

  const handleReset = () => {
    setCurrentAnswers({});
    setSubmitted(false);
    setScoreResult(null);
    setTimeLeft(300);
    setTimerActive(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle size={14} /> Evaluation & Knowledge Mastery
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Quizzes, Unit Tests & Mock Examinations
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Test your Operating Systems understanding with practice mode or timed examination conditions. Earn XP and track mastery across all 6 syllabus units.
        </p>

        {/* Filters & Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedUnit('ALL');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedUnit === 'ALL'
                  ? 'bg-cyan-500 text-[#080e1c]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Final Mock (All Units)
            </button>
            {[1, 2, 3, 4, 5, 6].map((u) => (
              <button
                key={u}
                onClick={() => {
                  setSelectedUnit(u);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedUnit === u
                    ? 'bg-cyan-500 text-[#080e1c]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                Unit {u}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsTimedMode(!isTimedMode);
                handleReset();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isTimedMode
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Clock size={13} />
              <span>{isTimedMode ? `Timed Mode (${formatTimer(timeLeft)})` : 'Practice Mode (Untimed)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Score Summary if Submitted */}
      {submitted && scoreResult && (
        <div
          className={`p-6 rounded-2xl border space-y-3 animate-in fade-in ${
            scoreResult.percentage >= 60
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award size={28} className={scoreResult.percentage >= 60 ? 'text-green-400' : 'text-red-400'} />
              <div>
                <h3 className="text-lg font-bold text-white">
                  Assessment Completed! Score: {scoreResult.score} / {scoreResult.total} ({scoreResult.percentage}%)
                </h3>
                <p className="text-xs text-slate-300">
                  {scoreResult.percentage >= 80
                    ? 'Outstanding performance! You have mastered these Operating Systems concepts.'
                    : scoreResult.percentage >= 60
                    ? 'Good job! You passed the assessment. Review explanations below for missed questions.'
                    : 'Passing score is 60%. Review the study notes and retake the assessment.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> Retake
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {activeQuestions.map((q, qIndex) => {
          const userChoice = currentAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-[#0d1526] border border-white/5 rounded-2xl p-5 space-y-3.5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1 block">
                    Unit {q.unit}
                  </span>
                  <h3 className="text-sm font-semibold text-white leading-normal">{q.question}</h3>
                </div>
              </div>

              <div className="space-y-2 pl-9">
                {q.options.map((opt, optIndex) => {
                  const isSelected = userChoice === optIndex;
                  let style = 'border-white/5 hover:border-cyan-500/30 text-slate-300 bg-white/[0.02]';

                  if (submitted) {
                    if (optIndex === q.correctIndex) {
                      style = 'border-green-500/50 bg-green-500/15 text-green-300 font-medium';
                    } else if (isSelected && !isCorrect) {
                      style = 'border-red-500/50 bg-red-500/15 text-red-300';
                    } else {
                      style = 'opacity-40 text-slate-500 border-white/5';
                    }
                  } else if (isSelected) {
                    style = 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-medium';
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectAnswer(q.id, optIndex)}
                      disabled={submitted}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${style}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIndex === q.correctIndex && (
                        <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle size={16} className="text-red-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="pl-9 pt-2">
                  <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-xs text-slate-300">
                    <strong className="text-cyan-400">Explanation:</strong> {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Bar */}
      {!submitted && (
        <div className="sticky bottom-4 p-4 rounded-2xl bg-[#080e1c]/95 backdrop-blur border border-white/10 shadow-2xl flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Answered {Object.keys(currentAnswers).length} of {activeQuestions.length} questions
          </span>

          <button
            onClick={handleQuizSubmit}
            disabled={Object.keys(currentAnswers).length === 0}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#080e1c] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            Submit Assessment <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
