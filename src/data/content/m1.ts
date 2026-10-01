import type { Topic } from '../types'
const c = String.raw

export const M1: Topic[] = [
  {
    id: 'm1-1',
    title: 'Basic Computer Organization',
    intro: [
      'A computer is a machine that accepts data, processes it by following instructions, stores the result and presents it back to you. Every computer, from a phone to a supercomputer, is organised around the same five functional units: input, output, memory, the arithmetic logic unit (ALU) and the control unit (CU).',
      'The ALU and the CU together form the central processing unit (CPU). The CU fetches an instruction from memory, decodes it and tells the other units what to do. The ALU performs arithmetic (add, subtract) and logic (compare, AND, OR). This repeating loop is called the fetch-decode-execute cycle, and it is the heartbeat of every program you will write in C.',
      'Most modern machines follow the von Neumann architecture: instructions and data live in the same memory. That is why a C program can hold both code and variables in RAM, and why a bug can sometimes overwrite either.',
    ],
    syntax: {
      lang: 'txt',
      caption: 'Block diagram of a stored-program computer',
      code: c`  +---------+      +---------------------------+      +----------+
  |  INPUT  | ---> |   CPU                     | ---> |  OUTPUT  |
  | keyboard|      |  +-----+     +---------+  |      | monitor  |
  | mouse   |      |  | CU  | <-> |   ALU   |  |      | printer  |
  +---------+      |  +-----+     +---------+  |      +----------+
                   |  registers (PC, IR, ACC)  |
                   +-------------^-------------+
                                 |  address / data / control buses
                   +-------------v-------------+
                   |  MEMORY (RAM) + STORAGE   |
                   +---------------------------+`,
    },
    examples: [
      {
        title: 'Asking the machine about itself',
        code: c`#include <stdio.h>

int main() {
    printf("int     : %zu bytes\n", sizeof(int));
    printf("pointer : %zu bytes\n", sizeof(void *));
    return 0;
}`,
        notes: [
          'sizeof reports how many bytes a type occupies in memory, a direct view of how the hardware stores values.',
          'A pointer is a memory address. On a 64-bit machine it is 8 bytes because addresses are 64 bits wide.',
          '%zu is the printf format for the size_t value that sizeof returns.',
        ],
      },
      {
        title: 'Fetch-decode-execute by hand',
        lang: 'txt',
        code: c`Program in memory:
  100: LOAD  7     ; ACC <- 7
  101: ADD   5     ; ACC <- ACC + 5
  102: STORE 200   ; memory[200] <- ACC

PC=100  fetch "LOAD 7"   -> IR   decode -> execute -> ACC = 7    PC=101
PC=101  fetch "ADD 5"    -> IR   decode -> execute -> ACC = 12   PC=102
PC=102  fetch "STORE 200"-> IR   decode -> execute -> mem[200]=12`,
        notes: [
          'PC (program counter) holds the address of the next instruction.',
          'IR (instruction register) holds the instruction currently being decoded.',
          'ACC (accumulator) is a register inside the ALU that holds intermediate results.',
        ],
      },
    ],
    mistakes: [
      'Confusing the CPU with the whole computer. The CPU is only the ALU, the control unit and registers.',
      'Thinking memory and storage are the same. RAM loses its contents when power is off; a disk does not.',
      'Assuming data and instructions are stored separately. In a von Neumann machine they share one memory.',
    ],
    takeaways: [
      'Five units: input, output, memory, ALU, control unit. CPU = ALU + CU.',
      'Programs run through the fetch-decode-execute cycle.',
      'Registers are the fastest storage, located inside the CPU.',
      'sizeof lets a C program observe how the hardware lays out data.',
    ],
  },
  {
    id: 'm1-2',
    title: 'Computer Hardware Components',
    intro: [
      'Hardware is everything you can physically touch. The core components are the processor (CPU), main memory, storage devices, input devices, output devices and the motherboard that connects them all through buses.',
      'The CPU speed is measured in gigahertz (GHz) - billions of clock cycles per second - and by how many cores it has. Each core can run its own stream of instructions. A small, very fast memory called cache sits between the CPU and RAM to avoid waiting on the slower main memory.',
      'Input devices (keyboard, mouse, scanner, microphone) turn the physical world into binary data. Output devices (monitor, printer, speakers) do the reverse. Storage devices (HDD, SSD) keep data permanently. The GPU is a specialised processor for graphics and highly parallel maths.',
    ],
    syntax: {
      lang: 'txt',
      caption: 'Unit hierarchy used to describe hardware capacity',
      code: c`1 bit   = 0 or 1
1 byte  = 8 bits
1 KB    = 1024 bytes
1 MB    = 1024 KB
1 GB    = 1024 MB
1 TB    = 1024 GB`,
    },
    examples: [
      {
        title: 'Converting storage units in C',
        code: c`#include <stdio.h>

int main() {
    long long kb = 64;            /* a 64 KB program */
    long long bytes = kb * 1024;
    long long bits = bytes * 8;
    printf("%lld KB = %lld bytes = %lld bits\n", kb, bytes, bits);
    return 0;
}`,
        notes: [
          'long long guarantees at least 64 bits, safe for big hardware sizes.',
          'Each step multiplies by the conversion factor: x1024 for KB to bytes, x8 for bytes to bits.',
          '%lld prints a long long integer.',
        ],
      },
      {
        title: 'Inspecting the CPU on Linux',
        lang: 'sh',
        code: c`lscpu | head -n 8        # CPU model, cores, clock speed
free -h                  # total and used RAM
lsblk                    # storage devices`,
        notes: [
          'lscpu prints the architecture, number of cores and the model name.',
          'free -h shows RAM in human-readable units.',
          'lsblk lists disks and partitions - the secondary storage.',
        ],
      },
    ],
    mistakes: [
      'Mixing up 1 KB = 1000 bytes (disk marketing) with 1 KB = 1024 bytes (memory and most programming contexts).',
      'Comparing GHz across different CPU designs. A higher clock does not always mean a faster processor.',
      'Forgetting that a byte is 8 bits when converting between bits and bytes.',
    ],
    takeaways: [
      'Main parts: CPU, RAM, storage, input, output, motherboard, buses.',
      'Clock speed (GHz) and core count describe CPU capability.',
      'Cache is a tiny, fast memory that hides RAM latency.',
      'Always convert units step by step: bits, bytes, KB, MB, GB.',
    ],
  },
  {
    id: 'm1-3',
    title: 'Primary Memory (RAM, ROM) and Secondary Memory',
    intro: [
      'Primary memory is what the CPU can access directly. RAM (Random Access Memory) is volatile read/write memory that holds the programs and data currently running. When the power goes off, RAM is erased. ROM (Read-Only Memory) is non-volatile and stores firmware such as the boot loader that starts the computer.',
      'Secondary memory - hard disks, SSDs, USB drives, optical discs - is much larger and cheaper per byte, and it keeps data permanently, but it is far slower than RAM. A program must be loaded from secondary memory into RAM before the CPU can run it.',
      'The memory hierarchy balances speed against size: registers, then cache, then RAM, then SSD/HDD. Each step down is bigger, cheaper and slower. In C, every variable you declare lives in RAM (or in a register), and every file you open lives on secondary storage.',
    ],
    syntax: {
      lang: 'txt',
      caption: 'Memory hierarchy (fastest and smallest at the top)',
      code: c`Registers      ~ bytes     ~ <1 ns     inside CPU
Cache (L1-L3)  ~ KB - MB   ~ 1-10 ns   on CPU chip
RAM            ~ GB        ~ 100 ns    primary, volatile
SSD / HDD      ~ 100s GB+  ~ 0.1-10 ms secondary, permanent`,
    },
    examples: [
      {
        title: 'Variables live in RAM',
        code: c`#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    printf("a is stored at %p\n", (void *)&a);
    printf("b is stored at %p\n", (void *)&b);
    return 0;
}`,
        notes: [
          '&a is the address of a - its location in RAM.',
          'The %p format prints an address; the cast to void * is the portable way to do it.',
          'The exact address changes between runs because the operating system places programs in different RAM regions.',
        ],
      },
      {
        title: 'Data moves from secondary memory to RAM',
        code: c`#include <stdio.h>

int main() {
    FILE *f = fopen("notes.txt", "w");   /* secondary memory */
    fprintf(f, "saved forever\n");
    fclose(f);

    char line[50];                        /* RAM */
    f = fopen("notes.txt", "r");
    fgets(line, sizeof line, f);
    fclose(f);
    printf("Loaded into RAM: %s", line);
    return 0;
}`,
        notes: [
          'fopen/fprintf write bytes to a file on disk, which survives program exit.',
          'line[50] is an array in RAM and vanishes when the program ends.',
          'fgets reads from the file into RAM so the CPU can work with it.',
        ],
      },
    ],
    mistakes: [
      'Saying RAM is permanent. It is volatile - unsaved data is lost on power failure.',
      'Believing ROM can never change. Modern firmware chips (flash/EEPROM) can be rewritten, but only rarely.',
      'Expecting variables to survive after the program ends. Only data written to files persists.',
    ],
    takeaways: [
      'RAM: volatile, fast, read/write. ROM: non-volatile, holds boot firmware.',
      'Secondary memory is large and permanent but slow.',
      'The CPU only executes programs that are in RAM.',
      'Faster memory is smaller and costlier, hence the hierarchy.',
    ],
  },
  {
    id: 'm1-4',
    title: 'Types of Software',
    intro: [
      'Software is the set of instructions that tells hardware what to do. It splits into two broad families. System software manages the computer itself: operating systems, device drivers, firmware and utilities. Application software helps the user do a task: a browser, a word processor, a game.',
      'Between the two sits programming software - editors, compilers, debuggers and IDEs - the tools you will use to write C. Middleware and embedded software are also common categories: the program inside a washing machine or a car engine controller is embedded software, and C is the dominant language for it.',
      'Software can also be classified by licence: proprietary (source hidden, usage restricted), open source (source available, like Linux and GCC), freeware and shareware.',
    ],
    syntax: {
      lang: 'txt',
      caption: 'Software classification',
      code: c`Software
 |-- System software      (OS, device drivers, firmware, utilities)
 |-- Programming software (editor, compiler, debugger, IDE)
 '-- Application software (browser, office suite, games, ERP)`,
    },
    examples: [
      {
        title: 'Your C program is application software',
        code: c`#include <stdio.h>

int main() {
    printf("I am application software.\n");
    printf("The OS loads and schedules me.\n");
    return 0;
}`,
        notes: [
          'A C program you write is application software.',
          'It cannot run alone. The operating system loads it into RAM and gives it CPU time.',
          'printf is a library function that ultimately asks the OS to write to the screen.',
        ],
      },
      {
        title: 'Tools of the programmer',
        lang: 'sh',
        code: c`gcc --version        # compiler    (programming software)
uname -a             # kernel info (system software)
ls /usr/include      # header files used by C programs`,
        notes: [
          'gcc is programming software: it translates C into machine code.',
          'uname reports the operating system kernel, the core of system software.',
          'The /usr/include folder holds headers such as stdio.h that your programs include.',
        ],
      },
    ],
    mistakes: [
      'Calling the compiler "system software". It is classified as programming software (a system tool for developers).',
      'Treating firmware as hardware. Firmware is software stored in ROM or flash.',
      'Assuming "open source" means "free of cost" in every case. It refers to access to the source code and the licence.',
    ],
    takeaways: [
      'System software runs the machine; application software serves the user.',
      'Programming software (compilers, IDEs) turns source code into programs.',
      'Embedded software lives inside devices, and C is its favourite language.',
      'Licences differ: proprietary, open source, freeware, shareware.',
    ],
  },
  {
    id: 'm1-5',
    title: 'Compilers, Interpreters, Assembler, Linker, Loader',
    intro: [
      'The CPU only understands machine code - binary patterns. Language translators bridge the gap from human-readable code. A compiler translates the entire program into machine code before it runs and reports errors for the whole file. An interpreter translates and executes one statement at a time. An assembler converts assembly language (mnemonics such as MOV and ADD) into machine code.',
      'Building a C program is a pipeline: the preprocessor expands #include and #define, the compiler produces assembly, the assembler produces an object file (.o), and the linker joins your object files with library code (like printf) to make one executable. Finally, the loader, which is part of the operating system, copies the executable into RAM and starts it.',
      'Because C is compiled, running a C program is fast, but you must recompile after every change. Interpreted languages skip that step at the cost of speed.',
    ],
    syntax: {
      lang: 'sh',
      caption: 'The classic build pipeline, step by step',
      code: c`gcc -E main.c -o main.i    # 1. preprocess
gcc -S main.i -o main.s    # 2. compile  -> assembly
gcc -c main.s -o main.o    # 3. assemble -> object file
gcc main.o -o main         # 4. link     -> executable
./main                     # 5. loader puts it in RAM and runs it`,
    },
    examples: [
      {
        title: 'One file through the pipeline',
        code: c`#include <stdio.h>
#define GREETING "Hello, pipeline"

int main() {
    printf("%s\n", GREETING);
    return 0;
}`,
        notes: [
          'The preprocessor pastes the contents of stdio.h and replaces GREETING with the string.',
          'The compiler checks syntax and types and emits assembly for main.',
          'The linker connects the call to printf with the real code in the C library.',
        ],
      },
      {
        title: 'A linker error vs a compiler error',
        code: c`#include <stdio.h>

void helper(void);        /* declared, never defined */

int main() {
    helper();
    return 0;
}
/* gcc: undefined reference to 'helper'  <- reported by the LINKER */`,
        notes: [
          'The compiler is satisfied: the prototype tells it helper exists somewhere.',
          'The linker cannot find the body of helper in any object file or library.',
          'A syntax error (such as a missing semicolon) would be reported earlier, by the compiler.',
        ],
      },
    ],
    mistakes: [
      'Mixing up compile-time errors (syntax, types) with link-time errors (missing definitions).',
      'Thinking the compiler produces the final executable on its own. The linker creates it.',
      'Believing the loader is part of your program. It is part of the operating system.',
    ],
    takeaways: [
      'Compiler: whole program at once. Interpreter: line by line. Assembler: assembly to machine code.',
      'Linker joins object files and libraries into an executable.',
      'Loader copies the executable into RAM and starts it.',
      'Pipeline: preprocess, compile, assemble, link, load.',
    ],
  },
  {
    id: 'm1-6',
    title: 'Introduction to C compilers and their versions',
    intro: [
      'A C compiler is the tool that turns your .c file into an executable. Popular compilers are GCC (GNU Compiler Collection), Clang (LLVM), MSVC (Microsoft Visual C++) and Turbo C, an old DOS compiler still found in some classrooms. This course uses GCC, which is free and available on Linux, macOS and Windows.',
      'The language itself is standardised. K&R C (1978) was the original informal definition. ANSI C / C89 (also called C90) was the first official standard. C99 added // comments, long long, variable-length arrays and declarations in the middle of blocks. C11 added multithreading and _Generic. C17 was a bug-fix release and C23 is the newest standard.',
      'You choose the standard with a compiler flag. Writing -std=c11 and -Wall -Wextra turns on the rules and the helpful warnings that catch many bugs before the program ever runs.',
    ],
    syntax: {
      lang: 'sh',
      caption: 'Compile with a chosen standard and warnings',
      code: c`gcc -std=c11 -Wall -Wextra -o app main.c
#   -std=c11   use the C11 language standard
#   -Wall      enable common warnings
#   -o app     name the output executable "app"`,
    },
    examples: [
      {
        title: 'Which standard am I compiling with?',
        code: c`#include <stdio.h>

int main() {
#ifdef __STDC_VERSION__
    printf("__STDC_VERSION__ = %ld\n", __STDC_VERSION__);
#else
    printf("Pre-C95 compiler\n");
#endif
    return 0;
}`,
        notes: [
          '__STDC_VERSION__ is a predefined macro: 199901L for C99, 201112L for C11, 201710L for C17.',
          '#ifdef lets the same source adapt to older compilers.',
          'The value is a long, so it is printed with %ld.',
        ],
      },
      {
        title: 'A C99 feature in action',
        code: c`#include <stdio.h>

int main() {
    // single-line comments need C99 (or a C++ comment extension)
    for (int i = 1; i <= 3; i++) {   /* i declared inside for: C99 */
        printf("%d ", i);
    }
    printf("\n");
    return 0;
}`,
        notes: [
          'In C89 you must declare i at the top of the block and use only /* */ comments.',
          'Declaring the loop variable in the for statement limits its scope to the loop.',
          'Compile with -std=c89 -pedantic to see these features rejected.',
        ],
      },
    ],
    mistakes: [
      'Using C99 features on an old Turbo C compiler and being surprised by errors.',
      'Ignoring warnings. -Wall warnings often point at real bugs such as uninitialised variables.',
      'Forgetting -o, so the executable is named a.out and you run the wrong file.',
    ],
    takeaways: [
      'Common compilers: GCC, Clang, MSVC, Turbo C.',
      'Standards: K&R, C89/C90, C99, C11, C17, C23.',
      'Use -std=... and -Wall to control the language level and catch bugs.',
      'The same source can adapt using predefined macros like __STDC_VERSION__.',
    ],
  },
  {
    id: 'm1-7',
    title: 'Operating System: concepts, functions, and types',
    intro: [
      'An operating system (OS) is the software that manages hardware and provides services to programs. It sits between the user, the applications and the hardware. Examples are Linux, Windows, macOS, Android and iOS.',
      'Its main functions are process management (creating, scheduling and ending programs), memory management (giving each process its own RAM), file management (organising data on disks), device management (talking to hardware through drivers), security and a user interface (a command line or graphical shell).',
      'By style, operating systems are batch (jobs run in groups without interaction), time-sharing or multitasking (the CPU switches quickly between programs), multiprocessing (several CPUs), real-time (guaranteed response times, used in aircraft and medical devices), distributed and network OSs, and mobile or embedded OSs. Most of the Unix and Linux kernels are written in C.',
    ],
    syntax: {
      lang: 'txt',
      caption: 'Where the OS sits',
      code: c`  User
   |
  Applications (your C programs, browser, ...)
   |       system calls: open, read, write, fork
  Operating System (kernel)
   |       device drivers
  Hardware (CPU, RAM, disk, network)`,
    },
    examples: [
      {
        title: 'Asking the OS for the process id',
        code: c`#include <stdio.h>
#include <unistd.h>

int main() {
    printf("My process id is %d\n", (int)getpid());
    return 0;
}`,
        notes: [
          'getpid is a system call: your program requests a service from the OS kernel.',
          'Every running program is a process with a unique id assigned by the OS.',
          'unistd.h is a POSIX header, available on Linux and macOS.',
        ],
      },
      {
        title: 'Round-robin CPU scheduling (time sharing)',
        lang: 'txt',
        code: c`Processes: P1 needs 5 ms, P2 needs 3 ms     time slice = 2 ms

0-2  P1 (3 left)
2-4  P2 (1 left)
4-6  P1 (1 left)
6-7  P2 done
7-8  P1 done`,
        notes: [
          'Each process receives a short slice of CPU time in turn.',
          'Switching is so fast that users feel programs run at the same time.',
          'A process that finishes early (P2 at 7 ms) leaves the queue.',
        ],
      },
    ],
    mistakes: [
      'Thinking the OS and the kernel are exactly the same. The kernel is the core; the OS also includes shells, tools and libraries.',
      'Confusing multitasking (many programs on one CPU) with multiprocessing (many CPUs).',
      'Assuming a program accesses hardware directly. It goes through the OS via system calls.',
    ],
    takeaways: [
      'The OS manages processes, memory, files, devices and security.',
      'Types: batch, time-sharing, multiprocessing, real-time, distributed, mobile.',
      'Programs use system calls (like getpid) to request OS services.',
      'Linux and Unix kernels are largely written in C.',
    ],
  },
]
