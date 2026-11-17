import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  FlaskConical,
  Flame,
  Award,
} from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';
import { getAllLessons, CURRICULUM } from '@/data/curriculum';

export default function MyLearning() {
  const navigate = useNavigate();
  const { profile, getOverallCompletionPercentage } = useLearningStore();

  const allLessons = getAllLessons();
  const completedLessons = allLessons.filter((l) => profile.completedLessonIds.includes(l.id));
  const bookmarkedLessons = allLessons.filter((l) => profile.bookmarkedLessonIds.includes(l.id));
  const overallPercent = getOverallCompletionPercentage();

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap size={14} /> Personal Learning Center
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          My Learning & Course Progress
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Track completed units, review saved bookmarks, check active streaks, and continue your progress towards graduation.
        </p>

        {/* Progress Snapshot */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-400">Completed</div>
              <div className="text-lg font-bold text-white font-mono">
                {completedLessons.length} / {allLessons.length} lessons
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Total XP</div>
              <div className="text-lg font-bold text-cyan-300 font-mono">{profile.xp} XP</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Streak</div>
              <div className="text-lg font-bold text-amber-300 font-mono flex items-center gap-1">
                <Flame size={16} /> {profile.streakDays} Days
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/certificates')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs transition-all shadow-md"
          >
            View Certificate Progress →
          </button>
        </div>
      </div>

      {/* Bookmarked Lessons Section */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Bookmark size={18} className="text-amber-400" /> Bookmarked Lessons ({bookmarkedLessons.length})
        </h2>

        {bookmarkedLessons.length === 0 ? (
          <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No bookmarks saved yet. Click the bookmark icon inside any lesson to save it for quick revision.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedLessons.map((l) => (
              <div
                key={l.id}
                onClick={() => navigate(`/learn/${l.slug}`)}
                className="bg-[#0d1526] border border-white/5 hover:border-cyan-500/20 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 mb-2 inline-block">
                    {l.difficulty}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {l.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{l.subtitle}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1"><Clock size={11} /> {l.estimatedMinutes} mins</span>
                  <span className="text-cyan-400 text-xs font-semibold flex items-center gap-1">
                    Study Now <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Lessons History */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-400" /> Completed Lessons ({completedLessons.length})
        </h2>

        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-4 divide-y divide-white/5">
          {completedLessons.map((l) => (
            <div
              key={l.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-white">{l.title}</h4>
                  <p className="text-[11px] text-slate-400">{l.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/learn/${l.slug}`)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1 transition-all"
              >
                Review <ArrowRight size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
