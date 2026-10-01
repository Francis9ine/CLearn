import type { Topic } from '../types'
const c = String.raw

export const M4: Topic[] = [
  {
    id: 'm4-1',
    title: 'One-dimensional arrays',
    intro: [
      'An array stores a fixed number of values of the same type in consecutive memory locations. Instead of ten separate variables you declare one array of ten elements and reach each through an index. Indexing starts at 0, so an array of size n has valid indexes 0 to n-1.',
      'You can initialise an array when it is declared. If you give fewer values than the size, the rest are set to zero, and if you omit the size the compiler counts the values for you. The number of elements can be computed as sizeof(arr) / sizeof(arr[0]).',
      'C does not check bounds. Reading or writing outside the array is undefined behaviour: it may crash, silently corrupt other variables or appear to work. It is your job to keep indexes in range. Arrays are usually processed with loops.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Declaring, initialising and accessing',
      code: c`type name[size];
int a[5];                    /* 5 ints, uninitialised   */
int b[5] = {1, 2, 3, 4, 5};
int c[5] = {1, 2};           /* 1 2 0 0 0               */
int d[]  = {7, 8, 9};        /* size 3                  */
b[0] = 10;                   /* first element           */
n = sizeof b / sizeof b[0];  /* element count           */`,
    },
    examples: [
      {
        title: 'Read, sum and find the maximum',
        code: c`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++)
        scanf("%d", &a[i]);

    int sum = a[0], max = a[0];
    for (int i = 1; i < n; i++) {
        sum += a[i];
        if (a[i] > max) max = a[i];
    }
    printf("sum=%d max=%d\n", sum, max);
    return 0;
}`,
        notes: [
          'a[100] reserves room for up to 100 integers; only the first n are used.',
          'scanf("%d", &a[i]) needs the address of each element.',
          'Starting max with a[0] works even when all numbers are negative.',
        ],
      },
      {
        title: 'Reversing in place with two indexes',
        code: c`#include <stdio.h>

int main() {
    int a[] = {1, 2, 3, 4, 5};
    int n = sizeof a / sizeof a[0];
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}`,
        notes: [
          'i walks from the front and j from the back until they meet in the middle.',
          'A temporary variable is needed to swap two values without losing one.',
          'sizeof a / sizeof a[0] only works where a is a real array, not a pointer parameter.',
        ],
      },
    ],
    mistakes: [
      'Accessing a[n]. The last valid index is n-1.',
      'Assuming an uninitialised local array contains zeros.',
      'Trying to copy arrays with b = a. Use a loop or memcpy.',
      'Using sizeof(arr) inside a function to find the length; there it is the size of a pointer.',
    ],
    takeaways: [
      'Fixed-size, same-type, contiguous; index from 0.',
      'Partial initialisers fill the rest with zeros.',
      'There is no bounds checking: stay in range.',
      'Length = sizeof arr / sizeof arr[0] (in the declaring scope).',
    ],
  },
  {
    id: 'm4-2',
    title: 'Two-dimensional arrays and matrix computations',
    intro: [
      'A two-dimensional array is an array of arrays, perfect for tables and matrices. int m[3][4] has 3 rows and 4 columns. The element in row i and column j is m[i][j]. Memory is laid out row by row (row-major order), so m[0][0], m[0][1], ... m[0][3], m[1][0] follow each other.',
      'Initialise it with nested braces: int m[2][3] = {{1,2,3},{4,5,6}}. When you pass a 2D array to a function, every dimension except the first must be given: void print(int m[][4], int rows).',
      'Matrix work uses nested loops: the outer loop walks the rows and the inner loop walks the columns. Addition combines elements at the same position. The transpose swaps rows and columns, so t[j][i] = m[i][j]. Multiplication needs a third loop that accumulates row-by-column products.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Two-dimensional arrays',
      code: c`int m[ROWS][COLS];
int m[2][3] = { {1, 2, 3},
                {4, 5, 6} };

for (int i = 0; i < ROWS; i++)
    for (int j = 0; j < COLS; j++)
        m[i][j] ...;`,
    },
    examples: [
      {
        title: 'Matrix addition',
        code: c`#include <stdio.h>

int main() {
    int a[2][2] = {{1, 2}, {3, 4}};
    int b[2][2] = {{5, 6}, {7, 8}};
    int s[2][2];
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            s[i][j] = a[i][j] + b[i][j];
            printf("%d ", s[i][j]);
        }
        printf("\n");
    }
    return 0;
}`,
        notes: [
          'The matrices must have identical dimensions to be added.',
          'The outer loop picks a row; the inner loop visits each column of that row.',
          'Result: 6 8 on the first row, 10 12 on the second.',
        ],
      },
      {
        title: 'Transpose of a 2x3 matrix',
        code: c`#include <stdio.h>

int main() {
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int t[3][2];
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 3; j++)
            t[j][i] = m[i][j];

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 2; j++) printf("%d ", t[i][j]);
        printf("\n");
    }
    return 0;
}`,
        notes: [
          'The transpose of a 2x3 matrix is 3x2; rows become columns.',
          'The assignment t[j][i] = m[i][j] is the whole idea of transposition.',
          'The output is 1 4, 2 5, 3 6 on three lines.',
        ],
      },
    ],
    mistakes: [
      'Swapping the dimensions: declaring [cols][rows].',
      'Leaving out the column size when passing a 2D array to a function.',
      'Using the same index for rows and columns in the nested loops.',
      'Reading past the last row or column; there are no bounds checks.',
    ],
    takeaways: [
      'm[r][c]: r rows, c columns, row-major layout.',
      'Nested loops process matrices: rows outside, columns inside.',
      'Transpose: t[j][i] = m[i][j].',
      'Function parameters need all dimensions except the first.',
    ],
  },
  {
    id: 'm4-3',
    title: 'Functions: user-defined functions, prototypes, return types',
    intro: [
      'A function is a named, reusable block of code. Breaking a program into functions makes it shorter, easier to test and easier to read. Every function has a return type, a name, a parameter list and a body. A function that returns nothing uses void.',
      'A function must be declared before it is called. The usual approach is a prototype near the top of the file - the return type, name and parameter types followed by a semicolon - with the definition written below main. The prototype lets the compiler check that each call has the right number and types of arguments.',
      'The return statement hands a value back to the caller and ends the function immediately. A function can have several return statements, but it must return a value of its declared type on every path. main itself is a function that returns int.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Prototype, definition and call',
      code: c`return_type name(type1 p1, type2 p2);     /* prototype  */

return_type name(type1 p1, type2 p2) {    /* definition */
    ...
    return value;
}

result = name(arg1, arg2);                /* call       */`,
    },
    examples: [
      {
        title: 'Maximum of two numbers',
        code: c`#include <stdio.h>

int max(int a, int b);          /* prototype */

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("%d\n", max(x, y));
    return 0;
}

int max(int a, int b) {         /* definition */
    return (a > b) ? a : b;
}`,
        notes: [
          'The prototype allows main to call max before its definition appears.',
          'a and b are parameters; the values of x and y are copied into them.',
          'The return value replaces the call expression inside printf.',
        ],
      },
      {
        title: 'void functions and early return',
        code: c`#include <stdio.h>

void printLine(int n, char ch) {
    for (int i = 0; i < n; i++) putchar(ch);
    putchar('\n');
}

int isPrime(int n) {
    if (n < 2) return 0;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0) return 0;     /* early exit */
    return 1;
}

int main() {
    printLine(10, '=');
    printf("7 prime? %d\n", isPrime(7));
    printLine(10, '=');
    return 0;
}`,
        notes: [
          'A void function does its work and returns nothing.',
          'An early return exits as soon as the answer is known.',
          'Checking divisors only up to the square root of n keeps isPrime fast.',
        ],
      },
    ],
    mistakes: [
      'Calling a function before declaring it, so the compiler assumes an int return type (an error in modern C).',
      'Forgetting the return statement in a non-void function.',
      'Using a prototype whose types differ from the definition.',
      'Writing a semicolon after the function header in the definition.',
    ],
    takeaways: [
      'A function = return type + name + parameters + body.',
      'Declare with a prototype before use; define anywhere.',
      'return sends a value back and exits the function.',
      'Use void when there is no value to return.',
    ],
  },
  {
    id: 'm4-4',
    title: 'Function arguments, calling functions',
    intro: [
      'Values passed in a call are arguments; the variables that receive them in the definition are parameters. C uses call by value: the function receives a copy of each argument, so changing a parameter inside the function does not affect the caller variable.',
      'To let a function modify the caller data you pass its address (call by reference, simulated with pointers). Arrays are different: when you pass an array name, you pass the address of its first element, so the function works on the original array. That is why a function receiving an array should also receive its length.',
      'Arguments are matched to parameters by position, and the compiler converts types when it can. The order in which arguments are evaluated is unspecified, so avoid side effects such as f(i++, i++). Functions can call other functions, including themselves.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Call by value and passing arrays',
      code: c`void byValue(int x);              /* copy: caller unchanged   */
void byAddress(int *p);           /* pointer: caller can change */
int  sum(int arr[], int n);       /* array decays to a pointer  */

byValue(a);
byAddress(&a);
sum(arr, 5);`,
    },
    examples: [
      {
        title: 'Call by value does not change the caller',
        code: c`#include <stdio.h>

void tryToChange(int x) {
    x = 99;
    printf("inside : %d\n", x);
}

int main() {
    int a = 5;
    tryToChange(a);
    printf("outside: %d\n", a);   /* still 5 */
    return 0;
}`,
        notes: [
          'x is a copy of a; assigning to x leaves a untouched.',
          'To modify a you would pass &a and use a pointer parameter.',
          'Output: inside 99, outside 5.',
        ],
      },
      {
        title: 'Passing an array and its length',
        code: c`#include <stdio.h>

void doubleAll(int arr[], int n) {
    for (int i = 0; i < n; i++)
        arr[i] *= 2;               /* changes the original */
}

int main() {
    int v[4] = {1, 2, 3, 4};
    doubleAll(v, 4);
    for (int i = 0; i < 4; i++) printf("%d ", v[i]);
    printf("\n");                  /* 2 4 6 8 */
    return 0;
}`,
        notes: [
          'The array parameter really receives the address of v[0], so no copy is made.',
          'The function modifies the caller array directly.',
          'The length is passed separately because the function cannot discover it.',
        ],
      },
    ],
    mistakes: [
      'Expecting a function to modify a normal variable passed by value.',
      'Passing an array without its length and then guessing the size.',
      'Passing arguments in the wrong order when types are compatible, such as (width, height) swapped.',
      'Depending on the evaluation order of arguments.',
    ],
    takeaways: [
      'C is call-by-value: parameters are copies.',
      'Pass an address to let a function change the caller variable.',
      'Arrays are passed as the address of the first element.',
      'Always pass the array length alongside the array.',
    ],
  },
  {
    id: 'm4-5',
    title: 'Functions with a variable number of arguments',
    intro: [
      'Some functions, like printf, accept any number of arguments. You can write your own using the facilities in <stdarg.h>. The declaration uses an ellipsis (...) after at least one fixed parameter: int sum(int count, ...).',
      'Inside the function, declare a va_list, start it with va_start(list, lastFixedParameter), fetch each argument with va_arg(list, type) and finish with va_end(list). The function has no automatic way to know how many arguments were passed or what their types are, so you must tell it: pass a count, use a sentinel value, or describe the types in a format string as printf does.',
      'The compiler cannot type-check the variable part. Passing a double where you read an int, or fewer arguments than the count promises, is undefined behaviour. Small types are promoted: char and short become int, and float becomes double, so read them as int and double.',
    ],
    syntax: {
      lang: 'c',
      caption: 'The stdarg toolkit',
      code: c`#include <stdarg.h>

int fn(int count, ...) {
    va_list ap;
    va_start(ap, count);          /* after the last fixed param */
    int v = va_arg(ap, int);      /* fetch next argument        */
    va_end(ap);                   /* clean up                   */
}`,
    },
    examples: [
      {
        title: 'Sum of any number of integers',
        code: c`#include <stdio.h>
#include <stdarg.h>

int sum(int count, ...) {
    va_list ap;
    int total = 0;
    va_start(ap, count);
    for (int i = 0; i < count; i++)
        total += va_arg(ap, int);
    va_end(ap);
    return total;
}

int main() {
    printf("%d\n", sum(3, 10, 20, 30));       /* 60 */
    printf("%d\n", sum(5, 1, 2, 3, 4, 5));    /* 15 */
    return 0;
}`,
        notes: [
          'The first argument is a count that tells sum how many values follow.',
          'va_arg reads the next argument as an int each time through the loop.',
          'va_end releases resources used by the list.',
        ],
      },
      {
        title: 'Maximum using a sentinel, and a mini printf',
        code: c`#include <stdio.h>
#include <stdarg.h>

int maxOf(int first, ...) {          /* ends with -1 */
    va_list ap;
    int m = first, v;
    va_start(ap, first);
    while ((v = va_arg(ap, int)) != -1)
        if (v > m) m = v;
    va_end(ap);
    return m;
}

int main() {
    printf("%d\n", maxOf(4, 17, 9, 12, -1));   /* 17 */
    return 0;
}`,
        notes: [
          'A sentinel value (-1) marks the end instead of a count.',
          'The first argument is a fixed parameter, so va_start can anchor on it.',
          'Forgetting the final -1 makes the loop read garbage memory.',
        ],
      },
    ],
    mistakes: [
      'Not giving the function a way to know how many arguments there are.',
      'Reading an argument with the wrong type in va_arg.',
      'Omitting va_end or calling va_arg more times than arguments were passed.',
      'Trying to write a variadic function with no fixed parameter in older standards.',
    ],
    takeaways: [
      'Use ... and <stdarg.h> for variable argument lists.',
      'va_start, va_arg, va_end are the three steps.',
      'Tell the function the count, use a sentinel, or use a format string.',
      'There is no type safety on the variable part.',
    ],
  },
  {
    id: 'm4-6',
    title: 'Recursion',
    intro: [
      'Recursion is when a function calls itself to solve a smaller version of the same problem. Every correct recursive function has two parts: a base case that stops the recursion with a direct answer, and a recursive case that moves toward the base case. Without a base case the function calls itself forever until the call stack overflows.',
      'Each call gets its own set of parameters and local variables on the call stack. When the base case returns, the calls unwind in reverse order, each combining its result. Classic recursive problems are factorial, Fibonacci, the greatest common divisor, the Tower of Hanoi and tree traversals.',
      'Recursion can be elegant but has a cost: every call uses stack memory and time. The naive Fibonacci recomputes the same values exponentially many times. Many recursive solutions can be rewritten as loops, and some, like factorial, are usually better as loops in production code.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Shape of a recursive function',
      code: c`type solve(problem) {
    if (problem is trivial)       /* base case */
        return direct_answer;
    return combine(solve(smaller_problem));   /* recursive case */
}`,
    },
    examples: [
      {
        title: 'Factorial',
        code: c`#include <stdio.h>

long long fact(int n) {
    if (n <= 1) return 1;            /* base case      */
    return n * fact(n - 1);          /* recursive case */
}

int main() {
    printf("%lld\n", fact(5));       /* 120 */
    return 0;
}
/* fact(5) = 5 * fact(4) = 5 * 4 * fact(3) = ... = 5*4*3*2*1 */`,
        notes: [
          'The base case n <= 1 returns 1 and stops the chain.',
          'Each call waits for the smaller factorial before it can multiply.',
          'long long avoids overflow for values up to 20!.',
        ],
      },
      {
        title: 'Fibonacci and the cost of repeated work',
        code: c`#include <stdio.h>

int fib(int n) {
    if (n < 2) return n;                 /* fib(0)=0, fib(1)=1 */
    return fib(n - 1) + fib(n - 2);
}

int main() {
    for (int i = 0; i < 10; i++) printf("%d ", fib(i));
    printf("\n");        /* 0 1 1 2 3 5 8 13 21 34 */
    return 0;
}`,
        notes: [
          'There are two base cases, 0 and 1, and the rest is the sum of the previous two.',
          'fib(n) calls fib(n-1) and fib(n-2), which recompute shared sub-results.',
          'fib(40) already takes noticeable time; memoisation or a loop fixes it.',
        ],
      },
      {
        title: 'Greatest common divisor',
        code: c`#include <stdio.h>

int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);        /* Euclid's algorithm */
}

int main() {
    printf("%d\n", gcd(48, 18));   /* 6 */
    return 0;
}`,
        notes: [
          'gcd(48,18) calls gcd(18,12), gcd(12,6) and gcd(6,0).',
          'When b reaches 0 the answer is a.',
          'The remainder strictly shrinks, guaranteeing the base case is reached.',
        ],
      },
    ],
    mistakes: [
      'Missing the base case, causing infinite recursion and a stack overflow.',
      'A recursive step that does not move toward the base case, such as fact(n) instead of fact(n - 1).',
      'Using naive recursive Fibonacci for large n.',
      'Overflowing int when computing factorials above 12!.',
    ],
    takeaways: [
      'Every recursion needs a base case and progress toward it.',
      'Each call has its own variables on the stack.',
      'Recursion is clear but costs time and stack space.',
      'Many recursive algorithms can be converted into loops.',
    ],
  },
]
