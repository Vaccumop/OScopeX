import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/layouts/AppShell';

// Learning Platform Pages
import LandingPage from '@/pages/LandingPage';
import HomeDashboard from '@/pages/HomeDashboard';
import MyLearning from '@/pages/MyLearning';
import LearningPaths from '@/pages/LearningPaths';
import Courses from '@/pages/Courses';
import LessonView from '@/pages/LessonView';
import ExploreConcepts from '@/pages/ExploreConcepts';
import StudyNotes from '@/pages/StudyNotes';
import InteractiveLabs from '@/pages/InteractiveLabs';
import CodingPlayground from '@/pages/CodingPlayground';
import NumericalPractice from '@/pages/NumericalPractice';
import Quizzes from '@/pages/Quizzes';
import Assignments from '@/pages/Assignments';
import MyProgress from '@/pages/MyProgress';
import Achievements from '@/pages/Achievements';
import LearningAnalytics from '@/pages/LearningAnalytics';
import Certificates from '@/pages/Certificates';
import OSGlossary from '@/pages/OSGlossary';
import FormulaSheet from '@/pages/FormulaSheet';
import ReferenceLibrary from '@/pages/ReferenceLibrary';
import AboutPlatform from '@/pages/AboutPlatform';

// Preserved Digital Twin & Simulator Laboratories
import Dashboard from '@/pages/Dashboard';
import ProcessManager from '@/pages/ProcessManager';
import CPUScheduler from '@/pages/CPUScheduler';
import Synchronization from '@/pages/Synchronization';
import Deadlocks from '@/pages/Deadlocks';
import VirtualMemory from '@/pages/VirtualMemory';
import PageReplacement from '@/pages/PageReplacement';
import IPC from '@/pages/IPC';
import IOBuffer from '@/pages/IOBuffer';
import DiskScheduler from '@/pages/DiskScheduler';
import WhatIfLab from '@/pages/WhatIfLab';
import Experiments from '@/pages/Experiments';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Learning Platform Shell */}
        <Route element={<AppShell />}>
          {/* Learning Routes */}
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/learning-paths" element={<LearningPaths />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/learn" element={<Navigate to="/courses" replace />} />
          <Route path="/learn/:topic" element={<LessonView />} />
          <Route path="/concepts" element={<ExploreConcepts />} />
          <Route path="/study-notes" element={<StudyNotes />} />

          {/* Practice Routes */}
          <Route path="/labs" element={<InteractiveLabs />} />
          <Route path="/coding-playground" element={<CodingPlayground />} />
          <Route path="/numerical-practice" element={<NumericalPractice />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/assignments" element={<Assignments />} />

          {/* Performance Routes */}
          <Route path="/progress" element={<MyProgress />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/analytics" element={<LearningAnalytics />} />
          <Route path="/certificates" element={<Certificates />} />

          {/* Resources Routes */}
          <Route path="/glossary" element={<OSGlossary />} />
          <Route path="/formula-sheet" element={<FormulaSheet />} />
          <Route path="/reference-library" element={<ReferenceLibrary />} />
          <Route path="/about" element={<AboutPlatform />} />

          {/* Preserved Simulator Engines & Digital Twin */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/processes" element={<ProcessManager />} />
          <Route path="/scheduling" element={<CPUScheduler />} />
          <Route path="/synchronization" element={<Synchronization />} />
          <Route path="/deadlocks" element={<Deadlocks />} />
          <Route path="/memory" element={<VirtualMemory />} />
          <Route path="/page-replacement" element={<PageReplacement />} />
          <Route path="/ipc" element={<IPC />} />
          <Route path="/io-buffer" element={<IOBuffer />} />
          <Route path="/disk" element={<DiskScheduler />} />
          <Route path="/what-if" element={<WhatIfLab />} />
          <Route path="/experiments" element={<Experiments />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
