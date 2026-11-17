import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  Calendar,
  CheckCircle2,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useLearningStore } from '@/simulation/learningStore';
import { CURRICULUM } from '@/data/curriculum';

export default function LearningAnalytics() {
  const { profile, getUnitCompletionPercentage } = useLearningStore();

  // Unit completion chart data
  const unitData = CURRICULUM.map((u) => ({
    name: `U${u.number}`,
    fullName: u.title,
    completion: getUnitCompletionPercentage(u.id),
  }));

  // Weekly study activity trend mock/calculated data
  const activityData = [
    { day: 'Mon', minutes: 35, xp: 120 },
    { day: 'Tue', minutes: 45, xp: 180 },
    { day: 'Wed', minutes: 20, xp: 90 },
    { day: 'Thu', minutes: 60, xp: 250 },
    { day: 'Fri', minutes: 50, xp: 210 },
    { day: 'Sat', minutes: 80, xp: 340 },
    { day: 'Sun', minutes: 65, xp: 280 },
  ];

  // Learning Format Breakdown
  const formatData = [
    { name: 'Lessons', value: 45, color: '#22d3ee' },
    { name: 'Simulators', value: 30, color: '#3b82f6' },
    { name: 'Quizzes', value: 15, color: '#a855f7' },
    { name: 'Numericals', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BarChart3 size={14} /> Telemetry & Study Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Personal Learning Analytics
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Quantitative metrics tracking your weekly study hours, assessment scores, algorithm simulation frequency, and topic completion trends.
        </p>

        {/* Quick KPI row */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-slate-400">Total Study Time</div>
            <div className="text-lg font-bold text-white font-mono">5.8 Hours</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Current Level</div>
            <div className="text-lg font-bold text-cyan-300 font-mono">Level {profile.level}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Quiz Success Rate</div>
            <div className="text-lg font-bold text-green-400 font-mono">84.2%</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Active Streak</div>
            <div className="text-lg font-bold text-amber-300 font-mono">{profile.streakDays} Days</div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Completion Bar Chart */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Unit Completion (%)</h3>
            <span className="text-[10px] text-slate-400 font-mono">Units 1 - 6</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070b16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="completion" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Line Chart */}
        <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daily Study Activity (Minutes)</h3>
            <span className="text-[10px] text-slate-400 font-mono">Last 7 Days</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070b16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="minutes" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4, fill: '#0284c7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Learning Format Breakdown */}
      <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Study Modality Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {formatData.map((f) => (
            <div key={f.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="text-xs text-slate-400">{f.name}</div>
              <div className="text-xl font-bold font-mono" style={{ color: f.color }}>
                {f.value}%
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${f.value}%`, backgroundColor: f.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
