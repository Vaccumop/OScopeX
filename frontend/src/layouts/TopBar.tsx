import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Flame,
  Award,
  FlaskConical,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';
import { useSimulationStore } from '@/simulation/store';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import DailyChallengeModal from '@/components/DailyChallengeModal';

export default function TopBar() {
  const navigate = useNavigate();
  const { profile } = useLearningStore();
  const { resetSimulation } = useSimulationStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dailyOpen, setDailyOpen] = useState(false);

  return (
    <>
      <header className="h-[64px] bg-[#080e1c] border-b border-cyan-500/10 flex items-center justify-between px-4 sm:px-6 gap-3 flex-shrink-0 z-20 select-none">
        {/* Left: Quick Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-xs text-slate-400 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="truncate">Search lessons, labs, concepts, formulas...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Student Profile Metrics & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <button
            onClick={() => setDailyOpen(true)}
            title="Click to solve today's challenge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-semibold transition-all group"
          >
            <Flame size={15} className="text-amber-400 group-hover:scale-125 transition-transform animate-pulse" />
            <span>{profile.streakDays}d Streak</span>
          </button>

          {/* XP & Level */}
          <div
            onClick={() => navigate('/progress')}
            title="View learning progress and level"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium cursor-pointer hover:bg-cyan-500/20 transition-all"
          >
            <Award size={15} className="text-cyan-400" />
            <span>
              Level {profile.level} <span className="text-slate-400 font-normal">({profile.xp} XP)</span>
            </span>
          </div>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Quick Labs Link */}
          <button
            onClick={() => navigate('/labs')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs transition-all shadow-md shadow-cyan-500/15"
          >
            <FlaskConical size={14} />
            <span className="hidden md:inline">Open</span> Labs
          </button>

          {/* Courses Link */}
          <button
            onClick={() => navigate('/courses')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all"
          >
            <BookOpen size={14} className="text-emerald-400" />
            <span>Curriculum</span>
          </button>

          {/* Reset Sim button */}
          <button
            onClick={() => {
              resetSimulation();
            }}
            title="Reset active simulation state"
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 hover:border-red-500/30 border border-transparent text-slate-400 hover:text-red-400 transition-all"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <DailyChallengeModal isOpen={dailyOpen} onClose={() => setDailyOpen(false)} />
    </>
  );
}
