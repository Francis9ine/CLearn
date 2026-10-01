import type { Topic } from '../types'
const c = String.raw

export const M2: Topic[] = [
  {
    id: 'm2-1',
    title: 'History and Introduction of C',
    intro: [
      'C was created by Dennis Ritchie at Bell Labs between 1969 and 1973, mainly so that the Unix operating system could be rewritten in a language other than assembly. It grew out of B (by Ken Thompson), which came from BCPL.',
      'In 1978 Brian Kernighan and Dennis Ritchie published "The C Programming Language" (K&R), which became the informal specification. ANSI standardised the language in 1989 (C89), ISO adopted it as C90, and C99, C11, C17 and C23 followed.',
      'C is popular because it is small, fast and close to the hardware while still being portable. It is a procedural, structured, middle-level language: it offers high-level control structures but also direct memory access with pointers. Operating systems, compilers, databases, embedded firmware and the interpreters of other languages are written in C.',
    ],
    syntax: {
      lang: 'txt',
      caption: 'Lineage of C',
      code: c`ALGOL 60 (1960) -> CPL (1963) -> BCPL (1967) -> B (1969)
  -> C (1972) -> K&R C (1978) -> ANSI C89 (1989) -> C99 -> C11 -> C17 -> C23`,
    },
    examples: [
      {
        title: 'The famous first program',
        code: c`#include <stdio.h>

int main() {
    printf("hello, world\n");
    return 0;
}`,
        notes: [
          'This is the first example in the K&R book, and it has been the first program for generations of C learners.',
          '#include <stdio.h> brings in the declaration of printf.',
          'return 0 tells the OS that the program finished successfully.',
        ],
      },
      {
        title: 'Why "middle-level"? High-level control and low-level access',
        code: c`#include <stdio.h>

int main() {
    unsigned int flags = 0;
    flags |= (1u << 3);          /* low level: set bit 3 */
    if (flags & (1u << 3))       /* high level: readable control flow */
        printf("bit 3 is on, flags = %u\n", flags);
    return 0;
}`,
        notes: [
          'Bit operators let C manipulate individual bits, as assembly would.',
          'if statements and named variables provide high-level readability.',
          'This blend is why C is chosen for drivers and embedded firmware.',
        ],
      },
    ],
    mistakes: [
      'Saying C was created in 1989. That is the ANSI standard year; C itself dates to the early 1970s.',
      'Mixing up C with C++ or C#. They are different languages, even though C++ began as "C with Classes".',
      'Assuming C is outdated. It is still among the most used languages for systems and embedded work.',
    ],
    takeaways: [
      'Created by Dennis Ritchie at Bell Labs (about 1972) for Unix.',
      'Standards: C89/C90, C99, C11, C17, C23.',
      'Procedural, portable, fast, close to hardware.',
      'Used for operating systems, compilers, embedded systems.',
    ],
  },
  {
    id: 'm2-2',
    title: 'Basic structure of a C program',
    intro: [
      'Every C program is built from the same few sections: documentation comments, preprocessor directives (#include, #define), global declarations, the main() function, and optional user-defined functions.',
      'Execution always starts at main(). The statements between its braces run from top to bottom. Each statement ends with a semicolon, and blocks are wrapped in { }. The return value of main goes back to the operating system: 0 means success.',
      'C is case-sensitive: Main and main are different names. Whitespace and indentation are ignored by the compiler but are essential for people reading your code.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Skeleton that every program follows',
      code: c`/* 1. Documentation section */
#include <stdio.h>        /* 2. Link section */
#define PI 3.14159        /* 3. Definition section */

int counter = 0;          /* 4. Global declarations */

int main(void) {          /* 5. main function */
    /* local declarations */
    /* executable statements */
    return 0;
}

/* 6. User-defined functions */`,
    },
    examples: [
      {
        title: 'Area of a circle',
        code: c`#include <stdio.h>
#define PI 3.14159

int main() {
    float r = 2.0f;
    float area = PI * r * r;
    printf("Area = %.2f\n", area);
    return 0;
}`,
        notes: [
          '#define PI creates a named constant by textual substitution before compilation.',
          'The variable declarations come first, then the calculation, then the output.',
          '%.2f prints a floating-point value with two digits after the decimal point.',
        ],
      },
      {
        title: 'A user-defined function',
        code: c`#include <stdio.h>

int square(int x);          /* prototype */

int main() {
    printf("%d\n", square(7));
    return 0;
}

int square(int x) {         /* definition */
    return x * x;
}`,
        notes: [
          'The prototype before main lets the compiler check calls to square.',
          'main calls square(7), which receives 7 in the parameter x.',
          'The function returns the value 49, and printf prints it.',
        ],
      },
    ],
    mistakes: [
      'Forgetting the semicolon at the end of a statement; the error is often reported on the next line.',
      'Writing Main() or Printf(): C is case-sensitive.',
      'Omitting #include <stdio.h> and then calling printf, which produces warnings or errors.',
    ],
    takeaways: [
      'Sections: comments, includes, defines, globals, main, functions.',
      'Execution begins at main() and ends with return.',
      'Statements end with ; and blocks use { }.',
      'C is case-sensitive.',
    ],
  },
  {
    id: 'm2-3',
    title: 'Variables, constants, and data types',
    intro: [
      'A variable is a named location in memory that holds a value. Before using it you must declare it with a type, which tells the compiler how much memory to reserve and how to interpret the bits. A constant is a value that cannot change after it is set.',
      'The basic types are int (whole numbers, usually 4 bytes), float (about 7 decimal digits, 4 bytes), double (about 15 digits, 8 bytes) and char (one character, 1 byte). Modifiers short, long, signed and unsigned change the size or the sign. Derived types - arrays, pointers, structures - are built on top of these.',
      'Constants come in two flavours: the const keyword (typed, checked by the compiler) and #define (textual substitution). Literals such as 42, 3.14, \'A\' and "text" are constants too. Variable names may contain letters, digits and underscores, cannot start with a digit and cannot be keywords.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Declaration, initialisation and constants',
      code: c`type name;                 /* declaration            */
type name = value;         /* declare + initialise   */
const type NAME = value;   /* read-only variable     */
#define NAME value         /* macro constant         */

int age = 20;
float price = 99.5f;
char grade = 'A';
const double G = 9.81;`,
    },
    examples: [
      {
        title: 'Sizes and ranges',
        code: c`#include <stdio.h>
#include <limits.h>

int main() {
    printf("char   %zu byte,  max %d\n", sizeof(char), CHAR_MAX);
    printf("int    %zu bytes, max %d\n", sizeof(int), INT_MAX);
    printf("long   %zu bytes\n", sizeof(long));
    printf("float  %zu bytes\n", sizeof(float));
    printf("double %zu bytes\n", sizeof(double));
    return 0;
}`,
        notes: [
          'limits.h defines the extremes for each integer type, for example INT_MAX = 2147483647.',
          'Sizes depend on the platform, which is why you ask with sizeof instead of assuming.',
          'double stores twice as many bytes as float and therefore more precision.',
        ],
      },
      {
        title: 'Constants and type behaviour',
        code: c`#include <stdio.h>
#define TAX 0.18

int main() {
    const int months = 12;
    int a = 7, b = 2;
    double exact = 7.0 / 2;
    printf("%d %d %.1f\n", months, a / b, exact);
    printf("tax on 500 = %.1f\n", 500 * TAX);
    return 0;
}`,
        notes: [
          'Integer division truncates: 7 / 2 is 3, not 3.5.',
          'Making one operand floating-point (7.0) promotes the whole division to double.',
          'Assigning to months later would be a compile error because it is const.',
        ],
      },
    ],
    mistakes: [
      'Using a variable before initialising it. Its value is garbage (undefined).',
      'Dividing two ints and expecting a decimal result.',
      'Overflowing a type, for example storing 3000000000 in a signed 32-bit int.',
      'Putting a semicolon after #define, which becomes part of the replacement text.',
    ],
    takeaways: [
      'Declare before use; initialise at declaration.',
      'Core types: char, int, float, double, plus short/long/signed/unsigned.',
      'const gives a typed constant; #define gives a text substitution.',
      'Integer division truncates.',
    ],
  },
  {
    id: 'm2-4',
    title: 'Operators: arithmetic, relational, logical, assignment, increment/decrement, conditional, bitwise',
    intro: [
      'Operators act on operands to produce a value. Arithmetic operators are + - * / and % (remainder, integers only). Relational operators (< > <= >= == !=) compare values and give 1 for true and 0 for false. Logical operators && (and), || (or) and ! (not) combine conditions and short-circuit: the right side is skipped when the answer is already known.',
      'Assignment operators store results: = and the compound forms += -= *= /= %=. The increment ++ and decrement -- add or subtract one. In prefix form (++x) the change happens before the value is used; in postfix form (x++) the old value is used first and the change happens afterwards.',
      'The conditional operator ?: is a compact if-else that yields a value. Bitwise operators work on individual bits: & (and), | (or), ^ (xor), ~ (not), << (shift left) and >> (shift right). Shifting left by n multiplies by 2 to the power n.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Operator families at a glance',
      code: c`a + b   a - b   a * b   a / b   a % b      /* arithmetic   */
a < b   a >= b  a == b  a != b              /* relational   */
a && b  a || b  !a                          /* logical      */
a = b   a += b  a <<= 1                     /* assignment   */
++a   a++   --a   a--                       /* inc / dec    */
cond ? x : y                                /* conditional  */
a & b   a | b   a ^ b   ~a   a << n   a >> n  /* bitwise    */`,
    },
    examples: [
      {
        title: 'Prefix versus postfix',
        code: c`#include <stdio.h>

int main() {
    int y = 5;
    int x = 5 * y++;      /* uses 5, then y becomes 6 */
    printf("x=%d y=%d\n", x, y);

    int a = 5;
    int b = 5 * ++a;      /* a becomes 6 first, then 5*6 */
    printf("b=%d a=%d\n", b, a);
    return 0;
}`,
        notes: [
          'y++ yields the old value 5, so x = 25, and afterwards y is 6.',
          '++a increments first, so b = 5 * 6 = 30.',
          'Output: x=25 y=6 and then b=30 a=6.',
        ],
      },
      {
        title: 'Conditional and bitwise operators',
        code: c`#include <stdio.h>

int main() {
    int a = 12, b = 10;          /* 1100 and 1010 in binary */
    printf("%d %d %d\n", a & b, a | b, a ^ b);   /* 8 14 6 */
    printf("%d %d\n", a << 1, a >> 2);           /* 24 3   */
    int max = (a > b) ? a : b;
    printf("max = %d\n", max);
    return 0;
}`,
        notes: [
          '1100 AND 1010 = 1000 (8); OR = 1110 (14); XOR = 0110 (6).',
          'a << 1 doubles the value; a >> 2 divides by 4, discarding the remainder.',
          'The ?: operator picks a when the condition is true, otherwise b.',
        ],
      },
    ],
    mistakes: [
      'Using = (assignment) instead of == (comparison) inside an if.',
      'Confusing && (logical) with & (bitwise). 2 && 1 is 1 but 2 & 1 is 0.',
      'Modifying and reading the same variable in one expression, such as i = i++ + ++i, which is undefined behaviour.',
      'Using % with floating-point numbers; it only works on integers.',
    ],
    takeaways: [
      'Relational and logical operators yield 1 or 0.',
      'x++ uses then increments; ++x increments then uses.',
      '?: is an expression form of if-else.',
      'Bit shifts multiply or divide by powers of two.',
    ],
  },
  {
    id: 'm2-5',
    title: 'Expressions, operator precedence and associativity',
    intro: [
      'An expression combines variables, constants and operators to produce a value. When several operators appear together, precedence decides which is evaluated first, and associativity decides the direction when operators share the same level.',
      'From highest to lowest, the broad order is: parentheses and postfix (), [], ++ --; then unary ! ~ + - ++ -- (type) sizeof; then * / %; then + -; then << >>; then < <= > >=; then == !=; then &, ^, |; then &&; then ||; then ?:; then assignment; and finally the comma. Most binary operators associate left to right, while assignment, the conditional operator and unary operators associate right to left.',
      'The compiler also performs type conversion in mixed expressions: an int combined with a double becomes a double. You can force a conversion with a cast such as (double)a. When in doubt, add parentheses: they cost nothing and make the intent clear.',
    ],
    syntax: {
      lang: 'txt',
      caption: 'Precedence (high to low) and associativity',
      code: c`()  []  ++ -- (postfix)           left  -> right
!  ~  ++ -- (prefix)  -  *  &  sizeof   right -> left
*  /  %                                left  -> right
+  -                                   left  -> right
<<  >>                                 left  -> right
<  <=  >  >=                           left  -> right
==  !=                                 left  -> right
&   ^   |        (in that order)       left  -> right
&&   then   ||                         left  -> right
?:                                     right -> left
=  +=  -=  ...                         right -> left`,
    },
    examples: [
      {
        title: 'Evaluating step by step',
        code: c`#include <stdio.h>

int main() {
    int r1 = 2 + 3 * 4;          /* 3*4 first -> 14      */
    int r2 = (2 + 3) * 4;        /* parentheses -> 20    */
    int r3 = 20 / 4 * 2;         /* left to right -> 10  */
    int r4 = 10 - 4 - 3;         /* left to right -> 3   */
    int a, b, c;
    a = b = c = 7;               /* right to left        */
    printf("%d %d %d %d %d\n", r1, r2, r3, r4, a + b + c);
    return 0;
}`,
        notes: [
          '* binds tighter than +, so 3 * 4 happens before the addition.',
          '/ and * share a level and associate left to right: (20 / 4) * 2.',
          'Assignment associates right to left, so c = 7 happens first, then b = c, then a = b.',
        ],
      },
      {
        title: 'Mixed types and casts',
        code: c`#include <stdio.h>

int main() {
    int total = 17, count = 5;
    printf("%d\n", total / count);                 /* 3    */
    printf("%.2f\n", (double)total / count);       /* 3.40 */
    printf("%.2f\n", (double)(total / count));     /* 3.00 */
    int ok = 3 < 5 && 5 < 8 || 0;                  /* 1    */
    printf("%d\n", ok);
    return 0;
}`,
        notes: [
          'The cast applies to total first, so the division happens in double.',
          'Casting after the integer division is too late: the decimals are already lost.',
          '&& has higher precedence than ||, so the expression is (3 < 5 && 5 < 8) || 0.',
        ],
      },
    ],
    mistakes: [
      'Assuming left-to-right evaluation for all operators regardless of precedence.',
      'Writing a < b < c expecting a range check. It evaluates (a < b) first and compares 0 or 1 with c.',
      'Casting the result of an integer division instead of an operand.',
      'Forgetting that & and | have lower precedence than ==, so a & 1 == 0 means a & (1 == 0).',
    ],
    takeaways: [
      'Precedence picks the order across levels; associativity picks it within a level.',
      'Assignment and unary operators associate right to left.',
      'Cast an operand, not the finished result.',
      'Use parentheses whenever the order is not obvious.',
    ],
  },
  {
    id: 'm2-6',
    title: 'Managing input and output; formatted I/O (printf, scanf)',
    intro: [
      'Input and output in C are provided by the standard library in <stdio.h>. printf writes formatted text to the screen. scanf reads formatted input from the keyboard. Each uses a format string containing conversion specifiers that say how to interpret each value.',
      'Common specifiers are %d (int), %u (unsigned), %ld (long), %f (float with printf, double with scanf as %lf), %c (char), %s (string) and %x (hexadecimal). Width and precision refine the output: %5d right-aligns in 5 columns, %-5d left-aligns, %.2f shows two decimals.',
      'Unlike printf, scanf needs the address of each variable: scanf("%d", &n). Strings read with %s stop at the first whitespace. For single characters, getchar() and putchar() are available; for whole lines, fgets() is safer than the removed gets().',
    ],
    syntax: {
      lang: 'c',
      caption: 'printf and scanf',
      code: c`printf("format string", value1, value2, ...);
scanf ("format string", &var1, &var2, ...);

%d int     %f float/double   %lf double (scanf)
%c char    %s string         %x hex    %% literal percent
%5d width 5   %-5d left aligned   %05d zero padded   %.2f 2 decimals`,
    },
    examples: [
      {
        title: 'Read two numbers and print a formatted result',
        code: c`#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum     : %d\n", a + b);
    printf("Average : %.2f\n", (a + b) / 2.0);
    return 0;
}`,
        notes: [
          '&a and &b pass the addresses so scanf can store the values into them.',
          'Dividing by 2.0 forces a floating-point average.',
          'Run this with the stdin box: enter  7 4  and see Sum 11, Average 5.50.',
        ],
      },
      {
        title: 'Width, alignment and characters',
        code: c`#include <stdio.h>

int main() {
    char grade;
    scanf(" %c", &grade);          /* leading space skips whitespace */
    printf("[%5d]\n", 42);
    printf("[%-5d]\n", 42);
    printf("[%05d]\n", 42);
    printf("[%8.3f]\n", 3.14159);
    printf("Grade: %c\n", grade);
    return 0;
}`,
        notes: [
          'The space before %c in scanf skips the newline left by a previous input.',
          '%5d pads on the left, %-5d pads on the right and %05d pads with zeros.',
          '%8.3f uses 8 columns total with 3 digits after the point.',
        ],
      },
    ],
    mistakes: [
      'Forgetting & in scanf("%d", n). This usually crashes.',
      'Using %f to scan a double. Use %lf for scanf (printf accepts %f for both).',
      'Mismatching specifier and type, such as printing a float with %d.',
      'Reading a character right after a number without a leading space, so the newline is consumed as the character.',
    ],
    takeaways: [
      'printf prints with a format string; scanf reads and needs &variable.',
      'Specifier must match the type: %d, %f, %lf, %c, %s.',
      'Width and precision control layout: %6.2f.',
      'Use " %c" to skip leftover whitespace.',
    ],
  },
]
