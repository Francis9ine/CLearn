import type { Topic } from '../types'
const c = String.raw

export const M3: Topic[] = [
  {
    id: 'm3-1',
    title: 'C statements',
    intro: [
      'A C program is a sequence of statements. The main kinds are: expression statements (an expression followed by ;), declaration statements, compound statements (a block in braces that acts as one statement), selection statements (if, switch), iteration statements (for, while, do-while), jump statements (break, continue, return, goto) and the empty statement (a lone ;).',
      'A compound statement defines a scope. Variables declared inside a block exist only until the closing brace, and an inner variable can shadow an outer one with the same name. Understanding blocks is the foundation for every control structure that follows.',
      'Statements are separated by semicolons, not newlines; the semicolon is a terminator, not a separator. One statement can span several lines, and several can share a line.',
    ],
    syntax: {
      lang: 'c',
      caption: 'The statement families',
      code: c`x = a + b;               /* expression statement */
int n = 5;               /* declaration          */
{ int t = x; x = n; }    /* compound statement   */
if (x > 0) { ... }       /* selection            */
while (x--) { ... }      /* iteration            */
break;  continue;  return 0;   /* jump           */
;                        /* empty statement      */`,
    },
    examples: [
      {
        title: 'Blocks and scope',
        code: c`#include <stdio.h>

int main() {
    int x = 10;
    {
        int x = 99;            /* new x, hides the outer one */
        printf("inner x = %d\n", x);
    }
    printf("outer x = %d\n", x);
    return 0;
}`,
        notes: [
          'The braces create a compound statement with its own scope.',
          'The inner x shadows the outer x only within the block.',
          'After the closing brace the outer x is visible again, so it prints 10.',
        ],
      },
      {
        title: 'The accidental empty statement',
        code: c`#include <stdio.h>

int main() {
    int n = 3;
    if (n > 5);                 /* <- stray semicolon ends the if */
        printf("always prints\n");
    return 0;
}`,
        notes: [
          'The semicolon after the if condition is an empty statement that becomes the if body.',
          'The printf is therefore not controlled by the if and always runs.',
          'Always use braces, and compile with -Wall to catch this.',
        ],
      },
    ],
    mistakes: [
      'Putting a semicolon right after if, for or while conditions.',
      'Omitting braces and then adding a second statement that is not part of the body.',
      'Forgetting the semicolon after a declaration or expression.',
    ],
    takeaways: [
      'Statements end with ;. Blocks in { } act as one statement.',
      'Kinds: expression, declaration, compound, selection, iteration, jump.',
      'Variables declared in a block are local to it.',
      'Prefer braces even for one-line bodies.',
    ],
  },
  {
    id: 'm3-2',
    title: 'Conditionals: if, if-else, nested if, switch, break',
    intro: [
      'Conditionals let a program choose between paths. if executes a block when its condition is non-zero. if-else provides an alternative. An else-if ladder tests several conditions in order and runs the first that matches. Nesting places one if inside another when a decision depends on an earlier one.',
      'switch compares one integer (or char) expression against several constant case labels. Execution jumps to the matching case and continues running until it reaches a break - this is called fall-through. default handles every value that does not match. switch is often clearer than a long else-if ladder when the same variable is tested against constants.',
      'Any non-zero value counts as true and zero counts as false, so if (n) means "if n is not zero".',
    ],
    syntax: {
      lang: 'c',
      caption: 'Selection statements',
      code: c`if (cond) { ... }
else if (cond2) { ... }
else { ... }

switch (expr) {
    case 1:  ...; break;
    case 2:
    case 3:  ...; break;   /* 2 and 3 share code */
    default: ...;
}`,
    },
    examples: [
      {
        title: 'Grade with an else-if ladder and nested if',
        code: c`#include <stdio.h>

int main() {
    int marks;
    scanf("%d", &marks);
    if (marks >= 40) {
        if (marks >= 75)      printf("Distinction\n");
        else if (marks >= 60) printf("First class\n");
        else                  printf("Pass\n");
    } else {
        printf("Fail\n");
    }
    return 0;
}`,
        notes: [
          'The outer if separates pass from fail; the nested ladder classifies the passing marks.',
          'Conditions are checked top to bottom and only the first true branch runs.',
          'Try 82, 65, 45 and 20 in the stdin box.',
        ],
      },
      {
        title: 'switch with fall-through',
        code: c`#include <stdio.h>

int main() {
    char ch;
    scanf(" %c", &ch);
    switch (ch) {
        case 'a': case 'e': case 'i': case 'o': case 'u':
            printf("vowel\n");
            break;
        case ' ':
            printf("space\n");
            break;
        default:
            printf("something else\n");
    }
    return 0;
}`,
        notes: [
          'Stacked case labels deliberately fall through to share one block.',
          'break exits the switch; without it execution would continue into the next case.',
          'default catches all other characters.',
        ],
      },
    ],
    mistakes: [
      'Using = instead of == in a condition, for example if (x = 5).',
      'Forgetting break in a switch and falling into the next case by accident.',
      'The dangling else: an else belongs to the nearest unmatched if, whatever the indentation says.',
      'Using a float, double or string as a switch expression. Only integer types are allowed.',
    ],
    takeaways: [
      'Non-zero is true, zero is false.',
      'else-if ladders stop at the first match.',
      'switch needs break to avoid fall-through; default is the catch-all.',
      'else pairs with the nearest if; use braces to be explicit.',
    ],
  },
  {
    id: 'm3-3',
    title: 'Loops: for, while, do-while, continue, break',
    intro: [
      'Loops repeat a block of code. for is best when the number of iterations is known: it combines initialisation, condition and update in one line. while checks its condition before every pass and is used when the count is not known in advance. do-while runs the body first and checks afterwards, so it always runs at least once - ideal for menus and input validation.',
      'break leaves the nearest enclosing loop (or switch) immediately. continue skips the rest of the current iteration and jumps to the next test (or to the update step in a for loop). Loops can be nested: the inner loop completes fully for every pass of the outer loop, which is how tables and patterns are printed.',
      'Take care with termination. A condition that never becomes false creates an infinite loop; sometimes this is intentional (for (;;) with a break) but usually it is a bug.',
    ],
    syntax: {
      lang: 'c',
      caption: 'The three loops',
      code: c`for (init; condition; update) { ... }

while (condition) { ... }

do { ... } while (condition);   /* note the semicolon */`,
    },
    examples: [
      {
        title: 'Sum of digits with while',
        code: c`#include <stdio.h>

int main() {
    int n, sum = 0;
    scanf("%d", &n);
    while (n > 0) {
        sum += n % 10;     /* last digit */
        n /= 10;           /* drop it    */
    }
    printf("%d\n", sum);
    return 0;
}`,
        notes: [
          'n % 10 extracts the last digit; n /= 10 removes it.',
          'The loop ends when no digits are left (n becomes 0).',
          'For input 1234 the sum is 1+2+3+4 = 10.',
        ],
      },
      {
        title: 'continue and break together',
        code: c`#include <stdio.h>

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) continue;   /* skip even numbers */
        if (i > 7) break;           /* stop after 7      */
        printf("%d ", i);
    }
    printf("\n");                   /* 1 3 5 7 */
    return 0;
}`,
        notes: [
          'continue jumps to i++ and the next test, skipping the printf.',
          'break exits the whole loop once i exceeds 7.',
          'Odd numbers up to 7 are printed: 1 3 5 7.',
        ],
      },
      {
        title: 'do-while for validation',
        code: c`#include <stdio.h>

int main() {
    int n;
    do {
        printf("Enter a number from 1 to 5: ");
        scanf("%d", &n);
    } while (n < 1 || n > 5);
    printf("You chose %d\n", n);
    return 0;
}`,
        notes: [
          'The prompt must appear at least once, which is exactly what do-while guarantees.',
          'The loop repeats while the answer is out of range.',
          'The semicolon after while(...) is required.',
        ],
      },
    ],
    mistakes: [
      'Off-by-one errors: using <= when < is intended, or starting at 1 instead of 0.',
      'Forgetting to update the loop variable in a while loop, producing an infinite loop.',
      'Placing continue in a while loop before the update statement, so the update is skipped forever.',
      'Using a semicolon after the for/while header, which makes the body empty.',
    ],
    takeaways: [
      'for for known counts, while for unknown counts, do-while for at-least-once.',
      'break exits the loop; continue skips to the next iteration.',
      'Nested loops: inner runs fully for each outer iteration.',
      'Always make sure the condition can become false.',
    ],
  },
  {
    id: 'm3-4',
    title: 'Storage classes (auto, register, static, extern)',
    intro: [
      'A storage class tells the compiler where a variable lives, how long it lives (lifetime) and where it can be seen (scope). C has four: auto, register, static and extern.',
      'auto is the default for local variables: created when the block is entered, destroyed when it ends, and holding garbage until initialised. register is a hint that a variable is used heavily and should live in a CPU register; you cannot take its address, and modern compilers usually ignore the hint. static on a local variable keeps its value between calls: it is created once and initialised once, living for the entire program. static on a global limits its visibility to the file.',
      'extern declares a variable that is defined in another file (or later in the same file), so several source files can share one global. Global variables not marked static have external linkage and are initialised to zero by default, as are static locals.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Storage class summary',
      code: c`auto     int a;     /* local, stack, garbage default   */
register int r;     /* local, CPU register hint, no &r */
static   int s;     /* persists across calls, default 0 */
extern   int g;     /* defined elsewhere               */

/*  class     scope     lifetime   default
    auto      block     block      garbage
    register  block     block      garbage
    static    block     program    0
    extern    global    program    0       */`,
    },
    examples: [
      {
        title: 'static remembers between calls',
        code: c`#include <stdio.h>

void counter(void) {
    static int calls = 0;     /* initialised once */
    int fresh = 0;            /* reset every call */
    calls++;
    fresh++;
    printf("calls=%d fresh=%d\n", calls, fresh);
}

int main() {
    counter();
    counter();
    counter();
    return 0;
}`,
        notes: [
          'calls keeps its value between calls: 1, 2, 3.',
          'fresh is an auto variable recreated every time, so it is always 1.',
          'The initialiser = 0 on a static runs only once, before main.',
        ],
      },
      {
        title: 'extern and register',
        code: c`#include <stdio.h>

int total = 100;                 /* global definition */

void show(void) {
    extern int total;            /* refers to the global above */
    printf("total=%d\n", total);
}

int main() {
    register int i;              /* hint: keep in a register */
    for (i = 0; i < 3; i++)
        total += 10;
    show();                      /* total=130 */
    return 0;
}`,
        notes: [
          'extern inside show says: use the global named total; do not create a new one.',
          'In a multi-file project, extern int total; goes in a header and the definition in exactly one .c file.',
          'register int i hints at speed, but writing &i would be a compile error.',
        ],
      },
    ],
    mistakes: [
      'Expecting an auto variable to keep its value after the function returns.',
      'Defining a global in a header file included by many .c files, causing duplicate symbols. Use extern in the header.',
      'Taking the address of a register variable.',
      'Assuming uninitialised auto variables are zero. Only static and global variables default to zero.',
    ],
    takeaways: [
      'auto: default local. register: speed hint. static: persistent. extern: defined elsewhere.',
      'static locals keep values between calls and initialise once.',
      'Globals and statics default to 0; autos hold garbage.',
      'static on a global hides it from other files.',
    ],
  },
  {
    id: 'm3-5',
    title: 'Preprocessor directives',
    intro: [
      'The preprocessor runs before the compiler and transforms the source text. Every directive begins with # and sits on its own line. #include pastes the contents of a header file: angle brackets <stdio.h> search the system directories, quotes "myfile.h" search your project first.',
      '#define creates a macro: an object-like macro replaces a name with text (#define SIZE 10), and a function-like macro takes arguments (#define SQUARE(x) ((x)*(x))). Macros are textual, so wrap parameters and the whole body in parentheses to avoid precedence surprises. #undef removes a definition.',
      'Conditional compilation - #if, #ifdef, #ifndef, #else, #elif, #endif - includes or skips code depending on macros. It is used for platform-specific code, debug output and include guards, which prevent a header from being processed twice. Other useful directives are #pragma and #error.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Common directives',
      code: c`#include <header.h>        /* system header  */
#include "local.h"         /* project header */
#define NAME value
#define SQUARE(x) ((x) * (x))
#undef NAME
#ifdef DEBUG ... #else ... #endif
#ifndef MYHEADER_H         /* include guard  */
#define MYHEADER_H
#endif`,
    },
    examples: [
      {
        title: 'Macros and the parentheses trap',
        code: c`#include <stdio.h>
#define BAD(x)  x * x
#define GOOD(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main() {
    printf("%d\n", BAD(2 + 3));    /* 2 + 3*2 + 3 = 11 */
    printf("%d\n", GOOD(2 + 3));   /* 25 */
    printf("%d\n", MAX(4, 9));     /* 9  */
    return 0;
}`,
        notes: [
          'BAD(2 + 3) expands to 2 + 3 * 2 + 3 = 11 because macros substitute text, not values.',
          'GOOD wraps every use of x in parentheses and gives 25.',
          'MAX evaluates its arguments twice, so never pass x++ to it.',
        ],
      },
      {
        title: 'Conditional compilation',
        code: c`#include <stdio.h>
#define DEBUG 1

int main() {
    int x = 6;
#if DEBUG
    printf("[debug] x = %d\n", x);
#endif
#ifdef _WIN32
    printf("Windows build\n");
#else
    printf("Not Windows\n");
#endif
    return 0;
}`,
        notes: [
          'Code under #if DEBUG only exists in the compiled program when DEBUG is non-zero.',
          '_WIN32 is predefined by Windows compilers, so this chooses platform code at compile time.',
          'You can define DEBUG from the command line with gcc -DDEBUG=1.',
        ],
      },
    ],
    mistakes: [
      'Adding a semicolon at the end of #define lines.',
      'Not parenthesising macro arguments and bodies.',
      'Passing expressions with side effects (i++) to a function-like macro.',
      'Forgetting include guards, causing redefinition errors when a header is included twice.',
    ],
    takeaways: [
      'The preprocessor works on text before compilation.',
      '#define makes constants and macros; always parenthesise.',
      '#ifdef / #ifndef / #if enable conditional compilation and include guards.',
      '<...> for system headers, "..." for your own.',
    ],
  },
  {
    id: 'm3-6',
    title: 'Command-line arguments',
    intro: [
      'Programs can receive input when they are launched, from the command line. To accept it, declare main with two parameters: int main(int argc, char *argv[]). argc (argument count) is the number of items, including the program name itself. argv (argument vector) is an array of strings holding each item.',
      'argv[0] is the program name, argv[1] is the first real argument, and so on up to argv[argc - 1]. Arguments always arrive as strings. To use one as a number, convert it with atoi, atof or the safer strtol. If a user types fewer arguments than needed, check argc and print a usage message instead of reading beyond the array.',
      'Command-line arguments make programs scriptable: tools like gcc, ls and grep are all C programs driven this way.',
    ],
    syntax: {
      lang: 'c',
      caption: 'main with arguments',
      code: c`int main(int argc, char *argv[]) {
    /* argc    : number of arguments (>= 1)
       argv[0] : program name
       argv[1] : first argument (a string)
       argv[argc] is NULL                       */
    return 0;
}`,
    },
    examples: [
      {
        title: 'Echo the arguments',
        code: c`#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("argc = %d\n", argc);
    for (int i = 0; i < argc; i++)
        printf("argv[%d] = %s\n", i, argv[i]);
    return 0;
}
/* ./echo hello 42   prints argc = 3, argv[0] = ./echo, argv[1] = hello, argv[2] = 42 */`,
        notes: [
          'The loop starts at 0 because argv[0] is the program name.',
          'Every argument, even 42, is a char string.',
          'The playground has no command line, so argc will be 1 there. Compile locally to experiment.',
        ],
      },
      {
        title: 'Adding two numbers from the command line',
        code: c`#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("Usage: %s a b\n", argv[0]);
        return 1;
    }
    int a = atoi(argv[1]);
    int b = atoi(argv[2]);
    printf("%d\n", a + b);
    return 0;
}`,
        notes: [
          'Check argc first so you never read an argument that was not supplied.',
          'atoi converts a string such as "12" into the integer 12.',
          'Returning 1 signals an error to the shell; 0 signals success.',
        ],
      },
    ],
    mistakes: [
      'Reading argv[1] without checking argc.',
      'Treating argv[1] as a number without converting it from a string.',
      'Forgetting that argv[0] is the program name, which shifts every index by one.',
      'Comparing strings with == instead of strcmp.',
    ],
    takeaways: [
      'int main(int argc, char *argv[]) receives the command line.',
      'argv[0] is the program; real arguments start at argv[1].',
      'Arguments are strings; convert with atoi, atof or strtol.',
      'Validate argc and print a usage message.',
    ],
  },
]
