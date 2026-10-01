import { mk, c } from './helper'

export const P1 = [
  mk({
    id: 'kb-to-bytes',
    module: 'm1',
    level: 'Easy',
    title: 'Kilobytes to Bytes and Bits',
    statement:
      'A program occupies a given number of kilobytes in memory. Using 1 KB = 1024 bytes and 1 byte = 8 bits, print its size in bytes and in bits.',
    input: 'A single integer KB.',
    output: 'Two lines: "Bytes: X" and "Bits: Y".',
    constraints: ['0 <= KB <= 1000000'],
    tests: [
      ['1', 'Bytes: 1024\nBits: 8192'],
      ['4', 'Bytes: 4096\nBits: 32768'],
      ['64', 'Bytes: 65536\nBits: 524288'],
      ['0', 'Bytes: 0\nBits: 0'],
      ['1000000', 'Bytes: 1024000000\nBits: 8192000000'],
    ],
    why: ['1 KB is 1024 bytes, which is 1024 x 8 = 8192 bits.', '4 x 1024 = 4096 bytes and 4096 x 8 = 32768 bits.'],
    hints: [
      'Use two successive multiplications: KB to bytes, then bytes to bits.',
      'For the largest input the bit count exceeds 2^31. Which type holds it?',
      'Declare the variable as long long and print with %lld.',
    ],
    solution: c`#include <stdio.h>

int main() {
    long long kb;
    scanf("%lld", &kb);
    long long bytes = kb * 1024;
    printf("Bytes: %lld\n", bytes);
    printf("Bits: %lld\n", bytes * 8);
    return 0;
}`,
    explanation: 'Each unit conversion is a multiplication. long long avoids overflow because 8,192,000,000 does not fit in a 32-bit int.',
    keywords: ['scanf', 'printf', '1024'],
  }),
  mk({
    id: 'fit-in-ram',
    module: 'm1',
    level: 'Easy',
    title: 'Does It Fit in RAM?',
    statement:
      'The CPU can only run programs that are loaded in RAM. Given the size of a program and the size of RAM (both in MB), print "Fits" if the program can be loaded and "Too large" otherwise.',
    input: 'Two integers: program size and RAM size in MB.',
    output: 'Fits or Too large.',
    constraints: ['0 <= size, ram <= 100000'],
    tests: [
      ['512 1024', 'Fits'],
      ['2048 1024', 'Too large'],
      ['1024 1024', 'Fits'],
      ['1 0', 'Too large'],
      ['0 0', 'Fits'],
    ],
    why: ['512 MB is smaller than 1024 MB of RAM.', '2048 MB exceeds the 1024 MB available.'],
    hints: [
      'This is a single comparison between two numbers.',
      'Equal sizes still fit.',
      'Use if (size <= ram) printf("Fits"); else printf("Too large");',
    ],
    solution: c`#include <stdio.h>

int main() {
    int size, ram;
    scanf("%d %d", &size, &ram);
    if (size <= ram) printf("Fits\n");
    else printf("Too large\n");
    return 0;
}`,
    explanation: 'A program fits when its size is less than or equal to the RAM. The <= matters for the boundary case.',
    keywords: ['scanf', 'printf', 'if'],
  }),
  mk({
    id: 'program-words',
    module: 'm1',
    level: 'Easy',
    title: 'Program Size in Words',
    statement:
      'A machine has a 4-byte word. Given the size of a program in bytes, print how many whole words of memory it needs (a partly filled word still counts).',
    input: 'One integer: the size in bytes.',
    output: 'The number of words.',
    constraints: ['0 <= bytes <= 1000000000'],
    tests: [
      ['10', '3'],
      ['16', '4'],
      ['0', '0'],
      ['1', '1'],
      ['4001', '1001'],
    ],
    why: ['10 bytes need 2.5 words, rounded up to 3.', '16 bytes fit exactly in 4 words.'],
    hints: [
      'You need the ceiling of bytes / 4, but integer division truncates.',
      'Adding (divisor - 1) before dividing turns truncation into rounding up.',
      'Print (bytes + 3) / 4.',
    ],
    solution: c`#include <stdio.h>

int main() {
    long long b;
    scanf("%lld", &b);
    printf("%lld\n", (b + 3) / 4);
    return 0;
}`,
    explanation: 'Integer division floors the result. Adding 3 before dividing by 4 makes any remainder push the quotient up by one, which is a ceiling.',
    keywords: ['scanf', 'printf', '/'],
  }),
  mk({
    id: 'decimal-to-binary',
    module: 'm1',
    level: 'Medium',
    title: 'Decimal to Binary',
    statement: 'Computers store numbers in binary. Read a non-negative integer and print its binary representation without leading zeros. Zero prints as 0.',
    input: 'One integer n.',
    output: 'The binary digits of n.',
    constraints: ['0 <= n <= 1000000000'],
    tests: [
      ['10', '1010'],
      ['1', '1'],
      ['0', '0'],
      ['255', '11111111'],
      ['1024', '10000000000'],
    ],
    why: ['10 = 8 + 2, which is 1010 in binary.', '1 is the single bit 1.'],
    hints: [
      'Repeatedly dividing by 2 gives the bits, starting from the least significant one.',
      'Store the remainders in an array. They come out in reverse order.',
      'Handle n == 0 separately, then print the array from the end to the start.',
    ],
    solution: c`#include <stdio.h>

int main() {
    int n, bits[32], k = 0;
    scanf("%d", &n);
    if (n == 0) { printf("0\n"); return 0; }
    while (n > 0) {
        bits[k++] = n % 2;
        n /= 2;
    }
    for (int i = k - 1; i >= 0; i--) printf("%d", bits[i]);
    printf("\n");
    return 0;
}`,
    explanation: 'n % 2 is the lowest bit and n / 2 shifts the number right. Because the lowest bit is found first, the array is printed backwards.',
    keywords: ['scanf', 'printf', '%\\s*2'],
  }),
  mk({
    id: 'binary-to-decimal',
    module: 'm1',
    level: 'Medium',
    title: 'Binary to Decimal',
    statement: 'Read a binary number given as a string of 0s and 1s and print its decimal value.',
    input: 'A string of at most 31 characters, each 0 or 1.',
    output: 'The decimal value.',
    constraints: ['1 <= length <= 31'],
    tests: [
      ['1010', '10'],
      ['11111111', '255'],
      ['0', '0'],
      ['100000', '32'],
      ['1101101', '109'],
    ],
    why: ['1010 = 8 + 0 + 2 + 0 = 10.', 'Eight ones equal 128 + 64 + ... + 1 = 255.'],
    hints: [
      'Read the number as a string with scanf("%s").',
      'Process characters left to right: value = value * 2 + digit.',
      'The digit is s[i] - \'0\'.',
    ],
    solution: c`#include <stdio.h>

int main() {
    char s[40];
    scanf("%39s", s);
    int value = 0;
    for (int i = 0; s[i] != '\0'; i++)
        value = value * 2 + (s[i] - '0');
    printf("%d\n", value);
    return 0;
}`,
    explanation: 'Each new bit shifts everything so far one place left (x2) and adds the new bit. This is Horner\'s method.',
    keywords: ['scanf', 'printf', '\\*\\s*2'],
  }),
  mk({
    id: 'count-set-bits',
    module: 'm1',
    level: 'Medium',
    title: 'Count Set Bits',
    statement: 'Memory stores numbers as bits. Count how many bits are 1 in the binary form of a non-negative integer.',
    input: 'One integer n.',
    output: 'The number of 1 bits.',
    constraints: ['0 <= n <= 2147483647'],
    tests: [
      ['7', '3'],
      ['8', '1'],
      ['0', '0'],
      ['255', '8'],
      ['2147483647', '31'],
    ],
    why: ['7 is 111, three set bits.', '8 is 1000, only one set bit.'],
    hints: [
      'Test the lowest bit with n & 1.',
      'Shift n right by one each step with n >>= 1.',
      'Stop when n becomes 0.',
    ],
    solution: c`#include <stdio.h>

int main() {
    unsigned int n;
    int count = 0;
    scanf("%u", &n);
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    printf("%d\n", count);
    return 0;
}`,
    explanation: 'n & 1 isolates the lowest bit (0 or 1) and the right shift moves the next bit into place. The loop ends when no set bits remain.',
    keywords: ['scanf', 'printf', '&|%'],
  }),
  mk({
    id: 'twos-complement',
    module: 'm1',
    level: 'Hard',
    title: "Two's Complement (8-bit)",
    statement: "Computers store negative integers in two's complement form. Print the 8-bit two's complement representation of an integer between -128 and 127.",
    input: 'One integer n.',
    output: 'Exactly 8 characters, each 0 or 1.',
    constraints: ['-128 <= n <= 127'],
    tests: [
      ['5', '00000101'],
      ['-1', '11111111'],
      ['-128', '10000000'],
      ['0', '00000000'],
      ['-5', '11111011'],
      ['127', '01111111'],
    ],
    why: ['5 is 101, padded to 8 bits.', '-1 is all ones: invert 00000001 to 11111110 and add 1.'],
    hints: [
      'Converting to unsigned char gives you the 8-bit pattern automatically.',
      'Print bits from position 7 down to 0.',
      'The bit at position i is (u >> i) & 1.',
    ],
    solution: c`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    unsigned char u = (unsigned char)n;
    for (int i = 7; i >= 0; i--)
        putchar('0' + ((u >> i) & 1));
    putchar('\n');
    return 0;
}`,
    explanation: 'Casting to unsigned char reduces the value modulo 256, which is exactly the two\'s complement bit pattern. Then each bit is extracted with a shift and mask, most significant first.',
    keywords: ['scanf', '>>|%', 'putchar|printf'],
  }),
  mk({
    id: 'round-robin',
    module: 'm1',
    level: 'Hard',
    title: 'Round Robin Scheduler',
    statement:
      'An operating system shares the CPU with round-robin scheduling. All processes arrive at time 0 and are served in order, each for at most q time units per turn. A process that is not finished goes to the back of the queue. Compute the average waiting time (completion time minus burst time).',
    input: 'First line: n and q. Second line: n burst times.',
    output: 'The average waiting time with 2 decimal places.',
    constraints: ['1 <= n <= 50', '1 <= q <= 20', '1 <= burst <= 100'],
    tests: [
      ['3 2\n5 3 1', '4.33'],
      ['2 4\n3 5', '1.50'],
      ['1 3\n10', '0.00'],
      ['4 3\n6 4 2 8', '9.25'],
    ],
    why: ['P3 finishes at 5, P2 at 8 and P1 at 9. Waiting times are 4, 5 and 4, so the average is 13/3.', 'P1 finishes at 3 with no waiting; P2 finishes at 8 after burst 5, so it waited 3.'],
    hints: [
      'Keep an array of remaining times and a clock t.',
      'Loop over the processes cyclically; give each min(q, remaining) time.',
      'When a process finishes, its waiting time is t - burst.',
    ],
    solution: c`#include <stdio.h>

int main() {
    int n, q, burst[60], rem[60];
    scanf("%d %d", &n, &q);
    for (int i = 0; i < n; i++) { scanf("%d", &burst[i]); rem[i] = burst[i]; }

    int t = 0, done = 0;
    double totalWait = 0;
    while (done < n) {
        for (int i = 0; i < n; i++) {
            if (rem[i] == 0) continue;
            int slice = rem[i] < q ? rem[i] : q;
            t += slice;
            rem[i] -= slice;
            if (rem[i] == 0) {
                done++;
                totalWait += t - burst[i];
            }
        }
    }
    printf("%.2f\n", totalWait / n);
    return 0;
}`,
    explanation: 'Because every process arrives at time 0, scanning the array cyclically reproduces the queue order. The waiting time of a process is its completion time minus its own burst.',
    keywords: ['scanf', 'printf', 'while|for'],
  }),
  mk({
    id: 'fde-simulator',
    module: 'm1',
    level: 'Hard',
    title: 'Fetch-Decode-Execute Simulator',
    statement:
      'Simulate a tiny CPU with one accumulator register that starts at 0. The program supports LOAD v (acc = v), ADD v, SUB v, MUL v, and OUT (print the accumulator). Execute the instructions in order.',
    input: 'First line: n, the number of instructions. Then n lines, each an opcode and, except for OUT, an integer.',
    output: 'One line for every OUT instruction.',
    constraints: ['1 <= n <= 100', 'The accumulator always fits in a 32-bit int'],
    tests: [
      ['5\nLOAD 7\nADD 5\nOUT\nMUL 2\nOUT', '12\n24'],
      ['4\nLOAD 10\nSUB 3\nOUT\nOUT', '7\n7'],
      ['1\nOUT', '0'],
      ['6\nLOAD 5\nOUT\nSUB 9\nOUT\nADD 4\nOUT', '5\n-4\n0'],
      ['3\nLOAD 100\nMUL 0\nOUT', '0'],
    ],
    why: ['LOAD 7 then ADD 5 gives 12, OUT prints it, MUL 2 gives 24.', 'The accumulator stays 7 after the first OUT, so 7 is printed twice.'],
    hints: [
      'Read each opcode with scanf("%s", op).',
      'Only read a number when the opcode is not OUT.',
      'Compare strings with strcmp, never ==.',
    ],
    solution: c`#include <stdio.h>
#include <string.h>

int main() {
    int n, acc = 0;
    scanf("%d", &n);
    while (n--) {
        char op[10];
        int v = 0;
        scanf("%9s", op);
        if (strcmp(op, "OUT") == 0) {
            printf("%d\n", acc);
            continue;
        }
        scanf("%d", &v);
        if (strcmp(op, "LOAD") == 0) acc = v;
        else if (strcmp(op, "ADD") == 0) acc += v;
        else if (strcmp(op, "SUB") == 0) acc -= v;
        else if (strcmp(op, "MUL") == 0) acc *= v;
    }
    return 0;
}`,
    explanation: 'The loop is the fetch step, strcmp chain is decode, and the arithmetic on acc is execute. OUT has no operand so the second scanf is skipped for it.',
    keywords: ['scanf', 'strcmp', 'printf'],
  }),
]
