// ============================================================
// Student Learning & Progress Store (Persistent with LocalStorage)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAllLessons } from '@/data/curriculum';

export interface QuizAttempt {
  id: string;
  quizId: string;
  title: string;
  unitId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'lesson' | 'quiz' | 'simulator' | 'streak' | 'mastery';
  xpReward: number;
}

export interface StudentProfile {
  name: string;
  title: string;
  avatarSeed: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  notes: Record<string, string>; // lessonId -> note text
  quizAttempts: QuizAttempt[];
  unlockedAchievements: string[]; // achievement IDs
  dailyChallengeCompletedDate?: string;
  certificateIssuedDate?: string;
  certificateId?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'Kernel Cadet',
    description: 'Complete your first Operating Systems lesson.',
    icon: 'Sparkles',
    category: 'lesson',
    xpReward: 100,
  },
  {
    id: 'process-master',
    title: 'Process Pioneer',
    description: 'Complete all lessons in Unit 2: Process Management.',
    icon: 'Activity',
    category: 'mastery',
    xpReward: 250,
  },
  {
    id: 'scheduler-pro',
    title: 'Scheduler Master',
    description: 'Run CPU scheduling simulations across 3 different algorithms.',
    icon: 'Cpu',
    category: 'simulator',
    xpReward: 200,
  },
  {
    id: 'deadlock-detective',
    title: 'Deadlock Detective',
    description: 'Solve a Banker\'s Algorithm safety problem with a valid safe sequence.',
    icon: 'ShieldAlert',
    category: 'quiz',
    xpReward: 300,
  },
  {
    id: 'memory-architect',
    title: 'Memory Architect',
    description: 'Complete all lessons in Unit 5: Memory Management & Paging.',
    icon: 'Database',
    category: 'mastery',
    xpReward: 350,
  },
  {
    id: 'streak-3',
    title: 'Habitual Hacker',
    description: 'Maintain a 3-day active learning streak.',
    icon: 'Flame',
    category: 'streak',
    xpReward: 200,
  },
  {
    id: 'quiz-ace',
    title: 'Distinction Scholar',
    description: 'Score 100% on any Unit Assessment quiz.',
    icon: 'Award',
    category: 'quiz',
    xpReward: 300,
  },
  {
    id: 'os-graduate',
    title: 'OScopeX Graduate',
    description: 'Complete all 6 units and generate your verified certificate.',
    icon: 'GraduationCap',
    category: 'mastery',
    xpReward: 1000,
  },
];

interface LearningStore {
  profile: StudentProfile;
  completeLesson: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  saveLessonNote: (lessonId: string, note: string) => void;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => void;
  addXP: (amount: number) => void;
  completeDailyChallenge: () => void;
  checkAndUpdateStreak: () => void;
  generateCertificate: (studentName: string) => string;
  updateProfileName: (name: string) => void;
  resetProgress: () => void;
  getUnitCompletionPercentage: (unitId: string) => number;
  getOverallCompletionPercentage: () => number;
}

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Operating Systems Student',
  title: 'Kernel Cadet',
  avatarSeed: 'os-explorer',
  xp: 150,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: ['u1-l1'], // Pre-completed first lesson for smooth onboarding
  bookmarkedLessonIds: ['u3-l2'],
  notes: {},
  quizAttempts: [],
  unlockedAchievements: ['first-step'],
};

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,

      completeLesson: (lessonId: string) => {
        set((state) => {
          if (state.profile.completedLessonIds.includes(lessonId)) {
            return state;
          }

          const newCompleted = [...state.profile.completedLessonIds, lessonId];
          const newXP = state.profile.xp + 100;
          const newLevel = Math.floor(newXP / 400) + 1;

          // Check for achievements
          const unlocked = [...state.profile.unlockedAchievements];
          if (!unlocked.includes('first-step')) {
            unlocked.push('first-step');
          }

          // Check if Unit 2 complete
          const allLessons = getAllLessons();
          const u2Lessons = allLessons.filter((l) => l.unitId === 'unit-2').map((l) => l.id);
          if (u2Lessons.length > 0 && u2Lessons.every((id) => newCompleted.includes(id)) && !unlocked.includes('process-master')) {
            unlocked.push('process-master');
          }

          // Check if Unit 5 complete
          const u5Lessons = allLessons.filter((l) => l.unitId === 'unit-5').map((l) => l.id);
          if (u5Lessons.length > 0 && u5Lessons.every((id) => newCompleted.includes(id)) && !unlocked.includes('memory-architect')) {
            unlocked.push('memory-architect');
          }

          return {
            profile: {
              ...state.profile,
              completedLessonIds: newCompleted,
              xp: newXP,
              level: newLevel,
              unlockedAchievements: unlocked,
            },
          };
        });
      },

      toggleBookmark: (lessonId: string) => {
        set((state) => {
          const bookmarks = state.profile.bookmarkedLessonIds;
          const exists = bookmarks.includes(lessonId);
          return {
            profile: {
              ...state.profile,
              bookmarkedLessonIds: exists ? bookmarks.filter((id) => id !== lessonId) : [...bookmarks, lessonId],
            },
          };
        });
      },

      saveLessonNote: (lessonId: string, note: string) => {
        set((state) => ({
          profile: {
            ...state.profile,
            notes: {
              ...state.profile.notes,
              [lessonId]: note,
            },
          },
        }));
      },

      recordQuizAttempt: (attempt) => {
        const id = 'qa-' + Math.random().toString(36).substring(2, 9);
        const timestamp = new Date().toISOString();
        const fullAttempt: QuizAttempt = { ...attempt, id, timestamp };

        set((state) => {
          const xpGained = attempt.score * 30 + (attempt.passed ? 100 : 20);
          const newXP = state.profile.xp + xpGained;
          const newLevel = Math.floor(newXP / 400) + 1;

          const unlocked = [...state.profile.unlockedAchievements];
          if (attempt.percentage === 100 && !unlocked.includes('quiz-ace')) {
            unlocked.push('quiz-ace');
          }

          return {
            profile: {
              ...state.profile,
              xp: newXP,
              level: newLevel,
              quizAttempts: [fullAttempt, ...state.profile.quizAttempts],
              unlockedAchievements: unlocked,
            },
          };
        });
      },

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.profile.xp + amount;
          const newLevel = Math.floor(newXP / 400) + 1;
          return {
            profile: {
              ...state.profile,
              xp: newXP,
              level: newLevel,
            },
          };
        });
      },

      completeDailyChallenge: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          if (state.profile.dailyChallengeCompletedDate === today) return state;
          const newXP = state.profile.xp + 150;
          return {
            profile: {
              ...state.profile,
              dailyChallengeCompletedDate: today,
              xp: newXP,
              level: Math.floor(newXP / 400) + 1,
            },
          };
        });
      },

      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const lastDate = state.profile.lastActiveDate;
          if (lastDate === today) return state;

          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          let newStreak = state.profile.streakDays;

          if (lastDate === yesterday) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }

          const unlocked = [...state.profile.unlockedAchievements];
          if (newStreak >= 3 && !unlocked.includes('streak-3')) {
            unlocked.push('streak-3');
          }

          return {
            profile: {
              ...state.profile,
              lastActiveDate: today,
              streakDays: newStreak,
              unlockedAchievements: unlocked,
            },
          };
        });
      },

      generateCertificate: (studentName: string) => {
        const certId = 'OSX-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
        const issuedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        set((state) => ({
          profile: {
            ...state.profile,
            name: studentName,
            certificateId: certId,
            certificateIssuedDate: issuedDate,
            unlockedAchievements: state.profile.unlockedAchievements.includes('os-graduate')
              ? state.profile.unlockedAchievements
              : [...state.profile.unlockedAchievements, 'os-graduate'],
          },
        }));

        return certId;
      },

      updateProfileName: (name: string) => {
        set((state) => ({
          profile: { ...state.profile, name },
        }));
      },

      resetProgress: () => {
        set({ profile: DEFAULT_PROFILE });
      },

      getUnitCompletionPercentage: (unitId: string) => {
        const allLessons = getAllLessons();
        const unitLessons = allLessons.filter((l) => l.unitId === unitId);
        if (unitLessons.length === 0) return 0;
        const completedCount = unitLessons.filter((l) => get().profile.completedLessonIds.includes(l.id)).length;
        return Math.round((completedCount / unitLessons.length) * 100);
      },

      getOverallCompletionPercentage: () => {
        const allLessons = getAllLessons();
        if (allLessons.length === 0) return 0;
        const completedCount = allLessons.filter((l) => get().profile.completedLessonIds.includes(l.id)).length;
        return Math.round((completedCount / allLessons.length) * 100);
      },
    }),
    {
      name: 'oscopex-learning-store',
    }
  )
);
