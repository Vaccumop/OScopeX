import React, { useState } from 'react';
import {
  Code2,
  Play,
  Terminal,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface CodeExample {
  id: string;
  title: string;
  category: 'Process' | 'Threads' | 'Synchronization' | 'IPC' | 'BASH';
  description: string;
  language: 'c' | 'bash';
  code: string;
  expectedOutput: string;
  explanation: { lineRange: string; note: string }[];
  predictionQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  pitfalls: string[];
}

const EXAMPLES: CodeExample[] = [
  {
    id: 'fork-basic',
    title: 'Process Creation with fork() and getpid()',
    category: 'Process',
    description: 'Demonstrating how fork() creates an exact clone of the calling process with distinct return codes.',
    language: 'c',
    code: `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        // Fork failed
        perror("fork failed");
        return 1;
    } else if (pid == 0) {
        // Child process
        printf("Child Process:  PID=%d, Parent PID=%d\\n", getpid(), getppid());
    } else {
        // Parent process
        printf("Parent Process: PID=%d, Created Child PID=%d\\n", getpid(), pid);
    }

    return 0;
}`,
    expectedOutput: `Parent Process: PID=4012, Created Child PID=4013
Child Process:  PID=4013, Parent PID=4012`,
    explanation: [
      { lineRange: 'Line 6', note: 'fork() is called once in the parent, but returns TWICE: returns 0 in the child, and returns child PID in the parent.' },
      { lineRange: 'Lines 12-14', note: 'Child branch executes when return value is 0. getpid() fetches own PID, getppid() fetches parent PID.' },
      { lineRange: 'Lines 15-18', note: 'Parent branch executes when return value > 0, holding the newly created child\'s PID.' },
    ],
    predictionQuestion: {
      question: 'What is the return value of fork() inside the newly created child process?',
      options: ['1', '0', '-1', 'The parent PID'],
      correctIndex: 1,
      explanation: 'fork() returns 0 to the child process, and returns the positive child PID to the parent process.',
    },
    pitfalls: [
      'Assuming parent always prints before child (execution order is non-deterministic and determined strictly by CPU scheduling).',
      'Forgetting to check for fork() < 0 when system process table limits are exhausted.',
    ],
  },
  {
    id: 'zombie-wait',
    title: 'Preventing Zombie Processes with wait()',
    category: 'Process',
    description: 'How parent processes reap terminated children to prevent PCB leakage in the kernel process table.',
    language: 'c',
    code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();

    if (pid == 0) {
        printf("Child (PID %d) doing quick work and exiting...\\n", getpid());
        exit(42); // Exit with status code 42
    } else {
        int status;
        printf("Parent waiting for child to complete...\\n");
        pid_t child_pid = wait(&status); // Reaps child PCB

        if (WIFEXITED(status)) {
          printf("Parent reaped Child %d! Exit Code: %d\\n", 
                 child_pid, WEXITSTATUS(status));
        }
    }
    return 0;
}`,
    expectedOutput: `Parent waiting for child to complete...
Child (PID 4080) doing quick work and exiting...
Parent reaped Child 4080! Exit Code: 42`,
    explanation: [
      { lineRange: 'Line 11', note: 'Child exits immediately with exit code 42. If parent does not call wait(), child remains a Zombie in the process table.' },
      { lineRange: 'Line 15', note: 'wait(&status) blocks parent until child terminates, then releases the child\'s PCB.' },
      { lineRange: 'Line 17', note: 'WIFEXITED macro checks if child terminated normally; WEXITSTATUS extracts the exit code.' },
    ],
    predictionQuestion: {
      question: 'What is a Zombie process in operating systems?',
      options: [
        'A process using 100% of the CPU',
        'A terminated process whose exit status has not yet been read by its parent via wait()',
        'A process with no parent that was adopted by init/systemd',
        'A process locked in mutual exclusion deadlock',
      ],
      correctIndex: 1,
      explanation: 'A zombie process has terminated execution, but still retains an entry in the kernel process table so the parent can inspect its exit status.',
    },
    pitfalls: [
      'Confusing Zombie process (dead child waiting for parent wait()) with Orphan process (parent terminated before child, child adopted by init/systemd).',
    ],
  },
  {
    id: 'pthreads-mutex',
    title: 'POSIX Threads & Mutex Synchronization',
    category: 'Threads',
    description: 'Protecting shared memory counters from race conditions using pthread_mutex_lock and unlock.',
    language: 'c',
    code: `#include <stdio.h>
#include <pthread.h>

#define NUM_ITERATIONS 100000

long counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void* worker(void* arg) {
    for (int i = 0; i < NUM_ITERATIONS; i++) {
        pthread_mutex_lock(&lock);    // Enter Critical Section
        counter++;                    // Shared state modification
        pthread_mutex_unlock(&lock);  // Exit Critical Section
    }
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, worker, NULL);
    pthread_create(&t2, NULL, worker, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Final Synchronized Counter: %ld (Expected: 200000)\\n", counter);
    pthread_mutex_destroy(&lock);
    return 0;
}`,
    expectedOutput: `Final Synchronized Counter: 200000 (Expected: 200000)`,
    explanation: [
      { lineRange: 'Line 7', note: 'PTHREAD_MUTEX_INITIALIZER statically initializes the mutex to an unlocked state.' },
      { lineRange: 'Lines 11-13', note: 'pthread_mutex_lock ensures that only one thread can execute counter++ at any instant.' },
      { lineRange: 'Lines 23-24', note: 'pthread_join blocks main until threads t1 and t2 terminate.' },
    ],
    predictionQuestion: {
      question: 'What happens if pthread_mutex_lock and unlock are removed from the loop with 2 threads running concurrently?',
      options: [
        'The program crashes with a segmentation fault',
        'The final counter will likely be LESS than 200,000 due to race conditions overwriting increments',
        'The compiler refuses to compile the code',
        'The execution terminates 100x slower',
      ],
      correctIndex: 1,
      explanation: 'Without mutex protection, concurrent unsynchronized reads and writes cause race conditions where simultaneous increments overwrite each other, yielding a final value below 200,000.',
    },
    pitfalls: [
      'Calling pthread_mutex_lock twice consecutively on the same thread without recursive mutex support, creating instant self-deadlock.',
    ],
  },
  {
    id: 'ipc-pipe',
    title: 'Inter-Process Communication via Unnamed Pipe',
    category: 'IPC',
    description: 'Establishing a unidirectional byte stream between parent and child using pipe(), read(), and write().',
    language: 'c',
    code: `#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main() {
    int pipefd[2]; // pipefd[0] = read, pipefd[1] = write
    char buffer[64];

    if (pipe(pipefd) == -1) {
        perror("pipe error");
        return 1;
    }

    pid_t pid = fork();

    if (pid == 0) {
        // Child reads from pipe
        close(pipefd[1]); // Close unused write end
        read(pipefd[0], buffer, sizeof(buffer));
        printf("Child received message: \\"%s\\"\\n", buffer);
        close(pipefd[0]);
    } else {
        // Parent writes to pipe
        close(pipefd[0]); // Close unused read end
        char msg[] = "Hello from OScopeX Kernel!";
        write(pipefd[1], msg, strlen(msg) + 1);
        close(pipefd[1]);
    }

    return 0;
}`,
    expectedOutput: `Child received message: "Hello from OScopeX Kernel!"`,
    explanation: [
      { lineRange: 'Line 6', note: 'pipefd[0] is opened for reading; pipefd[1] is opened for writing.' },
      { lineRange: 'Line 19', note: 'Child closes pipefd[1] to ensure read() unblocks when parent closes its write end (EOF).' },
      { lineRange: 'Line 27', note: 'Parent writes string bytes into kernel ring buffer; child immediately reads it.' },
    ],
    predictionQuestion: {
      question: 'In a UNIX unnamed pipe, which file descriptor index is traditionally used for reading?',
      options: ['pipefd[0]', 'pipefd[1]', 'pipefd[2]', 'pipefd[-1]'],
      correctIndex: 0,
      explanation: 'By convention, pipefd[0] is the read end and pipefd[1] is the write end.',
    },
    pitfalls: [
      'Forgetting to close the unused write end in the reader, causing read() to hang indefinitely waiting for EOF.',
    ],
  },
];

export default function CodingPlayground() {
  const [selectedExample, setSelectedExample] = useState<CodeExample>(EXAMPLES[0]);
  const [copied, setCopied] = useState(false);
  const [userPrediction, setUserPrediction] = useState<number | null>(null);
  const [showPredictionResult, setShowPredictionResult] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectExample = (ex: CodeExample) => {
    setSelectedExample(ex);
    setUserPrediction(null);
    setShowPredictionResult(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c162d] via-[#0e1c38] to-[#091326] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Code2 size={14} /> Practical OS Programming
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Coding Playground & Output Tracing
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Study real POSIX C and BASH operating systems code. Learn how system calls, threads, synchronization primitives, and pipes execute at the kernel boundary.
        </p>

        {/* Examples Picker */}
        <div className="flex flex-wrap gap-2 mt-6">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleSelectExample(ex)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedExample.id === ex.id
                  ? 'bg-cyan-500 text-[#080e1c] shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code Editor + Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Code View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0c1322] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            {/* Window Topbar */}
            <div className="px-4 py-3 bg-[#080d1a] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  {selectedExample.id}.c — POSIX C
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-all border border-white/5"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 bg-[#0a0f1e] overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed custom-scrollbar">
              <pre>
                <code>{selectedExample.code}</code>
              </pre>
            </div>
          </div>

          {/* Expected Output Console */}
          <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-4">
            <div className="text-xs font-mono text-cyan-400 mb-2 flex items-center gap-1.5">
              <Terminal size={14} /> Expected Kernel Output (stdout)
            </div>
            <pre className="p-3 bg-[#070b16] rounded-xl text-xs font-mono text-green-300/90 whitespace-pre-wrap leading-relaxed border border-green-500/10">
              {selectedExample.expectedOutput}
            </pre>
          </div>
        </div>

        {/* Right (1 col): Explanations & Prediction Challenge */}
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-cyan-400" /> How It Works
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedExample.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-white/5">
              {selectedExample.explanation.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <div className="font-mono font-semibold text-cyan-300 text-[11px] mb-0.5">
                    {item.lineRange}
                  </div>
                  <div className="text-slate-400 leading-relaxed text-[11px]">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Prediction Quiz */}
          {selectedExample.predictionQuestion && (
            <div className="bg-[#0d1526] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} /> Output Prediction Challenge
              </div>
              <p className="text-xs font-semibold text-slate-200">
                {selectedExample.predictionQuestion.question}
              </p>

              <div className="space-y-1.5">
                {selectedExample.predictionQuestion.options.map((opt, i) => {
                  const isSelected = userPrediction === i;
                  const isCorrect = i === selectedExample.predictionQuestion!.correctIndex;
                  let style = 'border-white/5 hover:border-cyan-500/30 text-slate-300 bg-white/[0.02]';

                  if (showPredictionResult) {
                    if (isCorrect) style = 'border-green-500/50 bg-green-500/15 text-green-300';
                    else if (isSelected && !isCorrect) style = 'border-red-500/50 bg-red-500/15 text-red-300';
                    else style = 'opacity-50 text-slate-500 border-white/5';
                  } else if (isSelected) {
                    style = 'border-cyan-500 bg-cyan-500/10 text-cyan-300';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => !showPredictionResult && setUserPrediction(i)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!showPredictionResult ? (
                <button
                  onClick={() => setShowPredictionResult(true)}
                  disabled={userPrediction === null}
                  className="w-full mt-2 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#080e1c] font-bold text-xs transition-all"
                >
                  Verify Prediction
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-300">
                  <strong className="text-cyan-400">Explanation:</strong> {selectedExample.predictionQuestion.explanation}
                </div>
              )}
            </div>
          )}

          {/* Pitfalls */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Common Pitfalls
            </h4>
            <ul className="space-y-1.5 text-xs text-red-200/90 leading-relaxed">
              {selectedExample.pitfalls.map((p, idx) => (
                <li key={idx}>• {p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
