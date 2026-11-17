import React, { useState } from 'react';
import {
  Scroll,
  Award,
  CheckCircle2,
  Printer,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useLearningStore } from '@/simulation/learningStore';
import { CURRICULUM } from '@/data/curriculum';

export default function Certificates() {
  const { profile, getOverallCompletionPercentage, generateCertificate, updateProfileName } = useLearningStore();
  const overallPercent = getOverallCompletionPercentage();

  const [studentName, setStudentName] = useState(profile.name || 'Student Name');
  const [issuedCertId, setIssuedCertId] = useState(profile.certificateId || '');

  const handleIssueCertificate = () => {
    updateProfileName(studentName);
    const newId = generateCertificate(studentName);
    setIssuedCertId(newId);
  };

  const handlePrint = () => {
    window.print();
  };

  const issueDate = profile.certificateIssuedDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 no-print">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Scroll size={14} /> Course Graduation & Verification
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          OScopeX Course Completion Certificate
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Verify your mastery of all six foundational Operating Systems units. Enter your name and generate an official verifiable certificate with a unique platform hash identifier.
        </p>

        {/* Input & Generator Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-auto flex-1">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your full name for the certificate..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>

          <button
            onClick={handleIssueCertificate}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080e1c] font-bold text-xs transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap"
          >
            Generate / Update Certificate
          </button>

          {issuedCertId && (
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          )}
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0b1224] to-[#070c18] border-4 border-cyan-500/30 shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Subtle Watermark & Corner Accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
            <Zap size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white">OScopeX</span>
        </div>

        <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold font-mono">
          Certificate of Completion & Technical Mastery
        </div>

        <p className="text-xs text-slate-400 uppercase tracking-widest">
          This is to officially certify that
        </p>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 font-serif tracking-wide py-1">
          {studentName}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          has successfully studied, simulated, and demonstrated academic proficiency across the complete Operating Systems curriculum:
        </p>

        {/* Covered Modules Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto text-[11px] font-mono text-cyan-300">
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">Unit 1: System Calls & OS</div>
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">Unit 2: Processes & Threads</div>
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">Unit 3: CPU Scheduling</div>
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">Unit 4: Deadlock & Banker’s</div>
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">Unit 5: Virtual Memory & TLB</div>
          <div className="p-1.5 rounded-lg bg-white/[0.03] border border-cyan-500/20">Unit 6: Disk & I/O Buffering</div>
        </div>

        {/* Verification Footer */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-xs font-mono text-slate-400">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Issued Date</div>
            <div className="text-slate-300 font-semibold">{issueDate}</div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Certificate Verification ID</div>
            <div className="text-cyan-400 font-bold">{issuedCertId || 'OSX-PREVIEW-2026'}</div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 pt-2 italic">
          Platform-issued educational achievement certificate by OScopeX Interactive Operating Systems Platform.
        </div>
      </div>
    </div>
  );
}
