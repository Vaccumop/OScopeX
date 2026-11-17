import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { CURRICULUM, Unit, Lesson } from '@/data/curriculum';
import { useLearningStore } from '@/simulation/learningStore';

export default function Courses() {
  const navigate = useNavigate();
  const { profile, getUnitCompletionPercentage } = useLearningStore();
  const [expandedUnitId, setExpandedUnitId] = useState<string>('unit-1');

  const toggleExpand = (unitId: string) => {
    setExpandedUnitId((prev) => (prev === unitId ? '' : unitId));
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen size={14} /> Full Academic Curriculum
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Operating Systems Course & Units
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive curriculum structured across six foundational units. Master theory through practical examples, interactive diagrams, and live simulator experiments.
        </p>
      </div>

      {/* Unit Accordion List */}
      <div className="space-y-4">
        {CURRICULUM.map((unit: Unit) => {
          const isExpanded = expandedUnitId === unit.id;
          const unitPercent = getUnitCompletionPercentage(unit.id);
          const completedLessonsCount = unit.lessons.filter((l) => profile.completedLessonIds.includes(l.id)).length;

          return (
            <div
              key={unit.id}
              className="bg-[#0d1526] border border-white/5 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              {/* Unit Header Banner */}
              <div
                onClick={() => toggleExpand(unit.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm flex-shrink-0">
                    U{unit.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-cyan-400/80 uppercase font-semibold">
                        Unit {unit.number}
                      </span>
                      {unitPercent === 100 && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full bg-green-500/20 text-green-300 font-medium">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white">{unit.title}</h2>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{unit.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono text-slate-300 font-semibold">{unitPercent}%</div>
                    <div className="text-[10px] text-slate-400">
                      {completedLessonsCount}/{unit.lessons.length} lessons
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded Lessons List */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-3 bg-[#0a101f]">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pt-2">
                    Unit Lessons & Practical Demonstrations
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {unit.lessons.map((lesson: Lesson, idx: number) => {
                      const isCompleted = profile.completedLessonIds.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-cyan-500/20 transition-all gap-3 group"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5">
                              {isCompleted ? (
                                <CheckCircle2 size={18} className="text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] text-slate-400 font-mono">
                                  {idx + 1}
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                  {lesson.title}
                                </h3>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                                  {lesson.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{lesson.subtitle}</p>

                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock size={11} /> {lesson.estimatedMinutes} mins
                                </span>
                                {lesson.simLabel && (
                                  <span className="flex items-center gap-1 text-cyan-400/80">
                                    <FlaskConical size={11} /> {lesson.simLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                            {lesson.simUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(lesson.simUrl!);
                                }}
                                title="Open interactive simulator for this lesson"
                                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs font-medium flex items-center gap-1.5 transition-all"
                              >
                                <FlaskConical size={12} /> Lab
                              </button>
                            )}

                            <button
                              onClick={() => navigate(`/learn/${lesson.slug}`)}
                              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              {isCompleted ? 'Review' : 'Start'} <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
