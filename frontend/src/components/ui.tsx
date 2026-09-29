import React from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  glow?: boolean;
}

export function Card({ children, className, title, subtitle, actions, glow }: CardProps) {
  return (
    <div className={cn(
      'bg-[#0d1526] border border-white/5 rounded-xl overflow-hidden',
      glow && 'shadow-lg shadow-cyan-500/5',
      className
    )}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div>
            {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  sub?: string;
}

export function StatCard({ label, value, unit, color = 'text-cyan-400', icon, sub }: StatCardProps) {
  return (
    <div className="bg-[#0d1526] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">{label}</span>
        {icon && <div className="text-slate-600">{icon}</div>}
      </div>
      <div className="flex items-end gap-1">
        <span className={cn('text-2xl font-bold font-mono', color)}>{value}</span>
        {unit && <span className="text-slate-500 text-sm mb-0.5">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  size?: 'sm' | 'md';
}

const BADGE_VARIANTS = {
  default: 'bg-slate-500/20 text-slate-400',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-amber-500/20 text-amber-400',
  error: 'bg-red-500/20 text-red-400',
  info: 'bg-cyan-500/20 text-cyan-400',
  purple: 'bg-purple-500/20 text-purple-400',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      BADGE_VARIANTS[variant]
    )}>
      {children}
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

const BTN_VARIANTS = {
  primary: 'bg-cyan-500 text-[#0a0f1e] hover:bg-cyan-400 font-semibold',
  secondary: 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10',
  danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
  ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
};

const BTN_SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({ variant = 'secondary', size = 'md', icon, loading, children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        BTN_VARIANTS[variant],
        BTN_SIZES[size],
        className
      )}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-slate-400 font-medium">{label}</label>}
      <input
        {...props}
        className={cn(
          'w-full px-3 py-2 bg-white/5 border rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors',
          error ? 'border-red-500/50' : 'border-white/10',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-slate-400 font-medium">{label}</label>}
      <select
        {...props}
        className={cn(
          'w-full px-3 py-2 bg-[#111c35] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors',
          className
        )}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#111c35]">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({ value, max = 100, color = '#22d3ee', showLabel = false, height = 4 }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{value}</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full bg-white/5 rounded-full overflow-hidden" style={{ height }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <span className="text-2xl">📭</span>
      </div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">{title}</h3>
      <p className="text-xs text-slate-600 max-w-xs mb-6">{desc}</p>
      {action}
    </div>
  );
}

export function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1e2d55] border border-white/10 rounded text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        {content}
      </div>
    </div>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <div
      className="border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

export function ExplainBox({ title, what, why, concept, next }: {
  title?: string;
  what: string;
  why: string;
  concept: string;
  next: string;
}) {
  return (
    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-3">
      {title && <h4 className="text-sm font-semibold text-blue-300">{title}</h4>}
      <div>
        <p className="text-[10px] text-blue-400/60 uppercase font-semibold tracking-wider mb-1">What happened?</p>
        <p className="text-xs text-slate-300">{what}</p>
      </div>
      <div>
        <p className="text-[10px] text-blue-400/60 uppercase font-semibold tracking-wider mb-1">Why?</p>
        <p className="text-xs text-slate-300">{why}</p>
      </div>
      <div>
        <p className="text-[10px] text-blue-400/60 uppercase font-semibold tracking-wider mb-1">OS Concept</p>
        <p className="text-xs text-cyan-300 font-medium">{concept}</p>
      </div>
      <div>
        <p className="text-[10px] text-blue-400/60 uppercase font-semibold tracking-wider mb-1">What happens next?</p>
        <p className="text-xs text-slate-300">{next}</p>
      </div>
    </div>
  );
}
