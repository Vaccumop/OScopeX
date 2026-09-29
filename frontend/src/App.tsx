import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/layouts/AppShell';
import LandingPage from '@/pages/LandingPage';
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
import LearnOS from '@/pages/LearnOS';
import LearnTopic from '@/pages/LearnTopic';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppShell />}>
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
          <Route path="/learn" element={<LearnOS />} />
          <Route path="/learn/:topic" element={<LearnTopic />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
