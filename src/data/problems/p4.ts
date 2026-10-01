import { mk, c } from './helper'

const hanoi = (n: number) => {
  const out: string[] = []
  const go = (k: number, a: string, b: string, cc: string) => {
    if (k === 0) return
    go(k - 1, a, cc, b)
    out.push(`Move disk ${k} from ${a} to ${b}`)
    go(k - 1, cc, b, a)
  }
  go(n, 'A', 'C', 'B')
  return out.join('\n') + `\nTotal moves: ${out.length}`
}

export const P4 = [
  mk({
    id: 'array-sum-avg',
    module: 'm4',
    level: 'Easy',
    title: 'Array Sum and Average',
    statement: 'Read n integers into an array and print their sum and their average.',
    input: 'First line n, second line n integers.',
    output: 'Two lines: "Sum: S" and "Average: A" (2 decimals).',
    constraints: ['1 <= n <= 100', '-1000 <= value <= 1000'],
    tests: [
      ['5\n1 2 3 4 5', 'Sum: 15\nAverage: 3.00'],
      ['3\n10 20 25', 'Sum: 55\nAverage: 18.33'],
      ['1\n-4', 'Sum: -4\nAverage: -4.00'],
      ['4\n0 0 0 0', 'Sum: 0\nAverage: 0.00'],
      ['2\n1 2', 'Sum: 3\nAverage: 1.50'],
    ],
    why: ['The sum is 15 and the average 15 / 5 = 3.', '55 / 3 = 18.333... printed with two decimals.'],
    hints: ['Store the numbers in an array, then loop over it.', 'Keep an int sum while looping.', 'Divide by (double)n to avoid integer division.'],
    solution: c`#include <stdio.h>

int main() {
    int n, a[100], sum = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
        sum += a[i];
    }
    printf("Sum: %d\n", sum);
    printf("Average: %.2f\n", (double)sum / n);
    return 0;
}`,
    explanation: 'The array is read once and summed in the same loop. Casting the sum to double before dividing keeps the decimals.',
    keywords: ['scanf', 'printf', '\\['],
  }),
  mk({
    id: 'array-max-min',
    module: 'm4',
    level: 'Easy',
    title: 'Largest and Smallest Element',
    statement: 'Read an array of n integers and print its maximum and minimum value.',
    input: 'First line n, second line n integers.',
    output: 'Two lines: "Max: X" and "Min: Y".',
    constraints: ['1 <= n <= 100', '-100000 <= value <= 100000'],
    tests: [
      ['5\n3 9 -2 7 4', 'Max: 9\nMin: -2'],
      ['1\n5', 'Max: 5\nMin: 5'],
      ['3\n-5 -9 -1', 'Max: -1\nMin: -9'],
      ['4\n2 2 2 2', 'Max: 2\nMin: 2'],
    ],
    why: ['9 is the largest and -2 the smallest.', 'With one element it is both max and min.'],
    hints: ['Initialise max and min with the first element, not with 0.', 'Compare every other element against both.', 'Update with simple if statements.'],
    solution: c`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int max = a[0], min = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > max) max = a[i];
        if (a[i] < min) min = a[i];
    }
    printf("Max: %d\nMin: %d\n", max, min);
    return 0;
}`,
    explanation: 'Starting from a[0] ensures correct answers for all-negative arrays, where starting at 0 would be wrong.',
    keywords: ['scanf', 'printf', 'if'],
  }),
  mk({
    id: 'power-function',
    module: 'm4',
    level: 'Easy',
    title: 'Power Using a Function',
    statement: 'Write a function power(int base, int exp) that returns base raised to exp using a loop, then print the result for the input values.',
    input: 'Two integers: base and exp.',
    output: 'The value of base^exp.',
    constraints: ['-10 <= base <= 10', '0 <= exp <= 9', 'The result fits in a 32-bit int'],
    tests: [
      ['2 10', '1024'],
      ['5 0', '1'],
      ['3 4', '81'],
      ['-2 3', '-8'],
      ['10 9', '1000000000'],
      ['7 1', '7'],
    ],
    why: ['2 multiplied by itself 10 times is 1024.', 'Any number to the power 0 is 1.'],
    hints: ['Declare the prototype before main.', 'Start the result at 1 and multiply exp times.', 'Return the result and print it from main.'],
    solution: c`#include <stdio.h>

long long power(int base, int exp) {
    long long result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}

int main() {
    int b, e;
    scanf("%d %d", &b, &e);
    printf("%lld\n", power(b, e));
    return 0;
}`,
    explanation: 'The function hides the loop, so main stays short. Starting at 1 handles exp = 0 naturally.',
    keywords: ['scanf', 'printf', 'return'],
  }),
  mk({
    id: 'reverse-array',
    module: 'm4',
    level: 'Medium',
    title: 'Reverse an Array',
    statement: 'Read an array and print its elements in reverse order, separated by single spaces.',
    input: 'First line n, second line n integers.',
    output: 'The reversed array on one line.',
    constraints: ['1 <= n <= 100'],
    tests: [
      ['5\n1 2 3 4 5', '5 4 3 2 1'],
      ['4\n10 -3 7 0', '0 7 -3 10'],
      ['1\n9', '9'],
      ['2\n1 2', '2 1'],
      ['6\n1 1 2 2 3 3', '3 3 2 2 1 1'],
    ],
    why: ['The last element becomes first.', 'Negative values move like any other.'],
    hints: ['You can simply print from index n-1 down to 0.', 'Or swap a[i] with a[n-1-i] for half of the array.', 'Avoid a trailing space after the last number.'],
    solution: c`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
    for (int i = 0; i < n; i++) {
        if (i) printf(" ");
        printf("%d", a[i]);
    }
    printf("\n");
    return 0;
}`,
    explanation: 'Two indexes move toward each other swapping pairs; this reverses in place using O(1) extra memory.',
    keywords: ['scanf', 'printf', '\\['],
  }),
  mk({
    id: 'matrix-add-transpose',
    module: 'm4',
    level: 'Medium',
    title: 'Matrix Addition and Transpose',
    statement: 'Read two r x c matrices A and B. Print A + B, then a line containing three dashes, then the transpose of A + B.',
    input: 'First line r and c. Then r lines for A, then r lines for B.',
    output: 'The sum matrix (r lines), "---", then the transposed sum (c lines). Elements separated by spaces.',
    constraints: ['1 <= r, c <= 10', '-1000 <= element <= 1000'],
    tests: [
      ['2 3\n1 2 3\n4 5 6\n1 1 1\n2 2 2', '2 3 4\n6 7 8\n---\n2 6\n3 7\n4 8'],
      ['1 1\n5\n-5', '0\n---\n0'],
      ['2 2\n1 0\n0 1\n1 2\n3 4', '2 2\n3 5\n---\n2 3\n2 5'],
      ['3 1\n1\n2\n3\n3\n2\n1', '4\n4\n4\n---\n4 4 4'],
    ],
    why: ['Add element by element, then swap rows and columns of the result.', 'A 1x1 matrix is its own transpose.'],
    hints: ['Use two 2D arrays for input and one for the sum.', 'Transpose output: loop columns outside, rows inside.', 'Print spaces between numbers, not after the last one.'],
    solution: c`#include <stdio.h>

int main() {
    int r, c, a[10][10], b[10][10], s[10][10];
    scanf("%d %d", &r, &c);
    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) scanf("%d", &a[i][j]);
    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) scanf("%d", &b[i][j]);
    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) s[i][j] = a[i][j] + b[i][j];

    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) printf(j ? " %d" : "%d", s[i][j]);
        printf("\n");
    }
    printf("---\n");
    for (int j = 0; j < c; j++) {
        for (int i = 0; i < r; i++) printf(i ? " %d" : "%d", s[i][j]);
        printf("\n");
    }
    return 0;
}`,
    explanation: 'The transpose is printed by swapping the loop nesting: columns become rows. The conditional format string avoids a trailing space.',
    keywords: ['scanf', 'printf', '\\]\\['],
  }),
  mk({
    id: 'factorial-recursion',
    module: 'm4',
    level: 'Medium',
    title: 'Factorial Using Recursion',
    statement: 'Write a recursive function to compute n! and print the result.',
    input: 'One integer n.',
    output: 'n factorial.',
    constraints: ['0 <= n <= 20'],
    tests: [
      ['5', '120'],
      ['0', '1'],
      ['10', '3628800'],
      ['20', '2432902008176640000'],
      ['1', '1'],
    ],
    why: ['5 x 4 x 3 x 2 x 1 = 120.', '0! is defined as 1.'],
    hints: ['What is the simplest n whose factorial you know without calculating?', 'n! = n * (n - 1)!', 'Use long long: 20! does not fit in an int.'],
    solution: c`#include <stdio.h>

long long fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%lld\n", fact(n));
    return 0;
}`,
    explanation: 'The base case 0! = 1! = 1 stops the recursion; each call multiplies n with the result of the smaller problem.',
    keywords: ['scanf', 'printf', 'fact'],
  }),
  mk({
    id: 'fibonacci-recursion',
    module: 'm4',
    level: 'Medium',
    title: 'Fibonacci Using Recursion',
    statement: 'Write a recursive function fib(n) where fib(0) = 0, fib(1) = 1 and fib(n) = fib(n-1) + fib(n-2). Print fib(n).',
    input: 'One integer n.',
    output: 'The nth Fibonacci number.',
    constraints: ['0 <= n <= 30'],
    tests: [
      ['6', '8'],
      ['10', '55'],
      ['0', '0'],
      ['1', '1'],
      ['25', '75025'],
    ],
    why: ['0 1 1 2 3 5 8: the sixth term is 8.', 'The tenth term is 55.'],
    hints: ['There are two base cases.', 'The recursive case adds the two previous terms.', 'n up to 30 is fast enough with plain recursion.'],
    solution: c`#include <stdio.h>

int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", fib(n));
    return 0;
}`,
    explanation: 'Base cases return n itself for 0 and 1. Otherwise two recursive calls combine into the sum.',
    keywords: ['scanf', 'printf', 'fib'],
  }),
  mk({
    id: 'matrix-multiply',
    module: 'm4',
    level: 'Hard',
    title: 'Matrix Multiplication',
    statement: 'Multiply an r1 x c1 matrix A by a c1 x c2 matrix B and print the r1 x c2 product.',
    input: 'First line r1 c1 c2. Then r1 lines for A, then c1 lines for B.',
    output: 'The product matrix, one row per line, elements separated by spaces.',
    constraints: ['1 <= r1, c1, c2 <= 10', '-100 <= element <= 100'],
    tests: [
      ['2 2 2\n1 2\n3 4\n5 6\n7 8', '19 22\n43 50'],
      ['1 3 1\n1 2 3\n4\n5\n6', '32'],
      ['2 3 2\n1 0 2\n-1 3 1\n3 1\n2 1\n1 0', '5 1\n4 2'],
      ['2 2 2\n1 0\n0 1\n9 8\n7 6', '9 8\n7 6'],
    ],
    why: ['Row 1 x column 1 = 1*5 + 2*7 = 19, and so on.', 'The dot product 1*4 + 2*5 + 3*6 = 32.'],
    hints: ['You need three nested loops: row, column, and the shared dimension.', 'p[i][j] = sum over k of a[i][k] * b[k][j].', 'Reset the accumulator to 0 for every (i, j).'],
    solution: c`#include <stdio.h>

int main() {
    int r1, c1, c2, a[10][10], b[10][10];
    scanf("%d %d %d", &r1, &c1, &c2);
    for (int i = 0; i < r1; i++) for (int k = 0; k < c1; k++) scanf("%d", &a[i][k]);
    for (int k = 0; k < c1; k++) for (int j = 0; j < c2; j++) scanf("%d", &b[k][j]);

    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            int sum = 0;
            for (int k = 0; k < c1; k++) sum += a[i][k] * b[k][j];
            printf(j ? " %d" : "%d", sum);
        }
        printf("\n");
    }
    return 0;
}`,
    explanation: 'Each output cell is the dot product of a row of A with a column of B. The inner k loop accumulates the products.',
    keywords: ['scanf', 'printf', '\\]\\[.*\\*'],
  }),
  mk({
    id: 'tower-of-hanoi',
    module: 'm4',
    level: 'Hard',
    title: 'Tower of Hanoi',
    statement: 'Move n disks from rod A to rod C using rod B as a helper, one disk at a time, never placing a larger disk on a smaller one. Print each move and finally the total number of moves. Use recursion with the standard order: move n-1 disks A to B, move disk n A to C, move n-1 disks B to C.',
    input: 'One integer n.',
    output: 'Lines "Move disk d from X to Y", then "Total moves: T".',
    constraints: ['1 <= n <= 10'],
    tests: [
      ['1', hanoi(1)],
      ['2', hanoi(2)],
      ['3', hanoi(3)],
      ['4', hanoi(4)],
    ],
    why: ['A single disk moves directly from A to C.', 'The small disk goes to B, the large to C, then the small disk follows.'],
    hints: ['The base case is zero disks: do nothing.', 'The helper rod swaps roles in the two recursive calls.', 'Count moves with a global counter or compute 2^n - 1.'],
    solution: c`#include <stdio.h>

int moves = 0;

void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;
    hanoi(n - 1, from, via, to);
    printf("Move disk %d from %c to %c\n", n, from, to);
    moves++;
    hanoi(n - 1, via, to, from);
}

int main() {
    int n;
    scanf("%d", &n);
    hanoi(n, 'A', 'C', 'B');
    printf("Total moves: %d\n", moves);
    return 0;
}`,
    explanation: 'To move n disks you must first clear the n-1 above it onto the spare rod, move the largest, then bring the n-1 back. The total is 2^n - 1.',
    keywords: ['scanf', 'printf', 'hanoi'],
  }),
  mk({
    id: 'spiral-matrix',
    module: 'm4',
    level: 'Hard',
    title: 'Spiral Traversal',
    statement: 'Print the elements of an r x c matrix in clockwise spiral order, starting from the top-left corner.',
    input: 'First line r and c, then r lines of c integers.',
    output: 'The elements in spiral order on one line separated by spaces.',
    constraints: ['1 <= r, c <= 10'],
    tests: [
      ['3 3\n1 2 3\n4 5 6\n7 8 9', '1 2 3 6 9 8 7 4 5'],
      ['3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12', '1 2 3 4 8 12 11 10 9 5 6 7'],
      ['1 4\n1 2 3 4', '1 2 3 4'],
      ['4 1\n1\n2\n3\n4', '1 2 3 4'],
      ['2 2\n1 2\n3 4', '1 2 4 3'],
    ],
    why: ['Go right along the top, down the right side, left along the bottom, up the left side, then the centre.', 'Same walk on a rectangle.'],
    hints: ['Keep four boundaries: top, bottom, left and right.', 'Walk one side, then shrink the matching boundary.', 'After the right-to-left and bottom-to-top walks, check that rows or columns remain.'],
    solution: c`#include <stdio.h>

int main() {
    int r, c, m[10][10];
    scanf("%d %d", &r, &c);
    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) scanf("%d", &m[i][j]);

    int top = 0, bottom = r - 1, left = 0, right = c - 1, first = 1;
    #define OUT(v) do { if (!first) printf(" "); printf("%d", v); first = 0; } while (0)
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) OUT(m[top][j]);
        top++;
        for (int i = top; i <= bottom; i++) OUT(m[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) OUT(m[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) OUT(m[i][left]);
            left++;
        }
    }
    printf("\n");
    return 0;
}`,
    explanation: 'The four boundaries shrink after each side is printed. The two guard conditions prevent printing a row or column twice when the matrix is not square.',
    keywords: ['scanf', 'printf', 'while'],
  }),
]
