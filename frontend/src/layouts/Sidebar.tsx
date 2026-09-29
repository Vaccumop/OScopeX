import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Cpu, Activity, Lock, AlertTriangle,
  HardDrive, Database, GitBranch, Layers, Disc,
  FlaskConical, BookOpen, History, ChevronLeft, ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', color: 'text-cyan-400' },
  { to: '/processes', icon: Activity, label: 'Process Manager', color: 'text-green-400' },
  { to: '/scheduling', icon: Cpu, label: 'CPU Scheduler', color: 'text-blue-400' },
  { to: '/synchronization', icon: Lock, label: 'Synchronization', color: 'text-purple-400' },
  { to: '/deadlocks', icon: AlertTriangle, label: 'Deadlocks', color: 'text-red-400' },
  { to: '/memory', icon: Database, label: 'Virtual Memory', color: 'text-violet-400' },
  { to: '/page-replacement', icon: Layers, label: 'Page Replacement', color: 'text-indigo-400' },
  { to: '/ipc', icon: GitBranch, label: 'IPC', color: 'text-teal-400' },
  { to: '/io-buffer', icon: HardDrive, label: 'I/O Buffer', color: 'text-orange-400' },
  { to: '/disk', icon: Disc, label: 'Disk Scheduler', color: 'text-amber-400' },
  { to: '/what-if', icon: FlaskConical, label: 'What-If Lab', color: 'text-cyan-300' },
  { to: '/experiments', icon: History, label: 'Experiments', color: 'text-slate-400' },
  { to: '/learn', icon: BookOpen, label: 'Learn OS', color: 'text-emerald-400' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-[#080e1c] border-r border-cyan-500/10 relative overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b border-cyan-500/10 min-h-[60px]">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-cyan-400" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <span className="font-bold text-white text-sm tracking-wide">OScopeX</span>
              <p className="text-[9px] text-cyan-400/60 leading-tight">OS Digital Twin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-150 group',
                isActive
                  ? 'bg-cyan-500/10 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <Icon
                size={16}
                className={cn('flex-shrink-0', isActive ? color : 'text-slate-500 group-hover:text-slate-400')}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="truncate font-medium text-xs"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-0.5 h-6 bg-cyan-400 rounded-r"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-cyan-500/10 text-slate-500 hover:text-cyan-400 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}
