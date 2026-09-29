import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Activity, Lock, AlertTriangle, Database, Layers, GitBranch, HardDrive, Disc, ArrowRight } from 'lucide-react';

const TOPICS = [
  { slug:'processes', icon:Activity, title:'Processes', color:'text-green-400 bg-green-400/10', desc:'What is a process? Process states, PCB, creation and termination.', sim:'/processes', simLabel:'Open Process Manager' },
  { slug:'threads', icon:Cpu, title:'Threads', color:'text-blue-400 bg-blue-400/10', desc:'Process vs thread. Multithreading, user threads vs kernel threads.', sim:'/scheduling', simLabel:'Open CPU Scheduler' },
  { slug:'scheduling', icon:Cpu, title:'CPU Scheduling', color:'text-cyan-400 bg-cyan-400/10', desc:'FCFS, SJF, SRTF, Round Robin, Priority, MLFQ — when to use each.', sim:'/scheduling', simLabel:'Open CPU Scheduler' },
  { slug:'synchronization', icon:Lock, title:'Synchronization', color:'text-purple-400 bg-purple-400/10', desc:'Race conditions, critical sections, semaphores, mutexes, monitors.', sim:'/synchronization', simLabel:'Open Synchronization' },
  { slug:'deadlocks', icon:AlertTriangle, title:'Deadlocks', color:'text-red-400 bg-red-400/10', desc:'Necessary conditions, detection, avoidance, prevention, recovery.', sim:'/deadlocks', simLabel:'Open Deadlock Lab' },
  { slug:'memory', icon:Database, title:'Memory Management', color:'text-violet-400 bg-violet-400/10', desc:'Contiguous allocation, segmentation, paging — managing RAM.', sim:'/memory', simLabel:'Open Virtual Memory' },
  { slug:'virtual-memory', icon:Database, title:'Virtual Memory', color:'text-indigo-400 bg-indigo-400/10', desc:'Address translation, TLB, page tables, demand paging.', sim:'/memory', simLabel:'Open Virtual Memory' },
  { slug:'page-replacement', icon:Layers, title:'Page Replacement', color:'text-sky-400 bg-sky-400/10', desc:'FIFO, LRU, Optimal, Clock — which frames to evict on page fault.', sim:'/page-replacement', simLabel:'Open Page Replacement' },
  { slug:'ipc', icon:GitBranch, title:'IPC', color:'text-teal-400 bg-teal-400/10', desc:'Pipes, message queues, shared memory, sockets — how processes talk.', sim:'/ipc', simLabel:'Open IPC' },
  { slug:'io', icon:HardDrive, title:'I/O Management', color:'text-orange-400 bg-orange-400/10', desc:'Device controllers, buffering, spooling, I/O scheduling.', sim:'/io-buffer', simLabel:'Open I/O Buffer' },
  { slug:'disk', icon:Disc, title:'Disk Scheduling', color:'text-amber-400 bg-amber-400/10', desc:'Seek time, rotational latency, FCFS/SSTF/SCAN — minimizing disk I/O.', sim:'/disk', simLabel:'Open Disk Scheduler' },
];

export default function LearnOS() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Learn OS</h1>
        <p className="text-sm text-slate-500 mt-1">Explore operating system concepts — then try them in the simulator.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map(({ slug, icon: Icon, title, color, desc, sim, simLabel }, i) => (
          <motion.div key={slug} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="bg-[#0d1526] border border-white/5 hover:border-cyan-500/20 rounded-xl p-5 transition-all group cursor-pointer"
            onClick={()=>navigate(`/learn/${slug}`)}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}><Icon size={18}/></div>
            <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{desc}</p>
            <div className="flex items-center justify-between">
              <button onClick={e=>{e.stopPropagation();navigate(`/learn/${slug}`);}}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                Read More <ArrowRight size={10}/>
              </button>
              <button onClick={e=>{e.stopPropagation();navigate(sim);}}
                className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                <BookOpen size={10}/> {simLabel}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
