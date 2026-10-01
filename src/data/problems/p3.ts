import { mk, c } from './helper'

const table = (n: number) => Array.from({ length: 10 }, (_, i) => `${n} x ${i + 1} = ${n * (i + 1)}`).join('\n')

export const P3 = [
  mk({
    id: 'sign-check',
    module: 'm3',
    level: 'Easy',
    title: 'Positive, Negative or Zero',
    statement: 'Read an integer and print Positive, Negative or Zero depending on its sign.',
    input: 'One integer n.',
    output: 'Positive, Negative or Zero.',
    constraints: ['-1000000 <= n <= 1000000'],
    tests: [
      ['5', 'Positive'],
      ['-2', 'Negative'],
      ['0', 'Zero'],
      ['-100', 'Negative'],
      ['99999', 'Positive'],
    ],
    why: ['5 is greater than zero.', '-2 is less than zero.'],
    hints: ['Three outcomes need an else-if ladder.', 'Test n > 0 first, then n < 0.', 'Anything left over must be zero, so the final branch is a plain else.'],
    solution: c`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n > 0) printf("Positive\n");
    else if (n < 0) printf("Negative\n");
    else printf("Zero\n");
    return 0;
}`,
    explanation: 'The ladder checks the two signed cases and lets else handle zero.',
    keywords: ['scanf', 'printf', 'if'],
  }),
  mk({
    id: 'student-division',
    module: 'm3',
    level: 'Easy',
    title: 'Student Percentage and Division',
    statement: 'Read the marks (out of 100) in five subjects. Print the percentage and the division using nested if-else. 60 or more: First, 50 or more: Second, 40 or more: Third, below 40: Fail.',
    input: 'Five integers on one line.',
    output: 'Two lines: "Percentage: P" (2 decimals) and "Division: D".',
    constraints: ['0 <= marks <= 100'],
    tests: [
      ['80 70 90 60 100', 'Percentage: 80.00\nDivision: First'],
      ['45 50 40 55 60', 'Percentage: 50.00\nDivision: Second'],
      ['30 35 40 45 50', 'Percentage: 40.00\nDivision: Third'],
      ['10 20 30 20 10', 'Percentage: 18.00\nDivision: Fail'],
      ['59 59 59 59 59', 'Percentage: 59.00\nDivision: Second'],
      ['60 60 60 60 60', 'Percentage: 60.00\nDivision: First'],
    ],
    why: ['Total 400 out of 500 is 80%, which is First division.', 'Total 250 out of 500 is 50%, exactly the Second division threshold.'],
    hints: ['Percentage = total / 5.0 because each subject is out of 100.', 'Check the highest threshold first, inside an if-else chain.', 'Use 5.0 (a double) so the division is not truncated.'],
    solution: c`#include <stdio.h>

int main() {
    int m, total = 0;
    for (int i = 0; i < 5; i++) {
        scanf("%d", &m);
        total += m;
    }
    double p = total / 5.0;
    printf("Percentage: %.2f\n", p);
    if (p >= 60) printf("Division: First\n");
    else {
        if (p >= 50) printf("Division: Second\n");
        else {
            if (p >= 40) printf("Division: Third\n");
            else printf("Division: Fail\n");
        }
    }
    return 0;
}`,
    explanation: 'The total is accumulated in a loop. The nested if-else tests thresholds from highest to lowest so only the first match runs.',
    keywords: ['scanf', 'printf', 'if', 'else'],
  }),
  mk({
    id: 'sum-to-n',
    module: 'm3',
    level: 'Easy',
    title: 'Sum of 1 to N',
    statement: 'Read n and print the sum 1 + 2 + ... + n using a loop.',
    input: 'One integer n.',
    output: 'The sum.',
    constraints: ['0 <= n <= 100000'],
    tests: [
      ['5', '15'],
      ['100', '5050'],
      ['1', '1'],
      ['0', '0'],
      ['1000', '500500'],
    ],
    why: ['1+2+3+4+5 = 15.', 'The classic sum 1..100 equals 5050.'],
    hints: ['Start a total at 0.', 'A for loop from 1 to n adds each number.', 'Use long long for the total to be safe.'],
    solution: c`#include <stdio.h>

int main() {
    int n;
    long long sum = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) sum += i;
    printf("%lld\n", sum);
    return 0;
}`,
    explanation: 'A simple accumulator loop. For n = 0 the loop body never runs and the sum stays 0.',
    keywords: ['scanf', 'printf', 'for|while'],
  }),
  mk({
    id: 'mult-table',
    module: 'm3',
    level: 'Medium',
    title: 'Multiplication Table',
    statement: 'Print the multiplication table of n from 1 to 10.',
    input: 'One integer n.',
    output: 'Ten lines in the form: n x i = result',
    constraints: ['1 <= n <= 1000'],
    tests: [
      ['3', table(3)],
      ['12', table(12)],
      ['1', table(1)],
      ['999', table(999)],
    ],
    why: ['Each line multiplies 3 by the counter.', 'The same pattern with n = 12.'],
    hints: ['A for loop from 1 to 10 gives the counter.', 'Each line needs n, i and n * i.', 'printf("%d x %d = %d\\n", n, i, n * i);'],
    solution: c`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= 10; i++)
        printf("%d x %d = %d\n", n, i, n * i);
    return 0;
}`,
    explanation: 'One loop, one printf. The format string reproduces the exact layout required.',
    keywords: ['scanf', 'printf', 'for|while'],
  }),
  mk({
    id: 'digit-sum',
    module: 'm3',
    level: 'Medium',
    title: 'Count Digits and Sum of Digits',
    statement: 'Read a positive integer. Print how many digits it has and the sum of those digits using a while loop.',
    input: 'One positive integer n.',
    output: 'Two lines: "Digits: D" and "Sum: S".',
    constraints: ['1 <= n <= 1000000000'],
    tests: [
      ['1234', 'Digits: 4\nSum: 10'],
      ['9', 'Digits: 1\nSum: 9'],
      ['100000', 'Digits: 6\nSum: 1'],
      ['98765', 'Digits: 5\nSum: 35'],
      ['7', 'Digits: 1\nSum: 7'],
    ],
    why: ['1234 has four digits and 1+2+3+4 = 10.', 'A single digit counts as one digit.'],
    hints: ['n % 10 gives the last digit.', 'n / 10 removes the last digit.', 'Loop while n > 0, counting and summing together.'],
    solution: c`#include <stdio.h>

int main() {
    int n, digits = 0, sum = 0;
    scanf("%d", &n);
    while (n > 0) {
        sum += n % 10;
        digits++;
        n /= 10;
    }
    printf("Digits: %d\nSum: %d\n", digits, sum);
    return 0;
}`,
    explanation: 'Each iteration peels off one digit with % and /, counting it and adding it to the sum.',
    keywords: ['scanf', 'printf', '%\\s*10', 'while'],
  }),
  mk({
    id: 'calculator-switch',
    module: 'm3',
    level: 'Medium',
    title: 'Simple Calculator with switch',
    statement: 'Read two numbers and an operator (+ - * /). Use a switch to compute the result. Print it with 2 decimals. If you divide by zero print Error. For any other operator print Invalid operator.',
    input: 'One line: number operator number, separated by spaces.',
    output: 'The result, Error, or Invalid operator.',
    constraints: ['Numbers are real values in [-10000, 10000]'],
    tests: [
      ['10 + 5', '15.00'],
      ['7 / 2', '3.50'],
      ['3 * 4', '12.00'],
      ['5 / 0', 'Error'],
      ['2.5 - 4', '-1.50'],
      ['8 % 3', 'Invalid operator'],
    ],
    why: ['10 + 5 = 15.', '7 divided by 2 is 3.5 because the operands are doubles.'],
    hints: ['Read with scanf("%lf %c %lf") - note the spaces.', 'Each operator is one case label with a break.', 'Check b == 0 inside the division case.'],
    solution: c`#include <stdio.h>

int main() {
    double a, b;
    char op;
    scanf("%lf %c %lf", &a, &op, &b);
    switch (op) {
        case '+': printf("%.2f\n", a + b); break;
        case '-': printf("%.2f\n", a - b); break;
        case '*': printf("%.2f\n", a * b); break;
        case '/':
            if (b == 0) printf("Error\n");
            else printf("%.2f\n", a / b);
            break;
        default:
            printf("Invalid operator\n");
    }
    return 0;
}`,
    explanation: 'switch selects the branch by the operator character. The space before %c in scanf skips whitespace so op receives the symbol.',
    keywords: ['scanf', 'switch', 'case'],
  }),
  mk({
    id: 'running-total',
    module: 'm3',
    level: 'Medium',
    title: 'Running Total with static',
    statement: 'Write a function add(int x) that uses a static local variable to keep a running total and returns it. Read n numbers and print the running total after each one.',
    input: 'First line n, second line n integers.',
    output: 'n lines, the running total after each number.',
    constraints: ['1 <= n <= 100', '-1000 <= value <= 1000'],
    tests: [
      ['4\n3 5 2 10', '3\n8\n10\n20'],
      ['3\n-1 1 -1', '-1\n0\n-1'],
      ['1\n7', '7'],
      ['5\n1 1 1 1 1', '1\n2\n3\n4\n5'],
    ],
    why: ['3, then 3+5, then 8+2, then 10+10.', 'The total goes -1, 0, -1.'],
    hints: ['A static local keeps its value between function calls.', 'Declare static int total = 0; inside add.', 'add does total += x; return total;'],
    solution: c`#include <stdio.h>

int add(int x) {
    static int total = 0;
    total += x;
    return total;
}

int main() {
    int n, x;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        printf("%d\n", add(x));
    }
    return 0;
}`,
    explanation: 'The initialiser runs only once. Every later call continues from the previous value of total.',
    keywords: ['static', 'scanf', 'printf'],
  }),
  mk({
    id: 'pyramid',
    module: 'm3',
    level: 'Hard',
    title: 'Pyramid Pattern',
    statement: 'Print a centred pyramid of n rows. Row i (starting at 1) has n - i leading spaces followed by 2i - 1 asterisks. Do not print trailing spaces.',
    input: 'One integer n.',
    output: 'n lines forming the pyramid.',
    constraints: ['1 <= n <= 30'],
    tests: [
      ['3', '  *\n ***\n*****'],
      ['1', '*'],
      ['4', '   *\n  ***\n *****\n*******'],
      ['5', '    *\n   ***\n  *****\n *******\n*********'],
    ],
    why: ['Row 1 has 2 spaces and 1 star, row 2 has 1 space and 3 stars, row 3 has 5 stars.', 'A single row is one star.'],
    hints: ['Use an outer loop for rows and two inner loops: one for spaces, one for stars.', 'Spaces: n - i. Stars: 2 * i - 1.', 'Print a newline after each row.'],
    solution: c`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        for (int s = 0; s < n - i; s++) putchar(' ');
        for (int k = 0; k < 2 * i - 1; k++) putchar('*');
        putchar('\n');
    }
    return 0;
}`,
    explanation: 'Nested loops: for every row the first inner loop pads, the second draws the stars. The star count grows by 2 per row.',
    keywords: ['scanf', 'for', 'putchar|printf'],
  }),
  mk({
    id: 'armstrong-range',
    module: 'm3',
    level: 'Hard',
    title: 'Armstrong Numbers in a Range',
    statement: 'An Armstrong number equals the sum of its digits each raised to the power of the number of digits (153 = 1^3 + 5^3 + 3^3). Print all Armstrong numbers between lo and hi inclusive on one line, separated by spaces. If there are none, print None.',
    input: 'Two integers lo and hi.',
    output: 'The Armstrong numbers in ascending order, or None.',
    constraints: ['1 <= lo <= hi <= 100000'],
    tests: [
      ['100 500', '153 370 371 407'],
      ['1 9', '1 2 3 4 5 6 7 8 9'],
      ['10 99', 'None'],
      ['9474 9475', '9474'],
      ['1 500', '1 2 3 4 5 6 7 8 9 153 370 371 407'],
    ],
    why: ['153, 370, 371 and 407 are the three-digit Armstrong numbers.', 'Every single digit number is its own power.'],
    hints: ['For each candidate first count its digits.', 'Then sum each digit raised to that count (write a small loop, avoid pow floating errors).', 'Track whether you printed anything to decide on None.'],
    solution: c`#include <stdio.h>

int main() {
    int lo, hi, found = 0;
    scanf("%d %d", &lo, &hi);
    for (int n = lo; n <= hi; n++) {
        int digits = 0, t = n;
        while (t > 0) { digits++; t /= 10; }
        long long sum = 0;
        t = n;
        while (t > 0) {
            int d = t % 10, p = 1;
            for (int i = 0; i < digits; i++) p *= d;
            sum += p;
            t /= 10;
        }
        if (sum == n) {
            if (found) printf(" ");
            printf("%d", n);
            found = 1;
        }
    }
    if (!found) printf("None");
    printf("\n");
    return 0;
}`,
    explanation: 'Three nested loops: over candidates, over digits, and a small power loop. Integer power avoids the rounding issues of pow().',
    keywords: ['scanf', 'printf', 'for', 'None'],
  }),
  mk({
    id: 'prime-factors',
    module: 'm3',
    level: 'Hard',
    title: 'Prime Factorization',
    statement: 'Print the prime factorization of n in the form p^e * p^e in increasing order of primes. Always print the exponent, even when it is 1.',
    input: 'One integer n.',
    output: 'The factorization, for example 2^3 * 3^2 * 5^1.',
    constraints: ['2 <= n <= 10^12'],
    tests: [
      ['12', '2^2 * 3^1'],
      ['17', '17^1'],
      ['360', '2^3 * 3^2 * 5^1'],
      ['1024', '2^10'],
      ['999983', '999983^1'],
      ['600851475143', '71^1 * 839^1 * 1471^1 * 6857^1'],
    ],
    why: ['12 = 2 x 2 x 3.', '17 is prime, so it is its own factorization.'],
    hints: ['Try divisors d = 2, 3, 4... while d * d <= n.', 'For each d, divide n repeatedly and count the exponent.', 'If n > 1 after the loop, what remains is one last prime.'],
    solution: c`#include <stdio.h>

int main() {
    long long n;
    int first = 1;
    scanf("%lld", &n);
    for (long long d = 2; d * d <= n; d++) {
        int e = 0;
        while (n % d == 0) { n /= d; e++; }
        if (e) {
            printf("%s%lld^%d", first ? "" : " * ", d, e);
            first = 0;
        }
    }
    if (n > 1) printf("%s%lld^1", first ? "" : " * ", n);
    printf("\n");
    return 0;
}`,
    explanation: 'Dividing out each factor completely guarantees that later divisors are prime. Stopping at sqrt(n) is enough: any remainder greater than 1 is a prime.',
    keywords: ['scanf', 'printf', '%'],
  }),
]
