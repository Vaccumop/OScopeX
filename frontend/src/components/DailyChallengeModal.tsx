import React, { useState } from 'react';
import { Flame, CheckCircle2, XCircle, Award, X } from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAILY_QUESTIONS = [
  {
    question: 'A system with 3 processes sharing 4 identical tape drive resources. Each process needs at most 2 tape drives. Can a deadlock occur?',
    options: [
      'Yes, if all 3 request 2 tape drives simultaneously',
      'No, because the total maximum demand (6) minus available (4) is less than the process count',
      'No, deadlock is impossible because with 3 processes and 4 resources, by Pigeonhole Principle at least one process gets 2 drives and completes',
      'Yes, if round robin scheduling is enabled',
    ],
    correctIndex: 2,
    explanation: 'Condition for guaranteed deadlock-free execution: Total Resources >= sum of max needs - (n - 1). Here: 4 >= (2+2+2) - (3-1) = 6 - 2 = 4. Thus at least one process will always be able to obtain its maximum 2 drives, complete, and release them!',
  },
  {
    question: 'In paging with an 8 KB page size on a 32-bit architecture, how many total pages exist in a process virtual address space?',
    options: ['262,144 pages (2^18)', '524,288 pages (2^19)', '1,048,576 pages (2^20)', '65,536 pages (2^16)'],
    correctIndex: 1,
    explanation: '8 KB = 2^13 bytes (offset = 13 bits). Total address space = 32 bits. Page number bits = 32 - 13 = 19 bits, meaning 2^19 = 524,288 pages.',
  },
  {
    question: 'Under what specific condition does the First-In, First-Out (FIFO) page replacement algorithm exhibit Belady’s Anomaly?',
    options: [
      'When all frames are marked dirty',
      'When adding more physical page frames causes the total number of page faults to increase for certain reference strings',
      'When the TLB cache hit ratio exceeds 99%',
      'When the processor switches from User Mode to Kernel Mode',
    ],
    correctIndex: 1,
    explanation: 'Belady\'s Anomaly is the phenomenon in FIFO where increasing the allocated frame count results in more page faults for specific reference sequences (such as 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5).',
  },
];

export default function DailyChallengeModal({ isOpen, onClose }: DailyChallengeModalProps) {
  const { profile, completeDailyChallenge } = useLearningStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Pick question deterministically based on day of year
  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_QUESTIONS.length;
  const currentQ = DAILY_QUESTIONS[dayIndex];
  const today = new Date().toISOString().split('T')[0];
  const alreadyCompleted = profile.dailyChallengeCompletedDate === today;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    if (selectedOption === currentQ.correctIndex && !alreadyCompleted) {
      completeDailyChallenge();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0d1526] border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#080e1c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Daily OS Challenge <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">+150 XP</span>
              </h3>
              <p className="text-xs text-slate-400">Solve daily to maintain your learning streak</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="text-sm font-medium text-slate-200 leading-relaxed bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'border-white/10 hover:border-cyan-500/30 hover:bg-white/5 text-slate-300';

              if (submitted) {
                if (isCorrect) {
                  btnStyle = 'border-green-500/50 bg-green-500/15 text-green-300';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-red-500/50 bg-red-500/15 text-red-300';
                } else {
                  btnStyle = 'border-white/5 opacity-50 text-slate-500';
                }
              } else if (isSelected) {
                btnStyle = 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !submitted && setSelectedOption(idx)}
                  disabled={submitted}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center flex-shrink-0 font-bold mt-0.5 text-[10px]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-normal">{opt}</span>
                  {submitted && isCorrect && <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {submitted && (
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs space-y-1 animate-in fade-in">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <Award size={14} /> Explanation:
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {alreadyCompleted && (
            <div className="text-center text-xs text-amber-400 font-medium py-1">
              🎉 You have already completed today's challenge! Streak active: {profile.streakDays} days.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#080e1c] border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500">Streak: <strong className="text-amber-400">{profile.streakDays} Days</strong></span>
          <div className="flex gap-2">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#080e1c] font-bold text-xs transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
