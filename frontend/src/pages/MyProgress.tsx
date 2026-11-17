import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  Flame,
  ArrowRight,
  BarChart2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';
import { CURRICULUM, getAllLessons } from '@/data/curriculum';

export default function MyProgress() {
  const navigate = useNavigate();
  const { profile, getOverallCompletionPercentage, getUnitCompletionPercentage } = useLearningStore();

  const allLessons = getAllLessons();
  const overallPercent = getOverallCompletionPercentage();

  // Unit mastery stats
  const unitMastery = CURRICULUM.map((u) => {
    const percent = getUnitCompletionPercentage(u.id);
    return {
      unit: u,
      percent,
      status: percent === 100 ? 'Mastered' : percent > 0 ? 'In Progress' : 'Not Started',
    };
  });

  const weakUnits = unitMastery.filter((u) => u.percent < 60);
  const strongUnits = unitMastery.filter((u) => u.percent >= 60);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingUp size={14} /> Personal Learning Performance
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Student Progress & Topic Mastery
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Real-time tracking of syllabus coverage, topic mastery indicators, strengths, areas needing revision, and quiz analytics.
        </p>

        {/* Level Banner */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg text-[#080e1c] shadow-md shadow-cyan-500/20">
              {profile.level}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Level {profile.level} · {profile.title}
              </div>
              <div className="text-xs text-cyan-300 font-mono">
                {profile.xp} Total XP Points Earned
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/analytics')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all"
            >
              Detailed Analytics
            </button>
            <button
              onClick={() => navigate('/certificates')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs transition-all shadow-md"
            >
              Certificate Status
            </button>
          </div>
        </div>
      </div>

      {/* Unit Mastery Bars */}
      <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart2 size={18} className="text-cyan-400" /> Syllabus Unit Mastery Breakdown
        </h2>

        <div className="space-y-4">
          {unitMastery.map(({ unit, percent, status }) => (
            <div key={unit.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Unit {unit.number}: {unit.title}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full ${
                      status === 'Mastered'
                        ? 'bg-green-500/20 text-green-300'
                        : status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {status}
                  </span>
                  <span className="text-cyan-400 font-bold">{percent}%</span>
                </div>
              </div>

              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent === 100 ? 'bg-green-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Topics */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Strong Topics (Mastery &gt;= 60%)
          </h3>
          {strongUnits.length === 0 ? (
            <p className="text-xs text-slate-400">Complete lessons to establish your strong areas.</p>
          ) : (
            <ul className="space-y-2">
              {strongUnits.map((u) => (
                <li key={u.unit.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <span className="text-slate-200">{u.unit.title}</span>
                  <span className="text-green-400 font-mono font-bold">{u.percent}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Needs Revision */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={14} /> Recommended for Revision
          </h3>
          {weakUnits.length === 0 ? (
            <p className="text-xs text-green-400 font-semibold">🎉 All units mastered above 60%!</p>
          ) : (
            <ul className="space-y-2">
              {weakUnits.map((u) => (
                <li key={u.unit.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <span className="text-slate-200">{u.unit.title}</span>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Study Unit →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
