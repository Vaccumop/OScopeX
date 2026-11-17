import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Clock,
  Sparkles,
  FlaskConical,
  Award,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  XCircle,
  Share2,
} from 'lucide-react';
import { getLessonById, getNextLesson, getPrevLesson, getUnitById } from '@/data/curriculum';
import { useLearningStore } from '@/simulation/learningStore';

export default function LessonView() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const { profile, completeLesson, toggleBookmark, addXP } = useLearningStore();

  const lesson = getLessonById(topic || '');
  const [activeTab, setActiveTab] = useState<'content' | 'visual' | 'quiz'>('content');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedNotification, setCompletedNotification] = useState(false);

  if (!lesson) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Lesson not found</h2>
        <p className="text-sm text-slate-400">The lesson you requested does not exist or has moved.</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-[#080e1c] font-bold text-xs"
        >
          Back to Curriculum
        </button>
      </div>
    );
  }

  const unit = getUnitById(lesson.unitId);
  const next = getNextLesson(lesson.id);
  const prev = getPrevLesson(lesson.id);
  const isCompleted = profile.completedLessonIds.includes(lesson.id);
  const isBookmarked = profile.bookmarkedLessonIds.includes(lesson.id);

  const handleMarkComplete = () => {
    completeLesson(lesson.id);
    setCompletedNotification(true);
    setTimeout(() => setCompletedNotification(false), 3000);
  };

  const handleQuizAnswer = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    // Calculate correct
    let correctCount = 0;
    lesson.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    if (correctCount === lesson.questions.length && !isCompleted) {
      handleMarkComplete();
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Courses
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBookmark(lesson.id)}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this lesson'}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {lesson.simUrl && (
            <button
              onClick={() => navigate(lesson.simUrl!)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FlaskConical size={14} /> Launch Simulator
            </button>
          )}
        </div>
      </div>

      {/* Lesson Hero Banner */}
      <div className="bg-[#0d1526] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>{unit ? `UNIT ${unit.number}: ${unit.title}` : 'Operating Systems'}</span>
          <span>·</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock size={11} /> {lesson.estimatedMinutes} mins
          </span>
          <span>·</span>
          <span className="text-slate-400">{lesson.difficulty}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {lesson.subtitle}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pt-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'content' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Concept & Theory
            {activeTab === 'content' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'visual' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Diagram & Example
            {activeTab === 'visual' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'quiz' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Knowledge Check ({lesson.questions.length})
            {activeTab === 'quiz' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Tabs */}
      {activeTab === 'content' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* A. Learning Objectives */}
          <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <Sparkles size={14} /> Learning Objectives
            </h3>
            <ul className="space-y-2">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* B. Core Definition */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
              Formal Definition
            </h3>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {lesson.definition}
            </p>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-400" /> Deep-Dive Explanation
            </h3>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {lesson.detailedExplanation}
            </div>
          </div>

          {/* Why Needed & How It Works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb size={14} /> Why Is It Needed?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{lesson.whyNeeded}</p>
            </div>

            <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={14} /> How It Works Internally
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{lesson.howItWorks}</p>
            </div>
          </div>

          {/* Real-World Analogy */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Lightbulb size={14} /> Real-World Analogy
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed italic">
              "{lesson.analogy}"
            </p>
          </div>

          {/* Practical Applications */}
          <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Practical Real-World Systems & Engineering Applications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {lesson.applications.map((app, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                  {app}
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes & Exam Pitfalls */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Common Mistakes & Examination Pitfalls
            </h3>
            <ul className="space-y-2">
              {lesson.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-red-200/90 leading-relaxed">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Revision Notes */}
          <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Quick Revision Bullet Points
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.quickRevision.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                  <span className="text-green-400 font-bold">✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visual Tab */}
      {activeTab === 'visual' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Worked Example */}
          {lesson.workedExample && (
            <div className="bg-[#0d1526] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers size={16} className="text-cyan-400" /> {lesson.workedExample.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{lesson.workedExample.description}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                  Worked Trace
                </span>
              </div>

              <div className="space-y-2.5">
                {lesson.workedExample.steps.map((st) => (
                  <div
                    key={st.step}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
                        {st.step}
                      </span>
                      <span className="font-semibold text-slate-200">{st.action}</span>
                    </div>
                    <div className="text-cyan-300/90 font-mono text-[11px] sm:text-right pl-8 sm:pl-0">
                      → {st.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Lab Link */}
          {lesson.simUrl && (
            <div className="bg-gradient-to-r from-[#0e1d3d] to-[#0a1429] border border-cyan-500/30 rounded-2xl p-6 text-center space-y-3 shadow-lg shadow-cyan-500/5">
              <FlaskConical size={32} className="text-cyan-400 mx-auto" />
              <h3 className="text-base font-bold text-white">
                Ready to experiment with {lesson.title}?
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Step through algorithms event-by-event with customizable inputs in the dedicated interactive laboratory.
              </p>
              <button
                onClick={() => navigate(lesson.simUrl!)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                {lesson.simLabel || 'Open Interactive Lab'} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Knowledge Check</h3>
            <p className="text-xs text-slate-400 mb-6">
              Test your understanding of {lesson.title}. Answer all questions and submit to earn XP!
            </p>

            <div className="space-y-6">
              {lesson.questions.map((q, qIdx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-white/5 text-slate-400 font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200 leading-normal">
                        {q.question}
                      </h4>
                    </div>

                    <div className="space-y-1.5 pl-7">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let optionStyle = 'border-white/5 hover:border-cyan-500/30 hover:bg-white/5 text-slate-300';

                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'border-green-500/50 bg-green-500/15 text-green-300 font-medium';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'border-red-500/50 bg-red-500/15 text-red-300';
                          } else {
                            optionStyle = 'border-white/5 opacity-50 text-slate-500';
                          }
                        } else if (isSelected) {
                          optionStyle = 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(q.id, optIdx)}
                            disabled={quizSubmitted}
                            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition-all ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctIndex && (
                              <CheckCircle2 size={14} className="text-green-400" />
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <XCircle size={14} className="text-red-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pl-7 pt-1 text-[11px] text-slate-400 bg-white/[0.01] p-2 rounded">
                        <strong className="text-cyan-400">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400">
                {Object.keys(selectedAnswers).length}/{lesson.questions.length} answered
              </span>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < lesson.questions.length}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#080e1c] font-bold text-xs transition-all shadow-md shadow-cyan-500/15"
                >
                  Submit & Check Answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completion & Next / Prev Footer */}
      <div className="bg-[#080e1c] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {isCompleted ? (
            <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
              <CheckCircle2 size={16} /> Lesson Completed (+100 XP awarded)
            </div>
          ) : (
            <button
              onClick={handleMarkComplete}
              className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-[#080e1c] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-green-500/15"
            >
              <CheckCircle2 size={14} /> Mark Lesson as Completed (+100 XP)
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {prev && (
            <button
              onClick={() => navigate(`/learn/${prev.slug}`)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft size={12} /> Previous Lesson
            </button>
          )}

          {next && (
            <button
              onClick={() => navigate(`/learn/${next.slug}`)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/15"
            >
              Next Lesson <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
