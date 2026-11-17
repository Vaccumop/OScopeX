// ============================================================
// Comprehensive Operating Systems Curriculum & Learning Data
// Covering all 6 Syllabus Units with granular lessons,
// interactive demos, worked examples, and simulation mappings.
// ============================================================

export interface LessonQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  definition: string;
  detailedExplanation: string;
  whyNeeded: string;
  howItWorks: string;
  analogy: string;
  applications: string[];
  workedExample?: {
    title: string;
    description: string;
    steps: { step: number; action: string; outcome: string }[];
  };
  commonMistakes: string[];
  quickRevision: string[];
  simUrl?: string;
  simLabel?: string;
  simCategory?: string;
  interactiveWidgetType?: 'state_diagram' | 'system_call_flow' | 'scheduler_demo' | 'banker_demo' | 'paging_demo' | 'disk_demo' | 'buffer_demo';
  questions: LessonQuestion[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  iconName: string;
  color: string;
  lessons: Lesson[];
}

export const CURRICULUM: Unit[] = [
  // ============================================================
  // UNIT 1: INTRODUCTION TO OPERATING SYSTEM
  // ============================================================
  {
    id: 'unit-1',
    number: 1,
    title: 'Introduction to Operating System',
    description: 'Hardware interaction, system calls, OS architectures, evolution, Linux fundamentals, and shell scripting.',
    iconName: 'Terminal',
    color: 'text-cyan-400 bg-cyan-400/10 border-cyan-500/30',
    lessons: [
      {
        id: 'u1-l1',
        unitId: 'unit-1',
        slug: 'what-is-an-os',
        title: 'What is an Operating System & Hardware Interaction',
        subtitle: 'The fundamental software bridging user applications and raw hardware',
        estimatedMinutes: 15,
        difficulty: 'Beginner',
        objectives: [
          'Understand what an Operating System is and its core role',
          'Explore how the OS interacts with CPU, Memory, and I/O controllers',
          'Differentiate between User Mode and Kernel Mode execution',
        ],
        definition: 'An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between the user and the computer hardware.',
        detailedExplanation: `The OS operates at the boundary between raw physical hardware (processors, RAM, buses, storage, peripherals) and user programs. Without an OS, every software application would have to implement hardware drivers, track raw memory sector addresses, and arbitrate physical bus signals directly.
        
To ensure stability and security, modern CPUs provide dual-mode operation:
1. User Mode (Ring 3 on x86): Unprivileged mode where user applications execute. Direct hardware access and privileged CPU instructions are strictly forbidden.
2. Kernel Mode / Supervisor Mode (Ring 0 on x86): Privileged mode where the core OS kernel executes with unrestricted access to memory, CPU control registers, and peripheral buses.`,
        whyNeeded: 'Without an OS, computer systems would be chaotic: one buggy program could overwrite another program\'s memory, crash the processor, or monopolize devices indefinitely. The OS provides abstraction, protection, and resource allocation.',
        howItWorks: 'When a user application needs hardware access (such as reading a file or creating a socket), it executes a trap instruction to switch the CPU from User Mode to Kernel Mode via a well-defined System Call table.',
        analogy: 'Imagine a busy restaurant. The hardware is the kitchen (stoves, refrigerators, pans). The customers are user applications. The Operating System is the head chef and restaurant manager who controls access to the kitchen so customers do not burn the building down or steal ingredients from each other.',
        applications: [
          'Process and thread management across multi-core processors',
          'Virtual memory address translation and page mapping',
          'Hardware abstraction layer (HAL) for network and disk controllers',
        ],
        workedExample: {
          title: 'User Mode to Kernel Mode Transition Trace',
          description: 'Tracing a simple printf() or file write operation from user space to kernel disk driver.',
          steps: [
            { step: 1, action: 'User application calls write(fd, buffer, count)', outcome: 'C standard library prepares arguments in CPU registers (RDI, RSI, RDX on x86-64).' },
            { step: 2, action: 'Execute syscall / int 0x80 CPU instruction', outcome: 'CPU hardware traps, flips CPU execution bit from User Mode (Ring 3) to Kernel Mode (Ring 0).' },
            { step: 3, action: 'Kernel looks up System Call table index', outcome: 'Kernel verifies memory buffers and invokes sys_write() driver handler.' },
            { step: 4, action: 'Kernel dispatches I/O request to device controller', outcome: 'Physical disk or display controller receives command via DMA or MMIO.' },
            { step: 5, action: 'Execute sysret / iret CPU instruction', outcome: 'CPU switches back to User Mode and returns execution to user code with return code.' },
          ],
        },
        commonMistakes: [
          'Confusing user applications with system utilities (e.g. bash or web browsers are user programs, not part of the OS kernel).',
          'Believing the OS runs continuously in the background using its own private CPU (the OS code executes on the same CPU cores when triggered by interrupts, exceptions, or system calls).',
        ],
        quickRevision: [
          'OS is a resource allocator and control program.',
          'Dual mode execution: User Mode (unprivileged) vs Kernel Mode (privileged).',
          'Hardware interrupts and software traps force CPU mode switches.',
        ],
        simUrl: '/dashboard',
        simLabel: 'Launch OS Digital Twin',
        simCategory: 'Digital Twin',
        interactiveWidgetType: 'system_call_flow',
        questions: [
          {
            id: 'u1-l1-q1',
            question: 'What mechanism allows a user-mode process to safely request a privileged service from the operating system?',
            options: ['Direct memory bus access', 'System Call (trap instruction)', 'Polling the motherboard BIOS', 'Disabling CPU interrupts'],
            correctIndex: 1,
            explanation: 'System calls trigger a software interrupt (trap) that switches the CPU from User Mode to Kernel Mode through verified entry points.',
          },
          {
            id: 'u1-l1-q2',
            question: 'In which CPU privilege ring does user application code normally execute on x86 processors?',
            options: ['Ring 0', 'Ring 1', 'Ring 2', 'Ring 3'],
            correctIndex: 3,
            explanation: 'Ring 3 is the least privileged User Mode ring, while Ring 0 is the supervisor/kernel ring.',
          },
          {
            id: 'u1-l1-q3',
            question: 'Which of the following is NOT a primary function of an Operating System?',
            options: ['Memory management', 'Compiling source code to machine bytecode', 'CPU scheduling', 'Device driver abstraction'],
            correctIndex: 1,
            explanation: 'Compilers (like gcc or clang) are development tools, not core Operating System functions.',
          },
        ],
      },
      {
        id: 'u1-l2',
        unitId: 'unit-1',
        slug: 'system-calls-and-services',
        title: 'Operating System Services & System Calls',
        subtitle: 'The 5 major categories of system calls and kernel service dispatch',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Categorize system calls into Process Control, File, Device, Info, and Communication',
          'Understand parameter passing conventions in system calls',
          'Trace POSIX system calls: fork(), read(), write(), open(), close()',
        ],
        definition: 'System calls provide the programmatic interface between a running program and the operating system. They are the only legitimate way for an application to obtain services from the operating system kernel.',
        detailedExplanation: `System calls are broadly categorized into five functional areas:
1. Process Control: fork(), exec(), exit(), wait(), getpid(), kill()
2. File Management: open(), read(), write(), close(), lseek(), unlink()
3. Device Management: ioctl(), read(), write()
4. Information Maintenance: time(), date(), getpid(), alarm()
5. Communication & Protection: pipe(), shmget(), socket(), chmod(), umask()

When passing parameters to system calls, three general methods exist:
- In CPU registers (fastest, but limited by register count).
- In a memory block/table, passing the block address in a register.
- Pushed onto the program stack and popped off by the kernel.`,
        whyNeeded: 'Direct access to raw disk blocks or network cards would allow malicious or buggy programs to spy on or corrupt system-wide data. System calls sanitize inputs, verify permissions, and enforce security policies.',
        howItWorks: 'An application calls an API wrapper (such as POSIX C library read()), which stores the system call number in the RAX/EAX register, populates argument registers, and executes the syscall assembly opcode.',
        analogy: 'A bank teller counter. You do not walk into the bank vault yourself to grab cash; you hand a withdrawal slip (system call arguments) to the teller (system call handler). The teller checks your identity and balance before handing you the cash.',
        applications: [
          'High-performance file streaming using read() / write() or splice()',
          'Inter-process communication setup using pipe() and socket()',
          'Process lifecycle monitoring via waitpid()',
        ],
        workedExample: {
          title: 'POSIX File Copy System Call Sequence',
          description: 'How cp source.txt dest.txt uses system calls under the hood.',
          steps: [
            { step: 1, action: 'open("source.txt", O_RDONLY)', outcome: 'Kernel verifies permissions and returns source file descriptor (e.g. fd = 3).' },
            { step: 2, action: 'open("dest.txt", O_WRONLY | O_CREAT, 0644)', outcome: 'Kernel creates destination inode and returns fd = 4.' },
            { step: 3, action: 'read(3, buffer, 4096)', outcome: 'Kernel reads 4096 bytes from disk cache into user buffer; returns bytes read.' },
            { step: 4, action: 'write(4, buffer, bytes_read)', outcome: 'Kernel writes user buffer into destination page cache.' },
            { step: 5, action: 'close(3) and close(4)', outcome: 'Frees file table entries in Process Control Block.' },
          ],
        },
        commonMistakes: [
          'Assuming C library functions like printf() are system calls. (printf is a user-space library function that formats strings before calling write()).',
          'Forgetting that system calls involve context switch overhead, making batched I/O faster than single-byte calls.',
        ],
        quickRevision: [
          '5 types: Process, File, Device, Info, Communication.',
          'System call number identifies the service in the kernel Dispatch Table.',
          'Passed via registers or memory blocks.',
        ],
        simUrl: '/ipc',
        simLabel: 'Explore System Call IPC Lab',
        simCategory: 'IPC',
        interactiveWidgetType: 'system_call_flow',
        questions: [
          {
            id: 'u1-l2-q1',
            question: 'Which of the following is a system call for process control?',
            options: ['fork()', 'printf()', 'strlen()', 'malloc()'],
            correctIndex: 0,
            explanation: 'fork() creates a new child process via the kernel. malloc and printf are user-space standard library functions.',
          },
          {
            id: 'u1-l2-q2',
            question: 'How does the OS kernel know which specific system call to execute when a trap occurs?',
            options: ['By scanning all open files', 'By reading the system call number in a designated CPU register', 'By checking the mouse cursor location', 'By querying the DNS server'],
            correctIndex: 1,
            explanation: 'The system call opcode/number is stored in a CPU register (such as EAX/RAX) which indexes into the kernel sys_call_table.',
          },
        ],
      },
      {
        id: 'u1-l3',
        unitId: 'unit-1',
        slug: 'types-of-operating-systems',
        title: 'Types of Operating Systems & Evolution',
        subtitle: 'Batch, Multiprogramming, Time-Sharing, Distributed, and Real-Time Systems',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Compare Batch Systems, Multiprogramming, and Time-Sharing systems',
          'Understand Distributed and Parallel multi-processor operating systems',
          'Differentiate Hard vs Soft Real-Time Operating Systems (RTOS)',
        ],
        definition: 'Operating systems are classified according to their architectural scheduling, hardware structure, and response time guarantees: Batch, Multiprogramming, Time-Sharing (Multitasking), Distributed, and Real-Time Systems.',
        detailedExplanation: `Key OS categories:
1. Batch Systems: Early OS (e.g. IBM 7094). Jobs with similar requirements were batched together and fed via punch cards. No user interaction during execution.
2. Multiprogramming OS: Keeps multiple jobs in memory simultaneously. When one job blocks on I/O, the CPU switches to another job, increasing CPU utilization.
3. Time-Sharing / Multitasking: Uses rapid CPU scheduling (time slicing) so users can interact with each program while it runs.
4. Distributed OS: Manages a group of distinct computers that communicate over a network, presenting them to users as a single coherent system.
5. Real-Time OS (RTOS): Systems where correctness depends not only on logical output but on the strict time at which the output is produced.
   - Hard Real-Time: Missing a deadline is catastrophic (pacemakers, anti-lock braking systems, flight avionics).
   - Soft Real-Time: Missing a deadline degrades quality of service but does not destroy the system (audio/video streaming).`,
        whyNeeded: 'Different hardware environments require fundamentally different scheduling guarantees. A pacemaker needs deterministic microsecond response, whereas a desktop PC prioritizes user responsiveness and throughput.',
        howItWorks: 'Multiprogramming utilizes interrupt-driven I/O completion to keep the CPU 100% busy. Time-sharing adds hardware timer interrupts that trigger periodic context switches.',
        analogy: 'Batch system is like a dry cleaner that washes all shirts together overnight. Time-sharing is like a chess grandmaster playing 50 opponents simultaneously by spending 10 seconds at each board in round-robin fashion.',
        applications: [
          'VxWorks and FreeRTOS in automotive and aerospace avionics (Hard RTOS)',
          'Linux and Windows on desktop and enterprise server platforms (Time-sharing)',
          'Kubernetes and cluster engines executing distributed workloads',
        ],
        commonMistakes: [
          'Thinking "Real-Time" simply means "very fast". Real-Time means deterministic and guaranteed deadlines, not necessarily highest clock speed.',
          'Confusing multiprogramming (multiple jobs in memory) with multiprocessing (multiple physical CPUs).',
        ],
        quickRevision: [
          'Batch: no interactive user, grouped jobs.',
          'Multiprogramming: overlaps CPU burst with I/O burst.',
          'Time-sharing: interactive multi-user via time slicing.',
          'Hard RTOS: absolute deadlines; Soft RTOS: best-effort priority.',
        ],
        simUrl: '/scheduling',
        simLabel: 'Test Time-Sharing in CPU Scheduler',
        simCategory: 'CPU Scheduler',
        interactiveWidgetType: 'scheduler_demo',
        questions: [
          {
            id: 'u1-l3-q1',
            question: 'In an anti-lock braking system (ABS), which type of operating system is strictly required?',
            options: ['Batch OS', 'Soft Real-Time OS', 'Hard Real-Time OS', 'Distributed OS'],
            correctIndex: 2,
            explanation: 'Hard Real-Time systems guarantee that critical tasks be completed within fixed deadline bounds; a failure causes system catastrophe.',
          },
          {
            id: 'u1-l3-q2',
            question: 'What was the primary breakthrough of Multiprogramming over early single-job systems?',
            options: ['Adding graphical user interfaces', 'Switching the CPU to another job when current job waits on I/O', 'Connecting computers across the Internet', 'Encrypting hard disk drives'],
            correctIndex: 1,
            explanation: 'Multiprogramming avoids CPU idle time by switching execution to ready jobs whenever the active job waits for slow I/O devices.',
          },
        ],
      },
      {
        id: 'u1-l4',
        unitId: 'unit-1',
        slug: 'linux-basics-and-bash',
        title: 'Introduction to Linux & BASH Shell Scripting',
        subtitle: 'File system hierarchy, permissions, piping, redirection, and shell scripts',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Navigate the Linux Filesystem Hierarchy Standard (/bin, /etc, /proc, /dev)',
          'Master essential commands: ls, grep, ps, kill, chmod, pipe (|), redirection (>)',
          'Write functional BASH shell scripts with variables, conditionals, and loops',
        ],
        definition: 'Linux is an open-source, POSIX-compliant monolithic kernel. The BASH (Bourne Again SHell) shell is a command-line interpreter and scripting language that executes user commands and automates OS tasks.',
        detailedExplanation: `In Linux, "Everything is a file" — from regular disk files to physical hardware (/dev/sda), process state (/proc/$PID), and communication endpoints (/dev/null, /dev/urandom).

Key command-line primitives:
- Navigation: cd, pwd, ls -la
- Process inspection: ps aux, top, htop, kill -9 <PID>
- I/O Redirection:
  - command > file (stdout to file, overwrite)
  - command >> file (stdout to file, append)
  - command < file (stdin from file)
  - command1 | command2 (pipe stdout of cmd1 into stdin of cmd2)
- Permissions: 3 octal digits for User, Group, Others (chmod 755 script.sh).`,
        whyNeeded: 'Automating server management, debugging processes, analyzing logs, and orchestrating distributed microservices require proficiency in Linux and shell scripting.',
        howItWorks: 'The BASH shell reads user text input, parses tokens, resolves path variables, forks a child process using fork(), redirects standard descriptors (0: stdin, 1: stdout, 2: stderr) using dup2(), and executes the executable using execve().',
        analogy: 'The Linux shell is like a universal steering wheel and dashboard for the engine (kernel). Commands and pipes are modular Lego bricks that clip together to build complex data pipelines.',
        applications: [
          'Automating daily system backups and log rotation',
          'Continuous Integration & Deployment (CI/CD) pipelines',
          'Process and server telemetry monitoring',
        ],
        workedExample: {
          title: 'Writing a Process Health Monitor in BASH',
          description: 'A shell script that inspects whether a process is running and restarts it if terminated.',
          steps: [
            { step: 1, action: '#!/bin/bash define target process', outcome: 'TARGET="nginx"' },
            { step: 2, action: 'pgrep $TARGET > /dev/null', outcome: 'Checks if target PID exists in kernel /proc table without printing output.' },
            { step: 3, action: 'if [ $? -ne 0 ]; then systemctl start $TARGET', outcome: 'If exit status is non-zero, trigger kernel service start.' },
            { step: 4, action: 'echo "Service restarted at $(date)" >> /var/log/monitor.log', outcome: 'Appends timestamped event to log file.' },
          ],
        },
        commonMistakes: [
          'Confusing > (overwrite file) with >> (append to file), accidentally wiping important configuration files.',
          'Missing the executable permission bit (chmod +x script.sh) and wondering why the script cannot execute.',
        ],
        quickRevision: [
          'Everything in Linux is represented as a file or stream.',
          'File permissions: Read (4), Write (2), Execute (1).',
          'Pipes (|) connect stdout of process A to stdin of process B.',
        ],
        simUrl: '/processes',
        simLabel: 'Explore Linux Process Model',
        simCategory: 'Process Manager',
        interactiveWidgetType: 'system_call_flow',
        questions: [
          {
            id: 'u1-l4-q1',
            question: 'What does the pipeline command `ps aux | grep node | wc -l` compute?',
            options: ['Restarts the Node.js server', 'Counts the number of running processes matching "node"', 'Deletes all node files', 'Changes node user permissions'],
            correctIndex: 1,
            explanation: 'ps lists processes, grep filters lines containing "node", and wc -l counts the number of filtered lines.',
          },
          {
            id: 'u1-l4-q2',
            question: 'What file permission does the octal value `754` grant to the file owner?',
            options: ['Read only (4)', 'Read and write (6)', 'Read, write, and execute (7)', 'Execute only (1)'],
            correctIndex: 2,
            explanation: 'The first digit represents the Owner: 4 (read) + 2 (write) + 1 (execute) = 7.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // UNIT 2: PROCESS MANAGEMENT & SYNCHRONIZATION
  // ============================================================
  {
    id: 'unit-2',
    number: 2,
    title: 'Process Management & Synchronization',
    description: 'Process lifecycle, PCB, context switching, multithreading, race conditions, semaphores, and classical synchronization problems.',
    iconName: 'Activity',
    color: 'text-green-400 bg-green-400/10 border-green-500/30',
    lessons: [
      {
        id: 'u2-l1',
        unitId: 'unit-2',
        slug: 'process-concept-and-states',
        title: 'Process Concept, States & 5-State/7-State Model',
        subtitle: 'Process vs Program, PCB structure, and lifecycle transitions',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Distinguish between a passive Program and an active Process',
          'Understand the 5-state model: New, Ready, Running, Blocked, Terminated',
          'Analyze the 7-state model including Ready-Suspended and Blocked-Suspended',
          'Inspect the Process Control Block (PCB) fields',
        ],
        definition: 'A Process is a program in execution. It represents the fundamental unit of work in modern operating systems, consisting of program code (text section), program counter, stack, heap, data section, and an associated Process Control Block (PCB).',
        detailedExplanation: `A program stored on disk is merely a passive collection of machine instructions. When loaded into RAM and allocated CPU scheduling time, it becomes an active Process.

Standard 5-State Lifecycle:
1. NEW: Process is being created.
2. READY: Process is in memory and waiting to be assigned to a CPU.
3. RUNNING: Instructions are currently executing on a CPU core.
4. BLOCKED / WAITING: Process is waiting for an external event (e.g., disk I/O, user input, timer).
5. TERMINATED: Process has finished execution; OS reclaims resources.

Extended 7-State Model (Swapping):
When physical RAM is exhausted, processes are swapped to disk (backing store):
- BLOCKED SUSPENDED: Process waiting for an event and swapped out to disk.
- READY SUSPENDED: Process ready to execute as soon as it is swapped back into RAM.

Process Control Block (PCB):
Maintained by the kernel for every process:
- Process ID (PID) and Parent PID (PPID)
- Process State
- Program Counter (PC)
- CPU Registers (Accumulator, Index, Stack Pointer)
- CPU Scheduling information (Priority)
- Memory management info (Page tables, base/limit registers)
- Accounting info & Open File Descriptors`,
        whyNeeded: 'The OS must maintain exact bookkeeping for thousands of concurrent processes so each process can be paused and resumed without losing its place or corrupting registers.',
        howItWorks: 'The scheduler moves processes between queues (Ready Queue, Device Queues). When a timer interrupt fires, the CPU state is saved into the active process\'s PCB.',
        analogy: 'A musical score sheet is a Program (passive). The musician playing the instrument on stage is the Process (active). If the musician pauses to tune a string, they enter the Blocked state.',
        applications: [
          'Task managers in desktop operating systems (e.g. Activity Monitor, Windows Task Manager)',
          'High-performance concurrency management in web servers (Nginx, Node.js)',
        ],
        workedExample: {
          title: 'Tracing a Process from Creation to Termination',
          description: 'Step-by-step state transitions of a user command.',
          steps: [
            { step: 1, action: 'User executes `./app` in shell', outcome: 'Shell calls fork() + execve(); process enters NEW state, OS creates PCB.' },
            { step: 2, action: 'OS loads binary code pages into RAM', outcome: 'Process moves to READY queue.' },
            { step: 3, action: 'CPU Scheduler dispatches process', outcome: 'State changes to RUNNING; instructions execute.' },
            { step: 4, action: 'Process calls read() on a network socket', outcome: 'State changes to BLOCKED; CPU dispatches another process.' },
            { step: 5, action: 'Network packet arrives (hardware interrupt)', outcome: 'Interrupt handler moves process from BLOCKED back to READY.' },
            { step: 6, action: 'Process finishes main() with return 0', outcome: 'Calls exit(); moves to TERMINATED, becomes zombie until parent reads exit code.' },
          ],
        },
        commonMistakes: [
          'Believing a process transitions directly from BLOCKED to RUNNING. (A blocked process must always enter READY first to wait for its turn in the scheduling queue).',
          'Thinking PCB is accessible in user space (PCB is strictly kernel data).',
        ],
        quickRevision: [
          'Process = Program + Execution State + Resources.',
          '5 states: NEW, READY, RUNNING, BLOCKED, TERMINATED.',
          'Suspended states move swapped processes to disk.',
          'PCB holds CPU registers, PC, PID, page table, and open files.',
        ],
        simUrl: '/processes',
        simLabel: 'Open Process Manager Lab',
        simCategory: 'Process Manager',
        interactiveWidgetType: 'state_diagram',
        questions: [
          {
            id: 'u2-l1-q1',
            question: 'When a running process initiates a disk I/O request, to which state does it immediately transition?',
            options: ['READY', 'TERMINATED', 'BLOCKED', 'SUSPENDED'],
            correctIndex: 2,
            explanation: 'The process cannot continue until the slow I/O completes, so it transitions to BLOCKED to release the CPU.',
          },
          {
            id: 'u2-l1-q2',
            question: 'Which component stores the CPU registers and program counter when a process is paused?',
            options: ['Page Table Entry', 'Process Control Block (PCB)', 'Inode Table', 'Instruction Cache'],
            correctIndex: 1,
            explanation: 'The PCB stores all hardware context (registers, flags, PC) required to resume process execution.',
          },
        ],
      },
      {
        id: 'u2-l2',
        unitId: 'unit-2',
        slug: 'context-switching-and-threads',
        title: 'Context Switching & Multithreading Models',
        subtitle: 'Hardware state swapping overhead, User vs Kernel threads, and models',
        estimatedMinutes: 20,
        difficulty: 'Intermediate',
        objectives: [
          'Understand the exact mechanical steps in a Context Switch',
          'Calculate Context Switching overhead and its impact on throughput',
          'Differentiate Processes from Threads (Lightweight Processes)',
          'Evaluate Many-to-One, One-to-One, and Many-to-Many threading models',
        ],
        definition: 'A Context Switch is the process of storing the state of a currently running process or thread so that execution can be resumed later, and loading the state of another process. A Thread is the smallest unit of CPU scheduling within a process.',
        detailedExplanation: `Context Switch Anatomy:
1. Hardware Interrupt (e.g. Timer Quantum expiration or I/O request).
2. CPU saves current instruction pointer and flags on kernel stack.
3. Kernel saves remaining general-purpose registers into outgoing process PCB.
4. OS Scheduler executes scheduling algorithm to pick next READY process.
5. Kernel updates Memory Management Unit (MMU) page table base pointer (CR3 on x86), which invalidates the Translation Lookaside Buffer (TLB).
6. Kernel restores register state from incoming process PCB.
7. CPU returns to User Mode and resumes execution of incoming process.

Threads (Lightweight Processes):
Threads in the same process share:
- Code section (text)
- Data section (global variables)
- Heap (dynamic memory)
- Open files and network sockets
Each thread maintains its own private:
- Thread ID
- Program Counter (PC)
- CPU Register set
- Private Call Stack (local variables)

Multithreading Models:
1. Many-to-One: Many user-level threads mapped to 1 kernel thread. Fast switching (no kernel trap), but if one thread blocks, the entire process blocks.
2. One-to-One: Each user thread mapped to a kernel thread (used by Linux, Windows, macOS). True multi-core parallelism, but higher kernel creation overhead.
3. Many-to-Many: Multiplexes user threads across equal or fewer kernel threads.`,
        whyNeeded: 'Context switching creates the illusion of smooth multitasking on computers with fewer CPU cores than active programs. Multithreading enables applications to perform long computations in worker threads while keeping UI threads responsive.',
        howItWorks: 'Threads switch much faster than full processes because thread switching within the same process does not flush the virtual memory page tables or invalidate the CPU TLB cache.',
        analogy: 'A process is an entire corporate office building. A context switch between processes is moving an entire company to a new building. Threads are coworkers inside the same office sharing the cafeteria and water cooler; a thread context switch is simply handing the desk phone to a colleague.',
        applications: [
          'Multi-threaded web servers handling thousands of concurrent requests',
          'Video game rendering engines separating physics, audio, and graphics loops',
        ],
        workedExample: {
          title: 'Calculating Context Switching Overhead',
          description: 'Evaluating how scheduling quantum size affects system efficiency.',
          steps: [
            { step: 1, action: 'Given CPU time quantum = 10 ms', outcome: 'Context switch duration = 0.5 ms.' },
            { step: 2, action: 'Calculate active CPU percentage', outcome: 'Efficiency = 10 / (10 + 0.5) = 95.2% CPU utilized by user code.' },
            { step: 3, action: 'Suppose quantum is reduced to 1 ms', outcome: 'Efficiency = 1 / (1 + 0.5) = 66.7% CPU utilized; 33.3% wasted entirely on context switching overhead!' },
          ],
        },
        commonMistakes: [
          'Assuming threads have their own separate heaps or file tables. (All threads in a process share the same heap and file descriptors; only the stack and registers are thread-private).',
          'Thinking context switching increases computation speed (context switching is pure overhead during which no user work is completed).',
        ],
        quickRevision: [
          'Context switch saves outgoing registers into PCB and loads incoming registers.',
          'Process switch flushes TLB; thread switch within same process preserves address space.',
          'One-to-One model is standard in modern desktop and server OSes.',
        ],
        simUrl: '/scheduling',
        simLabel: 'Visualize Context Switches in Gantt Chart',
        simCategory: 'CPU Scheduler',
        interactiveWidgetType: 'scheduler_demo',
        questions: [
          {
            id: 'u2-l2-q1',
            question: 'What major memory cache is invalidated when switching between two different processes, but retained when switching between threads of the same process?',
            options: ['Instruction Register', 'Translation Lookaside Buffer (TLB)', 'Hard Disk Firmware', 'Power Supply Buffer'],
            correctIndex: 1,
            explanation: 'Switching process address spaces requires changing the page table root, invalidating virtual-to-physical address mappings in the TLB.',
          },
          {
            id: 'u2-l2-q2',
            question: 'Which of the following resources is NOT shared among threads of the same process?',
            options: ['Heap memory', 'Global variables', 'Call stack', 'Open file descriptors'],
            correctIndex: 2,
            explanation: 'Each thread must have its own private call stack to store local variables and function activation frames.',
          },
        ],
      },
      {
        id: 'u2-l3',
        unitId: 'unit-2',
        slug: 'concurrency-mutex-semaphores',
        title: 'Concurrency, Race Conditions, Mutex & Semaphores',
        subtitle: 'Critical sections, mutual exclusion rules, and Dijkstra semaphores',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        objectives: [
          'Identify Race Conditions in concurrent execution',
          'Formulate the 3 requirements for the Critical Section Problem',
          'Implement Mutual Exclusion with Mutex locks and atomic operations',
          'Differentiate Counting Semaphores from Binary Semaphores (wait & signal)',
        ],
        definition: 'A Race Condition occurs when multiple concurrent threads or processes access shared data, and the final outcome depends on the non-deterministic order of thread execution. A Critical Section is the segment of code accessing that shared data.',
        detailedExplanation: `The Critical Section Problem requires satisfying three core properties:
1. Mutual Exclusion: If process P_i is executing in its critical section, no other process can be executing in its critical section.
2. Progress: If no process is executing in its critical section and some processes wish to enter, only those processes not in their remainder section can participate in the decision, and selection cannot be postponed indefinitely.
3. Bounded Waiting: A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has made a request and before that request is granted (prevents starvation).

Hardware Primitives:
Modern CPUs provide atomic instructions such as Test-And-Set and Compare-And-Swap (CAS) to build lock primitives without race conditions.

Mutex Locks:
A boolean variable representing locked (0) or unlocked (1). A thread acquires the lock before entering the critical section and releases it upon exit.

Semaphores (Dijkstra):
A synchronization tool consisting of an integer value S accessed only via two atomic operations:
- wait(S) / P(S): Decrements S. If S < 0, the calling process is blocked and placed on the semaphore waiting queue.
- signal(S) / V(S): Increments S. If S <= 0, removes and wakes up one blocked process from the queue.
  - Binary Semaphore: S in {0, 1} (equivalent to a mutex).
  - Counting Semaphore: S >= 0 used to control access to a finite pool of identical resource instances.`,
        whyNeeded: 'Without synchronization, concurrent read-modify-write operations on bank balances, inventory counts, or linked lists will produce corrupt data and memory leaks.',
        howItWorks: 'When wait(S) encounters a busy resource, instead of busy-waiting (spinning and burning CPU cycles), the kernel puts the calling thread into the BLOCKED state until signal(S) wakes it up.',
        analogy: 'A public restroom with one key. The person inside holds the key (Mutex). Other people wait in line outside. A counting semaphore is like a parking garage with a digital display: if 5 spots are open, 5 cars can enter; when the count reaches 0, the barrier gate stays down until a car leaves.',
        applications: [
          'Database transaction engines (ACID compliance)',
          'Thread-safe data structures in Java, C++, Python, Rust',
        ],
        workedExample: {
          title: 'The Counter Race Condition',
          description: 'Why count++ executed by 2 threads simultaneously can yield incorrect output.',
          steps: [
            { step: 1, action: 'Initial count = 5. Thread A and B both execute count++.', outcome: 'Machine code: (1) load register, (2) add 1, (3) store register.' },
            { step: 2, action: 'Thread A loads count into RegA (RegA = 5). Context switch occurs.', outcome: 'Thread A interrupted before writing.' },
            { step: 3, action: 'Thread B runs fully: loads 5, increments to 6, writes count = 6.', outcome: 'Memory count is now 6.' },
            { step: 4, action: 'Thread A resumes: increments RegA (6), writes count = 6.', outcome: 'Final count is 6 instead of 7! One increment was silently lost.' },
          ],
        },
        commonMistakes: [
          'Confusing a mutex with a semaphore (A mutex has ownership: only the thread that locked it may unlock it; a semaphore can be signaled by a different thread).',
          'Calling wait() and signal() in the wrong order or forgetting to signal(), causing immediate deadlock.',
        ],
        quickRevision: [
          'Race condition: unpredictable result due to timing of concurrent access.',
          'Critical section requirements: Mutual Exclusion, Progress, Bounded Waiting.',
          'wait(S) decrements and may block; signal(S) increments and wakes up waiting thread.',
        ],
        simUrl: '/synchronization',
        simLabel: 'Launch Synchronization Lab',
        simCategory: 'Synchronization',
        interactiveWidgetType: 'system_call_flow',
        questions: [
          {
            id: 'u2-l3-q1',
            question: 'Which condition requires that no process should wait indefinitely to enter its critical section?',
            options: ['Mutual Exclusion', 'Bounded Waiting', 'Progress', 'Deadlock Detection'],
            correctIndex: 1,
            explanation: 'Bounded Waiting ensures there is a limit on the number of times other processes can enter before a waiting process is served.',
          },
          {
            id: 'u2-l3-q2',
            question: 'If a counting semaphore is initialized to 3, and 5 consecutive wait() operations are called, what is the final semaphore value?',
            options: ['3', '0', '-2', '2'],
            correctIndex: 2,
            explanation: '3 - 5 = -2. A negative value indicates that 2 processes are currently blocked waiting on the semaphore.',
          },
        ],
      },
      {
        id: 'u2-l4',
        unitId: 'unit-2',
        slug: 'classical-sync-problems',
        title: 'Classical Synchronization Problems',
        subtitle: 'Producer-Consumer, Readers-Writers, and Dining Philosophers',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        objectives: [
          'Solve the Bounded-Buffer (Producer-Consumer) problem using semaphores',
          'Solve the Readers-Writers problem with starvation trade-offs',
          'Analyze the Dining Philosophers problem and prevent deadlock',
        ],
        definition: 'Classical synchronization problems are canonical concurrency benchmarks used to test and validate new synchronization algorithms, language primitives, and deadlock prevention techniques.',
        detailedExplanation: `1. Producer-Consumer (Bounded Buffer):
- Producers generate data items and deposit them into a fixed-size buffer of capacity N.
- Consumers extract data items from the buffer.
- Semaphores used:
  - mutex = 1: Mutual exclusion for buffer access.
  - empty = N: Counts empty slots (producer waits if buffer is full).
  - full = 0: Counts filled slots (consumer waits if buffer is empty).

2. Readers-Writers Problem:
- Multiple reader threads can read shared data concurrently without conflict.
- Only one writer thread may write at any time, requiring exclusive access.
- Starvation dilemma:
  - Reader priority: Writers can starve indefinitely if a continuous stream of readers arrives.
  - Writer priority: Readers must wait if a writer is pending.

3. Dining Philosophers Problem:
- 5 philosophers sit around a table with 5 chopsticks/forks. Each needs both left and right chopstick to eat.
- Naive solution: "Pick up left chopstick, then pick up right chopstick".
- Result: If all 5 pick up their left chopstick simultaneously, a circular wait deadlock occurs — all starve!
- Solutions:
  - Allow at most 4 philosophers at the table.
  - Asymmetric rule: Odd philosophers pick up left first; even philosophers pick up right first.`,
        whyNeeded: 'These classical problems mirror real-world systems: buffering network packets (Producer-Consumer), managing database records (Readers-Writers), and allocating non-preemptible hardware resources (Dining Philosophers).',
        howItWorks: 'By pairing counting semaphores with binary mutexes in strict structural sequences, race conditions and deadlocks are avoided.',
        analogy: 'Producer-Consumer is like a bakery conveyor belt that holds 10 cakes. If the shelf is full, the baker naps. If the shelf is empty, customers wait outside until fresh cake arrives.',
        applications: [
          'Circular logging rings and audio/video streaming buffers',
          'Read-Copy-Update (RCU) synchronization in the Linux kernel',
        ],
        commonMistakes: [
          'Swapping the order of wait(empty) and wait(mutex) in the Producer. (If wait(mutex) is called first when the buffer is full, the producer holds the mutex and sleeps forever, deadlocking the consumer).',
        ],
        quickRevision: [
          'Producer-Consumer uses 3 semaphores: mutex(1), empty(N), full(0).',
          'Readers can share; Writers require exclusive lock.',
          'Dining Philosophers circular deadlock solved by asymmetric pickup order.',
        ],
        simUrl: '/synchronization',
        simLabel: 'Simulate Classical Sync in Lab',
        simCategory: 'Synchronization',
        interactiveWidgetType: 'system_call_flow',
        questions: [
          {
            id: 'u2-l4-q1',
            question: 'In the Bounded Buffer problem with buffer size N, what initial value must the "empty" semaphore have?',
            options: ['0', '1', 'N', 'N - 1'],
            correctIndex: 2,
            explanation: 'Initially all N slots in the buffer are empty, so the empty semaphore is initialized to N.',
          },
          {
            id: 'u2-l4-q2',
            question: 'Why does the naive solution to the Dining Philosophers problem cause deadlock?',
            options: ['Philosophers eat too quickly', 'Every philosopher picks up their left fork simultaneously and waits forever for the right', 'The food runs out', 'Too many forks are available'],
            correctIndex: 1,
            explanation: 'When all philosophers hold one fork and wait for the adjacent fork, a circular wait deadlock condition occurs.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // UNIT 3: UNIPROCESSOR SCHEDULING
  // ============================================================
  {
    id: 'unit-3',
    number: 3,
    title: 'Uniprocessor Scheduling',
    description: 'Scheduling criteria, FCFS, SJF, SRTF, Round Robin, Priority, Multilevel Feedback Queues, and Gantt charts.',
    iconName: 'Cpu',
    color: 'text-blue-400 bg-blue-400/10 border-blue-500/30',
    lessons: [
      {
        id: 'u3-l1',
        unitId: 'unit-3',
        slug: 'scheduling-criteria-and-formulas',
        title: 'CPU Scheduling Fundamentals & Criteria',
        subtitle: 'Arrival time, Burst time, Waiting time, Turnaround, and Response metrics',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Master fundamental scheduling timing metrics',
          'Understand mathematical formulas for Turnaround Time, Waiting Time, and Response Time',
          'Differentiate Preemptive vs Non-Preemptive scheduling policies',
          'Construct and interpret Gantt Charts',
        ],
        definition: 'CPU Scheduling is the process by which the operating system decides which of the ready processes in memory is allocated the CPU core for execution, optimizing criteria like turnaround time, waiting time, and CPU utilization.',
        detailedExplanation: `Core Scheduling Timestamps:
- Arrival Time (AT): Instant at which the process arrives in the Ready Queue.
- Burst Time (BT): Total CPU execution time required by the process to complete.
- Completion Time (CT): Instant at which the process finishes its final instruction.

Mathematical Formulas:
1. Turnaround Time (TAT): Total time elapsed from process arrival to completion.
   TAT = CT - AT
2. Waiting Time (WT): Total time spent waiting in the ready queue without CPU execution.
   WT = TAT - BT
3. Response Time (RT): Time from arrival to the first time the process receives CPU execution.
   RT = Time of First CPU Grant - AT
4. CPU Utilization: Percentage of time the CPU is actively executing user processes.
   CPU Util = (Total Active CPU Time / Total Schedule Time) * 100%
5. Throughput: Number of processes completed per unit time.

Preemption:
- Non-Preemptive: Once the CPU is allocated to a process, it holds the CPU until it either terminates or switches to BLOCKED state.
- Preemptive: The OS can interrupt a running process mid-burst when a higher-priority or shorter process arrives, or when a time quantum expires.`,
        whyNeeded: 'Without intelligent scheduling, a rogue infinite loop could monopolize the entire system, freezing all other background and interactive tasks.',
        howItWorks: 'The Dispatcher module performs the context switch, switches to user mode, and jumps to the proper location in the user program to restart it.',
        analogy: 'A doctor\'s waiting room. Arrival time is when you sign in. Burst time is the doctor\'s consultation duration. Waiting time is how long you sit reading magazines. Turnaround time is total time from walking into the clinic until walking out the door with your prescription.',
        applications: [
          'Real-time task schedulers in robotics and IoT controllers',
          'Completely Fair Scheduler (CFS) in modern Linux distributions',
        ],
        workedExample: {
          title: 'Calculating Average Waiting & Turnaround Time',
          description: 'Step-by-step metric calculation for a 3-process workload.',
          steps: [
            { step: 1, action: 'Given P1 (AT=0, BT=4), P2 (AT=1, BT=3), P3 (AT=2, BT=1)', outcome: 'Execution order under FCFS: P1 (0-4), P2 (4-7), P3 (7-8).' },
            { step: 2, action: 'Calculate CT for each process', outcome: 'P1 CT=4; P2 CT=7; P3 CT=8.' },
            { step: 3, action: 'Calculate TAT = CT - AT', outcome: 'P1 TAT = 4-0 = 4; P2 TAT = 7-1 = 6; P3 TAT = 8-2 = 6.' },
            { step: 4, action: 'Calculate WT = TAT - BT', outcome: 'P1 WT = 4-4 = 0; P2 WT = 6-3 = 3; P3 WT = 6-1 = 5.' },
            { step: 5, action: 'Calculate Averages', outcome: 'Avg TAT = (4+6+6)/3 = 5.33; Avg WT = (0+3+5)/3 = 2.67.' },
          ],
        },
        commonMistakes: [
          'Confusing Waiting Time with Response Time. (In non-preemptive systems they are identical, but in preemptive systems like Round Robin they differ significantly).',
          'Subtracting Burst Time from Completion Time to get Waiting Time (WT = Turnaround Time - Burst Time, or CT - AT - BT).',
        ],
        quickRevision: [
          'TAT = Completion Time - Arrival Time.',
          'WT = Turnaround Time - Burst Time.',
          'Preemptive policies can interrupt running processes; Non-preemptive cannot.',
          'Gantt chart visualizes CPU allocation timeline.',
        ],
        simUrl: '/scheduling',
        simLabel: 'Run CPU Scheduling Simulator',
        simCategory: 'CPU Scheduler',
        interactiveWidgetType: 'scheduler_demo',
        questions: [
          {
            id: 'u3-l1-q1',
            question: 'If a process arrives at time t=2, has burst time 5, and completes at t=11, what is its waiting time?',
            options: ['9', '4', '5', '7'],
            correctIndex: 1,
            explanation: 'TAT = CT - AT = 11 - 2 = 9. Waiting Time = TAT - BT = 9 - 5 = 4.',
          },
          {
            id: 'u3-l1-q2',
            question: 'Which scheduling criterion measures the time from process submission until its first response is produced?',
            options: ['Throughput', 'Turnaround Time', 'Response Time', 'CPU Utilization'],
            correctIndex: 2,
            explanation: 'Response Time measures how quickly a process begins execution after arrival.',
          },
        ],
      },
      {
        id: 'u3-l2',
        unitId: 'unit-3',
        slug: 'fcfs-sjf-srtf-algorithms',
        title: 'FCFS, SJF & SRTF Algorithms',
        subtitle: 'First-Come First-Served, Shortest Job First, and Preemptive Shortest Remaining Time First',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        objectives: [
          'Execute FCFS and analyze the Convoy Effect',
          'Prove why Shortest Job First (SJF) is mathematically optimal for minimum average waiting time',
          'Simulate Preemptive SRTF and evaluate overhead vs performance trade-offs',
        ],
        definition: 'FCFS schedules processes in order of arrival. SJF selects the waiting process with the smallest CPU burst. SRTF is the preemptive version of SJF, switching CPU allocation whenever a newly arrived process has a remaining burst shorter than the running process.',
        detailedExplanation: `1. First-Come, First-Served (FCFS):
- Simple FIFO queue. Non-preemptive.
- Disadvantage: Convoy Effect. If a CPU-bound process with a huge burst time (e.g. 100ms) arrives first, all short I/O-bound processes behind it are delayed, causing low device and CPU utilization.

2. Shortest Job First (SJF):
- Non-preemptive. When CPU becomes available, assign to process with shortest CPU burst.
- Theorem: SJF is optimal: it gives the minimum average waiting time for a given set of processes.
- Drawback: Impossible to implement directly in general-purpose OS because future burst times cannot be known in advance. Can cause starvation of long jobs.

3. Shortest Remaining Time First (SRTF):
- Preemptive SJF. Whenever a new process arrives in the ready queue, compare its burst time with the running process's remaining time.
- If new burst < running remaining time, preempt current process immediately.`,
        whyNeeded: 'Understanding FCFS and SJF reveals the core fundamental trade-off of scheduling: fairness and simplicity vs throughput and average waiting time minimization.',
        howItWorks: 'SRTF maintains a min-heap or sorted priority queue keyed on remaining burst time, re-evaluating the queue head on every process arrival.',
        analogy: 'Supermarket checkout lanes. FCFS is a single lane where a person with 200 items makes someone holding a single pack of gum wait 30 minutes (Convoy Effect). SJF lets the person with 1 item cut in front so the average line waiting time drops dramatically.',
        applications: [
          'Print spooler job queues (FCFS)',
          'Batch processing and supercomputer job schedulers with declared runtimes (SJF)',
        ],
        workedExample: {
          title: 'SRTF Step-by-Step Execution Trace',
          description: 'P1 (AT=0, BT=8), P2 (AT=1, BT=4), P3 (AT=2, BT=2), P4 (AT=3, BT=1).',
          steps: [
            { step: 1, action: 'At t=0, only P1 arrives', outcome: 'P1 starts executing (remaining BT = 8).' },
            { step: 2, action: 'At t=1, P2 arrives (BT=4)', outcome: 'P1 has 7 left. Since 4 < 7, P2 preempts P1! P2 executes.' },
            { step: 3, action: 'At t=2, P3 arrives (BT=2)', outcome: 'P2 has 3 left. Since 2 < 3, P3 preempts P2! P3 executes.' },
            { step: 4, action: 'At t=3, P4 arrives (BT=1)', outcome: 'P3 has 1 left. Since 1 is not strictly less than 1, P3 continues to t=4 (finishes).' },
            { step: 5, action: 'At t=4, P4 executes to t=5 (finishes)', outcome: 'Queue has P2 (rem=3) and P1 (rem=7). P2 runs to t=8.' },
            { step: 6, action: 'At t=8, P1 runs to t=15 (finishes)', outcome: 'Calculated average waiting time is significantly lower than FCFS.' },
          ],
        },
        commonMistakes: [
          'Preempting in SRTF when the new process has an EQUAL remaining burst time. (Preemption only occurs if the new burst is strictly less than the currently executing process\'s remaining time).',
          'Claiming SJF is easily used in desktop OSes (burst time is unknown beforehand in real-time desktop tasks).',
        ],
        quickRevision: [
          'FCFS suffers from the Convoy Effect (short jobs stuck behind long jobs).',
          'SJF gives mathematically optimal minimum average waiting time.',
          'SRTF is preemptive SJF.',
          'Both SJF and SRTF can cause starvation of long burst processes.',
        ],
        simUrl: '/scheduling',
        simLabel: 'Compare FCFS vs SJF vs SRTF in Simulator',
        simCategory: 'CPU Scheduler',
        interactiveWidgetType: 'scheduler_demo',
        questions: [
          {
            id: 'u3-l2-q1',
            question: 'What is the phenomenon called when short processes are delayed behind a long process in FCFS scheduling?',
            options: ['Thrashing', 'Convoy Effect', 'Aging', 'Starvation'],
            correctIndex: 1,
            explanation: 'The Convoy Effect occurs when many I/O-bound processes wait for one CPU-intensive process to release the CPU.',
          },
          {
            id: 'u3-l2-q2',
            question: 'Which scheduling algorithm is mathematically proven to achieve the minimal average waiting time for a set of stationary processes?',
            options: ['FCFS', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling'],
            correctIndex: 2,
            explanation: 'SJF minimizes average waiting time because scheduling shorter jobs earlier reduces the cumulative waiting time for all subsequent processes.',
          },
        ],
      },
      {
        id: 'u3-l3',
        unitId: 'unit-3',
        slug: 'round-robin-priority-mlfq',
        title: 'Round Robin, Priority & Multilevel Feedback Queues',
        subtitle: 'Time slicing quantum trade-offs, priority aging, and multi-queue scheduling',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        objectives: [
          'Configure Round Robin (RR) and analyze how Time Quantum impacts context switching and response time',
          'Solve Priority Scheduling with Aging to eliminate starvation',
          'Design Multilevel Feedback Queue (MLFQ) priority demotion and promotion rules',
        ],
        definition: 'Round Robin (RR) assigns CPU time in fixed slices called time quanta. Priority scheduling executes higher-priority jobs first. Multilevel Feedback Queue (MLFQ) dynamically separates I/O-bound and CPU-bound processes into multiple prioritized queues with adaptive feedback.',
        detailedExplanation: `1. Round Robin (RR):
- Preemptive scheduling designed specifically for time-sharing systems.
- Ready queue treated as a circular FIFO queue.
- Time Quantum (q): Typically 10 to 100 milliseconds.
  - If q -> infinity, Round Robin degenerates into FCFS.
  - If q -> 0, Round Robin approaches Processor Sharing (creating high context-switch overhead).
  - Rule of thumb: 80% of CPU bursts should be shorter than the time quantum q.

2. Priority Scheduling:
- Each process has an integer priority (e.g. 0 to 255).
- Can be preemptive or non-preemptive.
- Starvation (Indefinite Blocking): Low-priority processes may never execute if high-priority processes keep arriving.
- Solution: AGING — gradually increasing the priority of processes that wait in the system for a long time.

3. Multilevel Feedback Queue (MLFQ):
- Multiple separate queues with different priorities:
  - Top Queue: Short quantum (e.g. q=4), highest priority.
  - Middle Queue: Longer quantum (e.g. q=8).
  - Bottom Queue: FCFS, lowest priority.
- Rules:
  - New processes enter top queue.
  - If a process uses its entire quantum without blocking on I/O, it is demoted to the next lower queue (CPU-bound penalty).
  - If a process voluntarily releases CPU to wait for I/O, it stays at or returns to high priority (interactive benefit).
  - Periodic priority boost resets all processes to top queue to prevent starvation.`,
        whyNeeded: 'Real-world operating systems manage diverse workloads: interactive keystrokes need instant response time, while background video rendering needs sustained high throughput without hogging the mouse cursor.',
        howItWorks: 'Hardware timer interrupts interrupt the running process after q milliseconds, invoking the scheduler interrupt handler to move the process to the tail of the ready queue.',
        analogy: 'MLFQ is like an airport boarding system. First-class passengers with small carry-on bags board first (interactive I/O tasks). Passengers with multiple heavy luggage carts are moved to standard boarding groups (CPU-bound batch jobs).',
        applications: [
          'Interactive graphical desktop systems (macOS, Windows, Linux desktop)',
          'Cloud virtualization scheduling guest virtual machine vCPUs',
        ],
        commonMistakes: [
          'Setting Round Robin quantum too small (e.g. 1 microsecond), causing the CPU to spend 90% of its time executing context switches rather than user code.',
          'Assuming smaller numbers always mean lower priority (in UNIX/Linux, smaller nice values mean HIGHER priority; in other textbooks, higher numbers mean higher priority. Always check convention).',
        ],
        quickRevision: [
          'Round Robin: circular queue with time quantum q.',
          'Small q improves response time but increases context switch overhead.',
          'Priority starvation solved by Aging (gradual priority boost).',
          'MLFQ penalizes CPU-heavy processes and rewards interactive I/O processes.',
        ],
        simUrl: '/scheduling',
        simLabel: 'Simulate Round Robin & MLFQ in Lab',
        simCategory: 'CPU Scheduler',
        interactiveWidgetType: 'scheduler_demo',
        questions: [
          {
            id: 'u3-l3-q1',
            question: 'What happens to Round Robin scheduling if the time quantum is set to an extremely large value (larger than any burst)?',
            options: ['It degenerates into FCFS', 'It causes deadlock', 'It minimizes context switches to 0', 'It causes thrashing'],
            correctIndex: 0,
            explanation: 'When the quantum exceeds all process burst times, no process is preempted before completion, behaving identically to FCFS.',
          },
          {
            id: 'u3-l3-q2',
            question: 'What technique is used in Priority Scheduling to prevent low-priority processes from starving?',
            options: ['Compaction', 'Aging', 'Paging', 'Spooling'],
            correctIndex: 1,
            explanation: 'Aging gradually increases the priority of waiting processes over time so they eventually reach the highest priority and execute.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // UNIT 4: DEADLOCK
  // ============================================================
  {
    id: 'unit-4',
    number: 4,
    title: 'Deadlock Detection & Avoidance',
    description: 'Four necessary conditions, Resource Allocation Graphs, Banker’s Algorithm, safe sequences, and recovery.',
    iconName: 'AlertTriangle',
    color: 'text-red-400 bg-red-400/10 border-red-500/30',
    lessons: [
      {
        id: 'u4-l1',
        unitId: 'unit-4',
        slug: 'deadlock-concept-and-conditions',
        title: 'Deadlock Concept & 4 Necessary Conditions',
        subtitle: 'Coffman conditions, Resource Allocation Graphs (RAG), and cycles',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Define Deadlock and distinguish it from Starvation and Livelock',
          'Identify Coffman\'s 4 Necessary Conditions for deadlock',
          'Construct and interpret Resource Allocation Graphs (RAG)',
          'Determine when a cycle in a RAG implies deadlock',
        ],
        definition: 'A Deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process in the set, resulting in zero system progress.',
        detailedExplanation: `Coffman\'s 4 Necessary Conditions (All 4 must hold simultaneously for deadlock to occur):
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process can use it at a time).
2. Hold and Wait: A process must be currently holding at least one resource and requesting additional resources that are held by other processes.
3. No Preemption: Resources cannot be forcibly preempted from a process; they can only be released voluntarily after the process completes its task.
4. Circular Wait: A closed chain of processes exists: P_0 waits for resource held by P_1, P_1 waits for P_2, ..., and P_n waits for P_0.

Resource Allocation Graph (RAG):
A directed bipartite graph:
- Vertices: Processes (P = {P1, P2, ...}) and Resource types (R = {R1, R2, ...}).
- Edges:
  - Request Edge: Directed edge P_i -> R_j (process requests an instance).
  - Assignment / Allocation Edge: Directed edge R_j -> P_i (instance allocated to process).

Key Theorem:
- If a RAG contains NO cycles => NO deadlock.
- If a RAG contains a cycle:
  - If each resource type has exactly 1 instance => DEADLOCK exists.
  - If resource types have multiple instances => Deadlock MAY exist, but is not guaranteed (other processes can release instances and break the cycle).`,
        whyNeeded: 'Deadlocks freeze operating system subsystems, database transaction locks, and distributed consensus rings, causing total denial of service if unhandled.',
        howItWorks: 'Deadlock detection algorithms perform Depth-First Search (DFS) or topological sorting on the system wait-for graph to identify cycles.',
        analogy: 'Four cars arrive simultaneously at a 4-way intersection without stop signs. Car North waits for Car East; Car East waits for Car South; Car South waits for Car West; Car West waits for Car North. No car can move forward.',
        applications: [
          'Database distributed transaction 2-phase locking (2PL)',
          'GPU memory buffer allocation in parallel deep learning clusters',
        ],
        workedExample: {
          title: 'Cycle vs Deadlock in Multi-Instance RAG',
          description: 'Analyzing why a cycle does not always cause deadlock when multiple instances exist.',
          steps: [
            { step: 1, action: 'Resource R1 has 2 instances. P1 holds R1, requests R2.', outcome: 'Edges: R1 -> P1, P1 -> R2.' },
            { step: 2, action: 'Resource R2 has 1 instance. P2 holds R2, requests R1.', outcome: 'Edges: R2 -> P2, P2 -> R1. A cycle P1 -> R2 -> P2 -> R1 -> P1 exists.' },
            { step: 3, action: 'Process P3 holds the 2nd instance of R1 and needs no resources.', outcome: 'P3 executes freely, finishes, and releases its instance of R1.' },
            { step: 4, action: 'Released instance of R1 is allocated to P2', outcome: 'P2 finishes and releases R2. P1 acquires R2 and finishes. No deadlock occurred despite the cycle!' },
          ],
        },
        commonMistakes: [
          'Assuming that any cycle in a Resource Allocation Graph guarantees a deadlock. (A cycle guarantees deadlock ONLY if all resource types in the cycle have single instances).',
          'Confusing deadlock (frozen, zero CPU usage) with livelock (processes actively changing state in response to each other without making progress, 100% CPU usage).',
        ],
        quickRevision: [
          '4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
          'If RAG has no cycle, system is safe.',
          'Single-instance RAG: cycle <=> deadlock.',
          'Multi-instance RAG: cycle is a necessary, but not sufficient condition for deadlock.',
        ],
        simUrl: '/deadlocks',
        simLabel: 'Explore Deadlock Graph in Lab',
        simCategory: 'Deadlocks',
        interactiveWidgetType: 'banker_demo',
        questions: [
          {
            id: 'u4-l1-q1',
            question: 'Which of the following conditions is NOT one of Coffman\'s four necessary conditions for deadlock?',
            options: ['Hold and Wait', 'Mutual Exclusion', 'Circular Wait', 'Dynamic Relocation'],
            correctIndex: 3,
            explanation: 'Dynamic Relocation is a memory management concept, not a condition for deadlock.',
          },
          {
            id: 'u4-l1-q2',
            question: 'In a Resource Allocation Graph where every resource has only one instance, the existence of a cycle means:',
            options: ['The system is 100% deadlocked', 'The system might be safe', 'The CPU is idle', 'Virtual memory is full'],
            correctIndex: 0,
            explanation: 'For single-instance resource systems, the existence of a cycle is both necessary and sufficient for deadlock.',
          },
        ],
      },
      {
        id: 'u4-l2',
        unitId: 'unit-4',
        slug: 'bankers-algorithm-and-avoidance',
        title: 'Deadlock Avoidance & Banker’s Algorithm',
        subtitle: 'Available vector, Allocation, Max, Need matrix, and Safe Sequence verification',
        estimatedMinutes: 30,
        difficulty: 'Advanced',
        objectives: [
          'Compute the Need Matrix: Need = Max - Allocation',
          'Execute the Banker\'s Safety Algorithm to find a valid Safe Sequence',
          'Evaluate Resource-Request feasibility without entering an unsafe state',
          'Differentiate Deadlock Prevention vs Avoidance vs Detection & Recovery',
        ],
        definition: 'The Banker\'s Algorithm (Dijkstra) is a deadlock avoidance algorithm that dynamically examines resource allocation state before granting requests, ensuring the system never enters an Unsafe State.',
        detailedExplanation: `Deadlock Handling Strategies:
1. Deadlock Ignorance (Ostrich Algorithm): Stick your head in the sand. Assume deadlocks are rare and reboot if frozen (used by Linux, Windows, macOS for general user processes).
2. Deadlock Prevention: Invalidate at least one of Coffman\'s 4 conditions:
   - Deny Hold & Wait: Require processes to request all resources upfront.
   - Deny Circular Wait: Impose a global strict numerical ordering on all resources.
3. Deadlock Avoidance (Banker\'s Algorithm):
   - System knows Maximum claim of each process in advance.
   - Safe State: There exists at least one order <P1, P2, ..., Pn> (a Safe Sequence) in which every process can obtain its maximum needed resources, finish execution, and release resources for subsequent processes.
   - Unsafe State: Does NOT mean deadlock has occurred yet; it means the system cannot guarantee avoidance if all processes suddenly request their declared maximums.

Banker\'s Algorithm Data Structures (n processes, m resources):
- Available[m]: Number of currently available instances of resource R_j.
- Max[n][m]: Maximum instances process P_i may request.
- Allocation[n][m]: Instances currently allocated to process P_i.
- Need[n][m]: Remaining instances process P_i may need to finish:
  Need[i][j] = Max[i][j] - Allocation[i][j]

Safety Algorithm Steps:
1. Let Work = Available and Finish[i] = false for all i.
2. Find index i such that Finish[i] == false and Need[i] <= Work. If no such i exists, go to step 4.
3. Work = Work + Allocation[i], Finish[i] = true. Go to step 2.
4. If Finish[i] == true for all i, system is in a SAFE state; otherwise UNSAFE.`,
        whyNeeded: 'Banker\'s Algorithm mathematically guarantees that deadlock can never occur while still allowing concurrent resource sharing.',
        howItWorks: 'Before allocating resources to a requesting process, the OS simulates the allocation. If the simulated resulting state contains a safe sequence, the request is granted; otherwise, the process must wait.',
        analogy: 'A small-town bank manager who has $10,000 cash. Three local businesses have credit lines of $10,000 each. The manager never lends money unless they can verify that at least one business can fully complete its project, pay back its loan, and free up cash for the other two.',
        applications: [
          'High-reliability safety-critical avionics control loops',
          'Enterprise database connection pool arbitration',
        ],
        workedExample: {
          title: 'Complete Banker’s Algorithm Step-by-Step Problem',
          description: '5 processes (P0-P4), 3 resources (A, B, C). Available = [3, 3, 2].',
          steps: [
            { step: 1, action: 'Given Allocation and Max matrices', outcome: 'Compute Need = Max - Allocation for all processes.' },
            { step: 2, action: 'Check P0: Need = [7,4,3] vs Work = [3,3,2]', outcome: 'Need > Work. P0 cannot finish now. Skip P0.' },
            { step: 3, action: 'Check P1: Need = [1,2,2] vs Work = [3,3,2]', outcome: 'Need <= Work! P1 can finish. Work becomes [3,3,2] + [2,0,0] = [5,3,2]. Sequence: <P1>' },
            { step: 4, action: 'Check P3: Need = [0,1,1] vs Work = [5,3,2]', outcome: 'Need <= Work! P3 finishes. Work = [5,3,2] + [2,1,1] = [7,4,3]. Sequence: <P1, P3>' },
            { step: 5, action: 'Check P4: Need = [4,3,1] vs Work = [7,4,3]', outcome: 'Need <= Work! P4 finishes. Work = [7,4,3] + [0,0,2] = [7,4,5]. Sequence: <P1, P3, P4>' },
            { step: 6, action: 'Check P0 & P2: Both can now finish!', outcome: 'Safe sequence found: <P1, P3, P4, P0, P2>. System is SAFE!' },
          ],
        },
        commonMistakes: [
          'Confusing an Unsafe State with a Deadlocked State. (All deadlocked states are unsafe, but an unsafe state is NOT necessarily deadlocked yet).',
          'Forgetting to add Allocation back to Work after a process finishes (Work = Work + Allocation[i]).',
        ],
        quickRevision: [
          'Need = Max - Allocation.',
          'Safe state guarantees at least one safe sequence exists.',
          'If Need <= Work, process can finish and return its allocated resources.',
          'Deadlock recovery options: terminate processes or preempt resources with rollback.',
        ],
        simUrl: '/deadlocks',
        simLabel: 'Run Banker’s Algorithm Calculator',
        simCategory: 'Deadlocks',
        interactiveWidgetType: 'banker_demo',
        questions: [
          {
            id: 'u4-l2-q1',
            question: 'If Available = [2, 1, 0] and Process P2 has Need = [1, 0, 2], can P2 be selected next in the Banker’s safety algorithm?',
            options: ['Yes', 'No, because P2 needs more of resource 3 than is available', 'Yes, if P2 runs in kernel mode', 'Only if aging is enabled'],
            correctIndex: 1,
            explanation: 'P2 needs 2 units of resource 3, but Available has only 0 units of resource 3 (Need not <= Work).',
          },
          {
            id: 'u4-l2-q2',
            question: 'True or False: An unsafe state in the Banker’s Algorithm is guaranteed to be a deadlocked state.',
            options: ['True', 'False'],
            correctIndex: 1,
            explanation: 'False. An unsafe state is not yet deadlocked; it simply means the OS cannot guarantee deadlock freedom if all processes request their maximums.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // UNIT 5: MEMORY MANAGEMENT
  // ============================================================
  {
    id: 'unit-5',
    number: 5,
    title: 'Memory Management & Virtual Memory',
    description: 'Partitioning, Paging, Segmentation, MMU Address Translation, TLB, Page Faults, and Page Replacement Algorithms.',
    iconName: 'Database',
    color: 'text-violet-400 bg-violet-400/10 border-violet-500/30',
    lessons: [
      {
        id: 'u5-l1',
        unitId: 'unit-5',
        slug: 'memory-partitioning-and-allocation',
        title: 'Memory Partitioning & Allocation Strategies',
        subtitle: 'Fixed vs Variable partitioning, First Fit, Best Fit, Worst Fit, and Fragmentation',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Differentiate Fixed Partitioning from Dynamic (Variable) Partitioning',
          'Calculate Internal Fragmentation and External Fragmentation',
          'Evaluate First Fit, Best Fit, and Worst Fit allocation algorithms',
          'Understand Compaction as a remedy for external fragmentation',
        ],
        definition: 'Memory Management is the functionality of an OS that handles the allocation, protection, and relocation of physical memory (RAM) among competing processes.',
        detailedExplanation: `1. Contiguous Memory Allocation Schemes:
- Fixed (Static) Partitioning: RAM divided into fixed-size partitions at boot.
  - Causes Internal Fragmentation: Unused space inside an allocated partition because the process is smaller than the partition.
- Dynamic (Variable) Partitioning: Partitions are created dynamically to match the exact size of each arriving process.
  - Eliminates internal fragmentation, but causes External Fragmentation: As processes terminate, free memory is broken into many small non-contiguous holes. Total free memory may be sufficient to satisfy a request, but no single continuous hole is large enough.

2. Placement Algorithms:
- First Fit: Allocate the FIRST hole in memory that is big enough. (Fastest search).
- Best Fit: Allocate the SMALLEST hole that is big enough. (Produces the smallest leftover hole; slow search unless sorted).
- Worst Fit: Allocate the LARGEST available hole. (Leaves the largest leftover hole; intuitively keeps large remaining chunks).
- Next Fit: Like First Fit, but starts scanning from the location of the previous allocation.

Compaction:
Shuffling all active memory contents to place all free memory together in one large contiguous block. Requires dynamic relocation hardware (base and limit registers).`,
        whyNeeded: 'Early operating systems could only run one program at a time. Partitioning allowed multiprogramming by placing multiple programs in RAM simultaneously.',
        howItWorks: 'The CPU contains a Base Register (holding the physical starting address) and a Limit Register (holding partition size). Every logical address is checked: Logical < Limit, then Physical = Base + Logical.',
        analogy: 'Parking cars on a street without marked lines. At first, cars park cleanly. As cars leave at different times, empty gaps appear. A large truck arrives and cannot park even though the sum of all small gaps exceeds the truck\'s length (External Fragmentation).',
        applications: [
          'Embedded real-time microcontrollers without MMU hardware',
          'Kernel slab and buddy allocators managing contiguous DMA buffers',
        ],
        workedExample: {
          title: 'Comparing First Fit, Best Fit, Worst Fit',
          description: 'Memory holes: 100K, 500K, 200K, 300K, 600K. Process requests: 212K.',
          steps: [
            { step: 1, action: 'First Fit search for 212K', outcome: 'Checks 100K (too small), checks 500K (fits!). Allocated in 500K hole. Leftover = 288K.' },
            { step: 2, action: 'Best Fit search for 212K', outcome: 'Holes that fit: 500K, 300K, 600K. Smallest is 300K. Allocated in 300K hole. Leftover = 88K.' },
            { step: 3, action: 'Worst Fit search for 212K', outcome: 'Largest hole is 600K. Allocated in 600K hole. Leftover = 388K.' },
          ],
        },
        commonMistakes: [
          'Thinking Best Fit always performs better than First Fit. (In practice, First Fit is faster and often produces less external fragmentation because Best Fit creates tiny unusable slivers).',
          'Confusing internal fragmentation (wasted inside assigned block) with external fragmentation (wasted between blocks).',
        ],
        quickRevision: [
          'Internal fragmentation: wasted space inside allocated block.',
          'External fragmentation: total free memory exists but is fragmented non-contiguously.',
          'First Fit is fastest; Best Fit searches for tightest match.',
          'Compaction resolves external fragmentation by shifting memory.',
        ],
        simUrl: '/memory',
        simLabel: 'Launch Virtual Memory Lab',
        simCategory: 'Virtual Memory',
        interactiveWidgetType: 'paging_demo',
        questions: [
          {
            id: 'u5-l1-q1',
            question: 'Which type of fragmentation occurs when allocated memory blocks are larger than the requested process data?',
            options: ['External Fragmentation', 'Internal Fragmentation', 'Page Table Fragmentation', 'Cache Invalidation'],
            correctIndex: 1,
            explanation: 'Internal fragmentation is unused memory within an assigned partition or page.',
          },
          {
            id: 'u5-l1-q2',
            question: 'Which dynamic memory allocation algorithm places a process in the largest available free hole?',
            options: ['First Fit', 'Best Fit', 'Worst Fit', 'Quick Fit'],
            correctIndex: 2,
            explanation: 'Worst Fit searches the entire memory list and allocates the largest available chunk.',
          },
        ],
      },
      {
        id: 'u5-l2',
        unitId: 'unit-5',
        slug: 'paging-and-address-translation',
        title: 'Paging, Segmentation & MMU Address Translation',
        subtitle: 'Page numbers, offsets, page tables, TLB cache, and Effective Access Time',
        estimatedMinutes: 30,
        difficulty: 'Advanced',
        objectives: [
          'Deconstruct Virtual Addresses into Page Number (p) and Page Offset (d)',
          'Map Logical Pages to Physical Frames via the Page Table',
          'Analyze TLB hit/miss mechanisms and calculate Effective Access Time (EAT)',
          'Compare Paging with Segmentation',
        ],
        definition: 'Paging is a memory management scheme that eliminates external fragmentation by permitting a process\'s physical address space to be non-contiguous. Physical memory is divided into fixed-size frames, and logical memory into pages of the same size.',
        detailedExplanation: `Mathematical Architecture of Paging:
- Logical Address is split into:
  - Page Number (p): Used as an index into the process Page Table.
  - Page Offset (d): Displacement within the page.
- If address space has 2^m bytes and page size is 2^n bytes:
  - High-order m - n bits designate Page Number p.
  - Low-order n bits designate Offset d.
- Physical Address calculation:
  Frame Number f = PageTable[p]
  Physical Address = (f * Page Size) + d

Translation Lookaside Buffer (TLB):
Looking up the page table in RAM for EVERY instruction doubles memory access time. The TLB is an ultra-fast hardware associative associative cache inside the CPU MMU storing recent (p, f) translations.
- TLB Hit: Page number found in TLB => translation in approx 1 clock cycle.
- TLB Miss: Page number not in TLB => access page table in RAM, update TLB.

Effective Access Time (EAT) Formula:
Let h = TLB hit ratio, e = TLB lookup time, m = main memory access time:
EAT = h * (e + m) + (1 - h) * (e + 2m)

Segmentation:
Unlike fixed-size paging, Segmentation reflects the programmer\'s view of memory: code, stack, heap, and libraries are divided into variable-sized logical segments referenced by <Segment s, Offset d>.`,
        whyNeeded: 'Paging enables Virtual Memory, copy-on-write, shared libraries (shared memory pages), and protects processes from accessing unauthorized memory regions.',
        howItWorks: 'The CPU generates virtual addresses; the Memory Management Unit (MMU) hardware intercepts each address and translates it to physical RAM coordinates using page tables.',
        analogy: 'Paging is like a book. The book text is divided into uniform pages (e.g. 500 words per page). You can bind the pages into any physical notebook binder in any order as long as the Table of Contents (Page Table) tells you where Page 5 is located.',
        applications: [
          'Modern x86-64 and ARM64 4-level hierarchical page tables (4KB / 2MB / 1GB huge pages)',
          'Sandboxing browser tabs in isolated virtual address spaces',
        ],
        workedExample: {
          title: 'Address Translation & EAT Calculation',
          description: 'Page size = 1 KB (1024 bytes). Virtual address = 3100. TLB hit ratio = 90%. Memory access = 100ns, TLB search = 20ns.',
          steps: [
            { step: 1, action: 'Calculate Page Number and Offset', outcome: 'Page Number p = 3100 / 1024 = 3. Offset d = 3100 % 1024 = 28.' },
            { step: 2, action: 'Lookup Page Table for page 3', outcome: 'Suppose PageTable[3] = Frame 7.' },
            { step: 3, action: 'Calculate Physical Address', outcome: 'Physical Address = (7 * 1024) + 28 = 7168 + 28 = 7196.' },
            { step: 4, action: 'Compute EAT with 90% TLB Hit Ratio', outcome: 'EAT = 0.90*(20+100) + 0.10*(20+200) = 0.90*(120) + 0.10*(220) = 108 + 22 = 130 ns.' },
          ],
        },
        commonMistakes: [
          'Changing the offset during address translation. (The offset d NEVER changes during translation; it is simply appended to the physical frame number f).',
          'Forgetting that a TLB miss requires accessing memory twice: once for the page table, once for the actual data operand.',
        ],
        quickRevision: [
          'Page size is always a power of 2 (2^n).',
          'Logical address = [ Page # (m-n bits) | Offset (n bits) ].',
          'Physical address = Frame Number * Page Size + Offset.',
          'TLB speeds up translation; EAT measures average memory latency.',
        ],
        simUrl: '/memory',
        simLabel: 'Try Address Translation in Memory Lab',
        simCategory: 'Virtual Memory',
        interactiveWidgetType: 'paging_demo',
        questions: [
          {
            id: 'u5-l2-q1',
            question: 'In a paging system with 4 KB page size, how many bits are used for the page offset?',
            options: ['10 bits', '12 bits', '16 bits', '20 bits'],
            correctIndex: 1,
            explanation: '4 KB = 4096 bytes = 2^12 bytes, so exactly 12 bits are needed for the page offset.',
          },
          {
            id: 'u5-l2-q2',
            question: 'During logical-to-physical address translation in paging, which part of the address remains completely unchanged?',
            options: ['Page Number', 'Frame Number', 'Offset', 'Base Register'],
            correctIndex: 2,
            explanation: 'The offset specifies the exact byte location within the page/frame and is copied directly to the physical address.',
          },
        ],
      },
      {
        id: 'u5-l3',
        unitId: 'unit-5',
        slug: 'page-replacement-algorithms',
        title: 'Virtual Memory & Page Replacement Algorithms',
        subtitle: 'Demand paging, Page faults, FIFO, Belady’s Anomaly, Optimal, LRU, and Second Chance',
        estimatedMinutes: 30,
        difficulty: 'Advanced',
        objectives: [
          'Understand Demand Paging and the Page Fault Service Routine',
          'Simulate FIFO, Optimal (OPT), LRU, and Second Chance (Clock) algorithms',
          'Demonstrate Belady\'s Anomaly (more frames resulting in more page faults)',
          'Compare Hit Ratio and Page Fault Frequency across algorithms',
        ],
        definition: 'Page Replacement is the mechanism by which the operating system decides which memory frame to evict (swap out to disk) when a page fault occurs and no free physical frames exist.',
        detailedExplanation: `Demand Paging & Page Faults:
Pages are loaded into RAM only when referenced during execution. Each page table entry contains a Valid/Invalid bit:
- Valid (1): Page is in physical RAM.
- Invalid (0): Page is not in RAM => Accessing it triggers a hardware PAGE FAULT interrupt.

Page Fault Service Routine:
1. Trap to kernel.
2. Check internal process tables: Is address invalid (segfault) or just on disk?
3. Find a free physical frame (or run Page Replacement to pick a victim page).
4. If victim is dirty (modified), write it back to disk swap space.
5. Schedule disk I/O to read the requested page into the frame.
6. Update page table valid bit to 1.
7. Restart the interrupted instruction.

Algorithms:
1. FIFO (First-In, First-Out):
   - Evict the oldest loaded page.
   - Belady\'s Anomaly: For some reference strings, increasing the number of physical frames increases the number of page faults!
2. Optimal Page Replacement (OPT / MIN):
   - Evict the page that will not be used for the longest period of time in the future.
   - Proven to achieve the lowest possible page fault rate. Impossible to implement in practice (requires future knowledge). Used as a theoretical gold standard benchmark.
3. LRU (Least Recently Used):
   - Evict the page that has not been referenced for the longest period in the past (approximates Optimal using past behavior).
   - Immune to Belady\'s Anomaly (Stack algorithm).
4. Second Chance / Clock Algorithm:
   - Practical approximation of LRU. Circular list of frames with a Reference Bit (0 or 1).
   - If ref bit is 0, evict it. If ref bit is 1, clear to 0, advance pointer, and give the page a second chance.`,
        whyNeeded: 'Virtual memory allows programs with address spaces much larger than physical RAM (e.g. running an 8 GB game on 4 GB RAM) to execute efficiently.',
        howItWorks: 'The OS tracks referenced and modified (dirty) bits in the hardware page table entries to minimize unnecessary disk writes.',
        analogy: 'Your work desk (physical frames) can only hold 3 open books. You need to consult 10 books (reference string). When you need a 4th book, which book do you put back on the bookshelf? FIFO removes the book you opened first; LRU removes the book you haven\'t glanced at in the longest time.',
        applications: [
          'Linux kernel page frame reclaimer (kswapd)',
          'Web browser tab discarders and database buffer pool management',
        ],
        workedExample: {
          title: 'FIFO vs LRU Page Replacement Trace',
          description: 'Reference string: 7, 0, 1, 2, 0, 3 with 3 physical frames.',
          steps: [
            { step: 1, action: 'Page 7 arrives', outcome: 'Frames: [7, -, -]. Fault 1.' },
            { step: 2, action: 'Page 0 arrives', outcome: 'Frames: [7, 0, -]. Fault 2.' },
            { step: 3, action: 'Page 1 arrives', outcome: 'Frames: [7, 0, 1]. Fault 3.' },
            { step: 4, action: 'Page 2 arrives (frames full)', outcome: 'FIFO evicts oldest (7). Frames: [2, 0, 1]. Fault 4.' },
            { step: 5, action: 'Page 0 arrives', outcome: 'Page 0 is already in frame! HIT! No fault.' },
            { step: 6, action: 'Page 3 arrives', outcome: 'FIFO evicts next oldest (0). Frames: [2, 3, 1]. Fault 5.' },
          ],
        },
        commonMistakes: [
          'Believing that LRU suffers from Belady\'s Anomaly. (LRU is a stack algorithm and mathematically CANNOT suffer from Belady\'s Anomaly; only FIFO and non-stack algorithms do).',
          'Assuming that optimal page replacement can be implemented directly on a PC (it requires future knowledge of memory accesses).',
        ],
        quickRevision: [
          'Page fault occurs when referenced page has valid bit = 0.',
          'FIFO evicts oldest page; can exhibit Belady\'s Anomaly.',
          'Optimal evicts page unused for longest future time (theoretical benchmark).',
          'LRU evicts least recently accessed page (practical gold standard).',
          'Clock algorithm provides a fast hardware-friendly approximation of LRU.',
        ],
        simUrl: '/page-replacement',
        simLabel: 'Simulate Page Replacement in Lab',
        simCategory: 'Page Replacement',
        interactiveWidgetType: 'paging_demo',
        questions: [
          {
            id: 'u5-l3-q1',
            question: 'What is Belady’s Anomaly in page replacement?',
            options: ['Memory fragmentation grows exponentially', 'Allocating more page frames results in more page faults', 'CPU clock frequency drops', 'Page table size exceeds RAM capacity'],
            correctIndex: 1,
            explanation: 'Belady\'s Anomaly is the counterintuitive phenomenon where adding more physical frames increases the total number of page faults under FIFO.',
          },
          {
            id: 'u5-l3-q2',
            question: 'Which page replacement algorithm is immune to Belady’s Anomaly because it belongs to the class of stack algorithms?',
            options: ['FIFO', 'Second Chance', 'Least Recently Used (LRU)', 'First Fit'],
            correctIndex: 2,
            explanation: 'Stack algorithms like LRU and Optimal guarantee that the set of pages in an n-frame system is always a subset of an (n+1)-frame system.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // UNIT 6: I/O AND FILE MANAGEMENT
  // ============================================================
  {
    id: 'unit-6',
    number: 6,
    title: 'I/O & File Management',
    description: 'I/O buffering, disk structure, disk scheduling algorithms (FCFS, SSTF, SCAN, LOOK), file systems, and directory architectures.',
    iconName: 'HardDrive',
    color: 'text-amber-400 bg-amber-400/10 border-amber-500/30',
    lessons: [
      {
        id: 'u6-l1',
        unitId: 'unit-6',
        slug: 'io-buffering-and-device-management',
        title: 'I/O Hardware & Buffering Techniques',
        subtitle: 'Polling, Interrupts, DMA, Single/Double/Circular buffering, and Spooling',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        objectives: [
          'Differentiate Polling (busy-waiting), Interrupt-Driven I/O, and Direct Memory Access (DMA)',
          'Calculate performance speedup for Single, Double, and Circular Buffering',
          'Understand Spooling (Simultaneous Peripheral Operations On-Line)',
        ],
        definition: 'I/O Buffering is the technique of temporarily holding input or output data in kernel memory buffers to smooth out speed mismatches between fast CPUs and slow peripheral devices.',
        detailedExplanation: `1. I/O Transfer Mechanisms:
- Programmed I/O (Polling): CPU repeatedly reads the status register of the device controller until ready. Wastes massive CPU cycles.
- Interrupt-Driven I/O: CPU issues I/O command and continues executing other tasks. Device controller asserts an interrupt line when data is ready.
- Direct Memory Access (DMA): For high-speed bulk devices (disks, network cards). A dedicated DMA controller transfers entire data blocks directly between device and RAM without CPU intervention, interrupting only once per transfer block.

2. Buffering Techniques:
- Unbuffered I/O: CPU waits for device on every byte.
- Single Buffering: OS assigns one memory buffer. Device fills buffer while CPU processes previous data. Execution time per block is approximately max(T, C) + M where T is transfer time, C is computation time, M is buffer-to-user memory copy.
- Double Buffering (Ping-Pong): Two buffers. While CPU processes Buffer A, device fills Buffer B. Decouples producer and consumer.
- Circular Buffering: A queue of two or more buffers managed with head and tail pointers for bursty traffic.

3. Spooling (Simultaneous Peripheral Operations On-Line):
Intercepts data targeted for a dedicated unshareable device (such as a printer) and stores it on a disk queue so multiple processes can output concurrently without interleaving pages.`,
        whyNeeded: 'CPUs operate in nanoseconds while mechanical disks operate in milliseconds (a 1,000,000x speed difference). Buffering bridges this speed gap.',
        howItWorks: 'The DMA controller takes over the system memory bus during "cycle stealing" intervals, moving data blocks directly into kernel buffer rings.',
        analogy: 'Watching YouTube over a slow internet connection. If the player was unbuffered, video would stutter on every frame. YouTube pre-loads 30 seconds of video into a buffer so playback remains silky smooth despite network fluctuations.',
        applications: [
          'Print spooler servers handling multi-user office print queues',
          'High-speed 10Gbps NIC ring buffers in cloud datacenters',
        ],
        workedExample: {
          title: 'Single Buffering vs Double Buffering Performance',
          description: 'Disk transfer time T = 100 us, CPU computation C = 80 us, copy M = 20 us.',
          steps: [
            { step: 1, action: 'Calculate time per block without buffering', outcome: 'Total time = T + C = 100 + 80 = 180 us per block.' },
            { step: 2, action: 'Calculate time with Single Buffering', outcome: 'Time = max(T, C) + M = max(100, 80) + 20 = 100 + 20 = 120 us (33% faster).' },
            { step: 3, action: 'Calculate time with Double Buffering', outcome: 'Time = max(T, C + M) = max(100, 100) = 100 us (44% faster, full overlap!).' },
          ],
        },
        commonMistakes: [
          'Thinking DMA requires the CPU to copy each byte (DMA transfers directly to RAM; the CPU is completely free during the transfer).',
          'Assuming infinite buffers eliminate all bottlenecks (if consumption rate is permanently lower than production rate, any buffer will eventually overflow).',
        ],
        quickRevision: [
          'Polling burns CPU; Interrupts notify when ready; DMA transfers bulk data directly to RAM.',
          'Double buffering allows parallel reading and processing.',
          'Spooling queues jobs for unshareable devices onto disk.',
        ],
        simUrl: '/io-buffer',
        simLabel: 'Simulate I/O Buffers in Lab',
        simCategory: 'I/O Buffering',
        interactiveWidgetType: 'buffer_demo',
        questions: [
          {
            id: 'u6-l1-q1',
            question: 'Which I/O data transfer technique transfers entire blocks of data directly between device controllers and RAM without continuous CPU intervention?',
            options: ['Programmed I/O', 'Direct Memory Access (DMA)', 'Spooling', 'Polling'],
            correctIndex: 1,
            explanation: 'DMA controllers transfer large blocks of data directly over the memory bus, interrupting the CPU only once when the entire transfer completes.',
          },
          {
            id: 'u6-l1-q2',
            question: 'What is the primary function of Spooling in operating systems?',
            options: ['Encrypting hard drive partitions', 'Queuing print and device jobs on disk so unshareable devices are not monopolized', 'Speeding up CPU clock cycles', 'Translating virtual addresses to physical frames'],
            correctIndex: 1,
            explanation: 'Spooling holds jobs in a disk queue for slow, non-shareable devices like printers.',
          },
        ],
      },
      {
        id: 'u6-l2',
        unitId: 'unit-6',
        slug: 'disk-scheduling-algorithms',
        title: 'Disk Scheduling Algorithms & Seek Optimization',
        subtitle: 'FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, and C-LOOK',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        objectives: [
          'Identify components of disk access latency: Seek Time, Rotational Latency, Transfer Time',
          'Simulate FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK algorithms',
          'Calculate Total Head Movement (Total Seek Distance) across cylinders',
          'Compare starvation risks and directional fairness',
        ],
        definition: 'Disk Scheduling is the policy used by the operating system to order pending disk I/O read/write requests, minimizing mechanical head movement (seek time) and maximizing disk bandwidth.',
        detailedExplanation: `Disk Access Time Components:
1. Seek Time: Time taken for the mechanical disk arm to position the read/write head over the desired cylinder track. (Dominant mechanical delay, approx 3-10 ms).
2. Rotational Latency: Time taken for the desired sector to rotate under the head (0.5 / RPM).
3. Transfer Time: Time to transfer the actual data bits.

Algorithms:
1. FCFS:
   - Services requests in the order they arrive.
   - Fair, no starvation, but wildly inefficient total head movement.
2. SSTF (Shortest Seek Time First):
   - Selects the request with the minimum seek distance from current head position.
   - Substantially reduces average seek time, but causes STARVATION of distant tracks if nearby requests keep arriving.
3. SCAN (Elevator Algorithm):
   - Disk arm starts at one end and moves toward the other end, servicing requests along the way until it hits the physical disk boundary (0 or Max Track), then reverses direction.
4. C-SCAN (Circular SCAN):
   - Treats tracks as a circular list. Arm moves in one direction servicing requests. When it reaches the end, it immediately returns to the beginning WITHOUT servicing any requests on the return trip. Provides more uniform waiting times.
5. LOOK and C-LOOK:
   - Practical optimization of SCAN / C-SCAN. The arm goes only as far as the FINAL request in each direction, reversing without traveling to the physical end of the disk platter.`,
        whyNeeded: 'Mechanical disk seeks take millions of CPU cycles. Efficient scheduling orders requests intelligently, turning chaotic random seeks into smooth directional sweeps.',
        howItWorks: 'The kernel maintains an ordered queue of cylinder numbers and dispatches requests to the disk controller in sorted sweeps.',
        analogy: 'An elevator in a 100-story building. If people on floors 20, 90, 22, 95 push buttons, a naive elevator (FCFS) would travel 20 -> 90 -> 22 -> 95. An intelligent elevator (LOOK) sweeps upward (20 -> 22 -> 90 -> 95) and then sweeps downward.',
        applications: [
          'Traditional spinning hard drives (HDDs)',
          'Elevator algorithms in modern database write-ahead log flushers',
        ],
        workedExample: {
          title: 'Comparing FCFS vs SSTF vs SCAN Seek Distances',
          description: 'Requests: 98, 183, 37, 122, 14, 124, 65, 67. Initial head = 53.',
          steps: [
            { step: 1, action: 'FCFS: 53 -> 98 -> 183 -> 37 -> 122 -> 14 -> 124 -> 65 -> 67', outcome: 'Total Head Movement = 45+85+146+85+108+110+59+2 = 640 cylinders!' },
            { step: 2, action: 'SSTF: 53 -> 65 -> 67 -> 37 -> 14 -> 98 -> 122 -> 124 -> 183', outcome: 'Total Head Movement = 12+2+30+23+84+24+2+59 = 236 cylinders! (63% reduction).' },
            { step: 3, action: 'SCAN (moving towards 199): 53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 -> 199 -> 37 -> 14', outcome: 'Total Head Movement = (199 - 53) + (199 - 14) = 146 + 185 = 331 cylinders.' },
            { step: 4, action: 'LOOK (moving towards max request 183): 53 -> 65 -> ... -> 183 -> 37 -> 14', outcome: 'Total Head Movement = (183 - 53) + (183 - 14) = 130 + 169 = 299 cylinders.' },
          ],
        },
        commonMistakes: [
          'Confusing SCAN with LOOK. (SCAN travels all the way to cylinder 0 or Max; LOOK reverses at the furthest request without traveling to the disk edge).',
          'Applying disk head seek algorithms to Solid State Drives (SSDs). (SSDs have flash memory with no moving heads; seek time is virtually zero, so wear-leveling and block queuing replace seek algorithms).',
        ],
        quickRevision: [
          'Seek time dominates disk access delay.',
          'SSTF picks closest track; causes starvation.',
          'SCAN moves end-to-end like an elevator.',
          'C-SCAN services in one direction only for uniform waiting time.',
          'LOOK / C-LOOK reverses at last request rather than disk boundary.',
        ],
        simUrl: '/disk',
        simLabel: 'Simulate Disk Schedulers in Lab',
        simCategory: 'Disk Scheduler',
        interactiveWidgetType: 'disk_demo',
        questions: [
          {
            id: 'u6-l2-q1',
            question: 'What is the primary difference between the SCAN and LOOK disk scheduling algorithms?',
            options: ['SCAN is preemptive while LOOK is not', 'LOOK reverses direction at the last request instead of going to the end of the disk', 'LOOK can only service odd cylinders', 'LOOK has higher seek time than FCFS'],
            correctIndex: 1,
            explanation: 'LOOK checks ahead and reverses as soon as there are no further requests in the current direction, avoiding unnecessary trips to the physical platter boundary.',
          },
          {
            id: 'u6-l2-q2',
            question: 'Which disk scheduling algorithm provides the most uniform waiting times by servicing requests in one direction only?',
            options: ['FCFS', 'SSTF', 'C-SCAN', 'FIFO'],
            correctIndex: 2,
            explanation: 'Circular SCAN (C-SCAN) treats the cylinders as a circular ring, servicing requests in one direction only so that all cylinders receive equal waiting intervals.',
          },
        ],
      },
      {
        id: 'u6-l3',
        unitId: 'unit-6',
        slug: 'file-systems-and-directory-structures',
        title: 'File Systems, Directory Structures & Allocation',
        subtitle: 'File attributes, Single/Two-level/Hierarchical directories, Contiguous, Linked, and Indexed allocation',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        objectives: [
          'Explain File concepts, attributes, and file access methods (Sequential vs Direct)',
          'Compare Single-level, Two-level, Tree-structured, and Acyclic-graph directories',
          'Evaluate Contiguous, Linked List, and Indexed File Allocation methods (Inodes)',
          'Understand Free-space management (Bit vectors and linked lists)',
        ],
        definition: 'A File System provides the persistent data structure and mechanism to store, organize, retrieve, and protect files on secondary storage.',
        detailedExplanation: `1. Directory Structures:
- Single-Level Directory: All files in the same directory. Name collisions occur immediately in multi-user systems.
- Two-Level Directory: Master file directory points to a separate user directory for each user.
- Tree-Structured (Hierarchical): Standard in modern OSes. Allows arbitrary nesting of subdirectories with absolute and relative paths.
- Acyclic-Graph Directory: Allows directories to share subdirectories and files (hard links and symbolic links). Requires reference counting or garbage collection.

2. File Allocation Methods (How disk blocks are allocated to a file):
- Contiguous Allocation: Each file occupies a contiguous set of blocks.
  - Advantages: Excellent sequential and direct access performance.
  - Disadvantages: Severe external fragmentation; file cannot easily grow.
- Linked Allocation: Each file is a linked list of disk blocks; each block contains a pointer to the next block.
  - Advantages: No external fragmentation; file grows easily.
  - Disadvantages: Extremely slow random/direct access (must traverse k pointers to reach block k); lost pointer corrupts entire remaining file.
- Indexed Allocation (UNIX Inode):
  - Each file has an Index Block (Inode) storing direct block pointers, single indirect pointers, double indirect pointers, and triple indirect pointers.
  - Combines fast random access with dynamic file growth and zero external fragmentation.`,
        whyNeeded: 'Disks only know raw sector numbers (Sector 0 to N). File systems translate human-readable paths like /home/student/project.c into physical disk block lists with security permissions.',
        howItWorks: 'An Inode contains metadata (size, owner, permissions, timestamps) and direct/indirect block address pointers pointing to physical disk blocks.',
        analogy: 'Contiguous allocation is like reserving 5 consecutive hotel rooms for a family. Linked allocation is a scavenger hunt where each room contains a note pointing to the next room across town. Indexed allocation is a central front-desk registry board listing all room numbers assigned to your group.',
        applications: [
          'Linux ext4, Btrfs, and ZFS file systems',
          'Windows NTFS and FAT32 file allocation tables',
        ],
        commonMistakes: [
          'Confusing hard links with soft/symbolic links. (A hard link points directly to the file Inode number; a symbolic link is a separate file containing the string path to another file).',
          'Assuming linked allocation is good for random database access (linked allocation requires sequential traversal from block 0).',
        ],
        quickRevision: [
          'Tree directory structure enables hierarchical subdirectories.',
          'Contiguous: fast access, severe external fragmentation.',
          'Linked: no fragmentation, terrible random access.',
          'Indexed (Inodes): fast random access + dynamic growth (used in UNIX/Linux).',
        ],
        simUrl: '/dashboard',
        simLabel: 'Explore System File & Disk Dashboard',
        simCategory: 'Digital Twin',
        interactiveWidgetType: 'system_call_flow',
        questions: [
          {
            id: 'u6-l3-q1',
            question: 'Which file allocation method suffers from terrible random/direct access because accessing block k requires following k-1 sequential disk pointers?',
            options: ['Contiguous Allocation', 'Linked Allocation', 'Indexed Allocation', 'Inode Allocation'],
            correctIndex: 1,
            explanation: 'Linked allocation stores the pointer to block k+1 inside block k, requiring sequential traversal from the beginning.',
          },
          {
            id: 'u6-l3-q2',
            question: 'How do UNIX file systems support very large files while keeping index blocks small for tiny files?',
            options: ['Using only contiguous blocks', 'Multi-level indexing with Direct, Single Indirect, and Double Indirect pointers in the Inode', 'By compressing files automatically', 'By storing files in the BIOS'],
            correctIndex: 1,
            explanation: 'UNIX Inodes combine direct pointers for fast small file access with single, double, and triple indirect pointers for large files.',
          },
        ],
      },
    ],
  },
];

// Helper utilities for the curriculum
export function getAllLessons(): Lesson[] {
  return CURRICULUM.flatMap(u => u.lessons);
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find(l => l.id === id || l.slug === id);
}

export function getUnitById(id: string): Unit | undefined {
  return CURRICULUM.find(u => u.id === id);
}

export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentLessonId || l.slug === currentLessonId);
  if (idx !== -1 && idx < all.length - 1) {
    return all[idx + 1];
  }
  return undefined;
}

export function getPrevLesson(currentLessonId: string): Lesson | undefined {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentLessonId || l.slug === currentLessonId);
  if (idx > 0) {
    return all[idx - 1];
  }
  return undefined;
}
