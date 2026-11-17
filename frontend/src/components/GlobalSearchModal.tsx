import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, FlaskConical, HelpCircle, FileText, ChevronRight, X } from 'lucide-react';
import { getAllLessons } from '@/data/curriculum';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via event or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lessons = getAllLessons();
  const q = query.toLowerCase().trim();

  // Search categories
  const filteredLessons = q ? lessons.filter((l) => l.title.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q) || l.definition.toLowerCase().includes(q)) : lessons.slice(0, 4);

  const labs = [
    { name: 'CPU Scheduler Simulator', url: '/scheduling', desc: 'FCFS, SJF, SRTF, Round Robin, Priority, MLQ, MLFQ' },
    { name: 'Process Manager & PCB', url: '/processes', desc: 'PCB registers, lifecycle transitions, state diagram' },
    { name: 'Synchronization Lab', url: '/synchronization', desc: 'Producer-Consumer, Readers-Writers, Dining Philosophers' },
    { name: 'Deadlock & Banker’s Algorithm', url: '/deadlocks', desc: 'RAG cycle detection, safe sequence calculator' },
    { name: 'Virtual Memory & Address Translation', url: '/memory', desc: 'Page table, TLB, MMU pipeline, hit/miss metrics' },
    { name: 'Page Replacement Simulator', url: '/page-replacement', desc: 'FIFO, LRU, Optimal, Clock, Belady anomaly' },
    { name: 'IPC Lab', url: '/ipc', desc: 'Pipes, Message Queues, Shared Memory, Signals' },
    { name: 'I/O Buffering', url: '/io-buffer', desc: 'Single, Double, Circular ring buffer' },
    { name: 'Disk Scheduling', url: '/disk', desc: 'FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK' },
    { name: 'What-If Experimentation Lab', url: '/what-if', desc: 'Split-screen side-by-side benchmark comparison' },
  ].filter((l) => !q || l.name.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q));

  const quickLinks = [
    { name: 'Coding Playground', url: '/coding-playground', icon: FileText, tag: 'Practice' },
    { name: 'Numerical Practice', url: '/numerical-practice', icon: HelpCircle, tag: 'Practice' },
    { name: 'Quizzes & Assessments', url: '/quizzes', icon: HelpCircle, tag: 'Test' },
    { name: 'Formula Sheet', url: '/formula-sheet', icon: FileText, tag: 'Resource' },
    { name: 'OS Glossary', url: '/glossary', icon: BookOpen, tag: 'Resource' },
  ].filter((item) => !q || item.name.toLowerCase().includes(q));

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0c1322] border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#080d1a]">
          <Search size={18} className="text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, algorithms, labs, concepts, formulas (e.g. 'Banker', 'Paging', 'Round Robin')..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Labs */}
          {labs.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-cyan-400/80 uppercase px-2 mb-1.5 flex items-center gap-1.5">
                <FlaskConical size={12} /> Interactive Laboratories
              </div>
              <div className="space-y-1">
                {labs.map((lab) => (
                  <button
                    key={lab.url}
                    onClick={() => handleSelect(lab.url)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 text-left transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{lab.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-md">{lab.desc}</div>
                    </div>
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lessons */}
          {filteredLessons.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-green-400/80 uppercase px-2 mb-1.5 flex items-center gap-1.5">
                <BookOpen size={12} /> Course Lessons
              </div>
              <div className="space-y-1">
                {filteredLessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect(`/learn/${l.slug}`)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-green-500/10 border border-transparent hover:border-green-500/20 text-left transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-green-300 transition-colors">{l.title}</div>
                      <div className="text-xs text-slate-400 truncate max-w-md">{l.subtitle}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">{l.difficulty}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-purple-400/80 uppercase px-2 mb-1.5 flex items-center gap-1.5">
                <FileText size={12} /> Learning Tools & Resources
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((ql) => {
                  const Icon = ql.icon;
                  return (
                    <button
                      key={ql.url}
                      onClick={() => handleSelect(ql.url)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 text-left transition-all group"
                    >
                      <Icon size={14} className="text-purple-400" />
                      <span className="text-xs font-medium text-slate-200 group-hover:text-purple-300">{ql.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {labs.length === 0 && filteredLessons.length === 0 && quickLinks.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No results found for "<span className="text-white">{query}</span>". Try searching for "CPU", "Paging", "Deadlock", or "SJF".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#080d1a] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">Esc</kbd> to exit</span>
          <span className="text-cyan-400/80">OScopeX Learning Platform</span>
        </div>
      </div>
    </div>
  );
}
