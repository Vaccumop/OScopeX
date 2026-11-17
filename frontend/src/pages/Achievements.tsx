import React from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
  Activity,
  Database,
  Flame,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import { useLearningStore, ACHIEVEMENTS, Achievement } from '@/simulation/learningStore';

export default function Achievements() {
  const { profile } = useLearningStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Activity': return Activity;
      case 'Cpu': return Cpu;
      case 'ShieldAlert': return ShieldAlert;
      case 'Database': return Database;
      case 'Flame': return Flame;
      case 'Award': return Award;
      case 'GraduationCap': return GraduationCap;
      default: return Award;
    }
  };

  const unlockedCount = profile.unlockedAchievements.length;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Award size={14} /> Milestones & Badges
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Learning Achievements & Honors
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Earn recognition for mastering difficult Operating Systems concepts, solving synchronization challenges, maintaining study streaks, and acing assessments.
        </p>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-6">
          <div>
            <div className="text-xs text-slate-400">Unlocked Badges</div>
            <div className="text-xl font-bold text-white font-mono">
              {unlockedCount} / {ACHIEVEMENTS.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Achievement XP</div>
            <div className="text-xl font-bold text-amber-300 font-mono">
              {ACHIEVEMENTS.filter((a) => profile.unlockedAchievements.includes(a.id)).reduce((acc, a) => acc + a.xpReward, 0)} XP
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((ach: Achievement) => {
          const isUnlocked = profile.unlockedAchievements.includes(ach.id);
          const Icon = getIcon(ach.icon);

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                isUnlocked
                  ? 'bg-[#0d1526] border-cyan-500/30 shadow-md shadow-cyan-500/5'
                  : 'bg-[#0a0f1d] border-white/5 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border-amber-400/30 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}
              >
                {isUnlocked ? <Icon size={24} /> : <Lock size={20} />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {ach.title}
                    {isUnlocked && <CheckCircle2 size={14} className="text-green-400" />}
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10">
                    +{ach.xpReward} XP
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {ach.description}
                </p>
                <div className="text-[10px] text-slate-500 pt-1 font-mono uppercase">
                  Category: {ach.category} {isUnlocked ? '· Unlocked' : '· Locked'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
