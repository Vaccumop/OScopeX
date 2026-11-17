import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FlaskConical,
  Award,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Code2,
  Calculator,
  HelpCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';
import { CURRICULUM, getAllLessons } from '@/data/curriculum';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { profile, getOverallCompletionPercentage, getUnitCompletionPercentage } = useLearningStore();

  const allLessons = getAllLessons();
  const overallPercent = getOverallCompletionPercentage();

  // Find the last completed lesson or recommended next
  const lastCompletedId = profile.completedLessonIds[profile.completedLessonIds.length - 1];
  const nextLesson = allLessons.find((l) => !profile.completedLessonIds.includes(l.id)) || allLessons[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Stats Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 p-6 sm:p-8 shadow-xl shadow-cyan-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              <Sparkles size={13} className="text-cyan-400" />
              Level {profile.level} · {profile.title}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-cyan-400">{profile.name}</span>!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Continue your journey towards mastering Operating Systems through visual simulations, structured lessons, and hands-on algorithms.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <CheckCircle2 size={12} className="text-green-400" /> Finished
              </div>
              <div className="text-lg font-bold text-white font-mono">
                {profile.completedLessonIds.length} <span className="text-xs text-slate-400">/{allLessons.length}</span>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Award size={12} className="text-cyan-400" /> Total XP
              </div>
              <div className="text-lg font-bold text-cyan-300 font-mono">{profile.xp}</div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Flame size={12} className="text-amber-400" /> Streak
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono">{profile.streakDays}d</div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <TrendingUp size={12} className="text-purple-400" /> Progress
              </div>
              <div className="text-lg font-bold text-purple-300 font-mono">{overallPercent}%</div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-4">
          <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(overallPercent, 3)}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
            {overallPercent}% Syllabus Completed
          </span>
        </div>
      </div>

      {/* Continue Learning & Recommended Next Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Next Lesson Card (2 cols) */}
        <div className="lg:col-span-2 bg-[#0d1526] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Recommended Next Lesson
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
              {nextLesson.difficulty} · ~{nextLesson.estimatedMinutes} min
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            {nextLesson.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            {nextLesson.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/learn/${nextLesson.slug}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs transition-all shadow-md shadow-cyan-500/15"
            >
              Start Lesson <ArrowRight size={14} />
            </button>

            {nextLesson.simUrl && (
              <button
                onClick={() => navigate(nextLesson.simUrl!)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all"
              >
                <FlaskConical size={14} className="text-cyan-400" />
                {nextLesson.simLabel || 'Open Simulator'}
              </button>
            )}

            <button
              onClick={() => navigate('/courses')}
              className="text-xs text-slate-400 hover:text-white px-3 py-2 transition-colors ml-auto"
            >
              View Full Syllabus →
            </button>
          </div>
        </div>

        {/* Quick Learning Mode Cards (1 col) */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" /> Quick Practice Hub
            </h3>
            <p className="text-xs text-slate-400 mb-4">Choose a learning format for today</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate('/labs')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <FlaskConical size={16} className="text-cyan-400" />
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-300">Interactive Labs</div>
                  <div className="text-[10px] text-slate-400">10 working OS simulators</div>
                </div>
              </div>
              <ArrowRight size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/coding-playground')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-green-500/10 border border-white/5 hover:border-green-500/20 text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Code2 size={16} className="text-green-400" />
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-green-300">Coding Playground</div>
                  <div className="text-[10px] text-slate-400">fork, pthreads, semaphores</div>
                </div>
              </div>
              <ArrowRight size={12} className="text-slate-500 group-hover:text-green-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/numerical-practice')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Calculator size={16} className="text-amber-400" />
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-amber-300">Numerical Practice</div>
                  <div className="text-[10px] text-slate-400">CPU & Banker's calculations</div>
                </div>
              </div>
              <ArrowRight size={12} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/quizzes')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle size={16} className="text-red-400" />
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-red-300">Quizzes & Tests</div>
                  <div className="text-[10px] text-slate-400">Unit assessments & mock exam</div>
                </div>
              </div>
              <ArrowRight size={12} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Six Units Curriculum Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">6-Unit Operating Systems Roadmap</h2>
            <p className="text-xs text-slate-400">Structured step-by-step path from first principles to advanced kernel topics</p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-medium"
          >
            Explore All Units <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM.map((unit) => {
            const unitPercent = getUnitCompletionPercentage(unit.id);
            const isCompleted = unitPercent === 100;
            const completedLessonsInUnit = unit.lessons.filter((l) => profile.completedLessonIds.includes(l.id)).length;

            return (
              <motion.div
                key={unit.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate('/courses')}
                className="bg-[#0d1526] border border-white/5 hover:border-cyan-500/20 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                      UNIT {unit.number}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {completedLessonsInUnit}/{unit.lessons.length} done
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {unit.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                    <span>Progress</span>
                    <span className={isCompleted ? 'text-green-400 font-bold' : 'text-slate-300'}>{unitPercent}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-400' : 'bg-cyan-400'}`}
                      style={{ width: `${unitPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
