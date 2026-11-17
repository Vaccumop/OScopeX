import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  GraduationCap,
  Compass,
  BookOpen,
  FileText,
  FlaskConical,
  Code2,
  Calculator,
  HelpCircle,
  ClipboardList,
  TrendingUp,
  Award,
  BarChart3,
  Scroll,
  BookMarked,
  Layers,
  Library,
  Info,
  ChevronLeft,
  ChevronRight,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils';

interface NavSection {
  title: string;
  items: {
    to: string;
    icon: LucideIcon;
    label: string;
    color: string;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'LEARNING',
    items: [
      { to: '/home', icon: Home, label: 'Home Dashboard', color: 'text-cyan-400' },
      { to: '/my-learning', icon: GraduationCap, label: 'My Learning', color: 'text-emerald-400' },
      { to: '/learning-paths', icon: Compass, label: 'Learning Paths', color: 'text-blue-400' },
      { to: '/courses', icon: BookOpen, label: 'Curriculum & Units', color: 'text-teal-400', badge: '6 Units' },
      { to: '/concepts', icon: Layers, label: 'Explore Concepts', color: 'text-violet-400' },
      { to: '/study-notes', icon: FileText, label: 'Study Notes & Revision', color: 'text-indigo-400' },
    ],
  },
  {
    title: 'PRACTICE',
    items: [
      { to: '/labs', icon: FlaskConical, label: 'Interactive Labs', color: 'text-cyan-300', badge: '10 Labs' },
      { to: '/coding-playground', icon: Code2, label: 'Coding Playground', color: 'text-green-400', badge: 'C/BASH' },
      { to: '/numerical-practice', icon: Calculator, label: 'Numerical Practice', color: 'text-amber-400' },
      { to: '/quizzes', icon: HelpCircle, label: 'Quizzes & Tests', color: 'text-red-400' },
      { to: '/assignments', icon: ClipboardList, label: 'Assignments', color: 'text-purple-400' },
    ],
  },
  {
    title: 'PERFORMANCE',
    items: [
      { to: '/progress', icon: TrendingUp, label: 'My Progress', color: 'text-emerald-400' },
      { to: '/achievements', icon: Award, label: 'Achievements', color: 'text-amber-400' },
      { to: '/analytics', icon: BarChart3, label: 'Learning Analytics', color: 'text-cyan-400' },
      { to: '/certificates', icon: Scroll, label: 'Certificates', color: 'text-blue-400' },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      { to: '/glossary', icon: BookMarked, label: 'OS Glossary', color: 'text-sky-400' },
      { to: '/formula-sheet', icon: FileText, label: 'Formula Sheet', color: 'text-violet-400' },
      { to: '/reference-library', icon: Library, label: 'Reference Library', color: 'text-slate-400' },
      { to: '/about', icon: Info, label: 'About OScopeX', color: 'text-slate-400' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-[#080e1c] border-r border-cyan-500/10 relative overflow-hidden flex-shrink-0 z-30 select-none"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 p-4 border-b border-cyan-500/10 min-h-[64px] bg-[#070b16]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-cyan-500/20">
          <Zap size={18} className="text-[#080e1c]" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5">
                OScope<span className="text-cyan-400">X</span>
              </div>
              <p className="text-[10px] text-cyan-400/80 font-medium tracking-tight truncate">
                OS Learning Platform
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-0.5">
            {!collapsed ? (
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </div>
            ) : (
              <div className="w-full h-px bg-white/5 my-2" />
            )}

            {section.items.map(({ to, icon: Icon, label, color, badge }) => {
              const isActive =
                location.pathname === to ||
                (to !== '/home' && to !== '/' && location.pathname.startsWith(to));

              return (
                <NavLink
                  key={to}
                  to={to}
                  title={collapsed ? label : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-all duration-150 group relative',
                    isActive
                      ? 'bg-cyan-500/15 text-white font-medium border border-cyan-500/20 shadow-sm shadow-cyan-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      'flex-shrink-0 transition-transform duration-150 group-hover:scale-110',
                      isActive ? color : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="flex-1 flex items-center justify-between overflow-hidden"
                      >
                        <span className="truncate">{label}</span>
                        {badge && (
                          <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                            {badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isActive && (
                    <motion.div
                      layoutId="active-nav-glow"
                      className="absolute left-0 w-1 h-5 bg-cyan-400 rounded-r"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-cyan-500/10 text-slate-500 hover:text-cyan-400 hover:bg-white/[0.02] transition-colors"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
