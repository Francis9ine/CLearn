import { mk, c } from './helper'

export const P2 = [
  mk({
    id: 'simple-interest',
    module: 'm2',
    level: 'Easy',
    title: 'Simple Interest Calculator',
    statement: 'Calculate the simple interest on a principal amount for a number of years. The rate is fixed at 5.75 percent per year. Simple interest = principal x rate x time / 100.',
    input: 'Two real numbers: principal and time in years.',
    output: 'The interest with 2 decimal places.',
    constraints: ['0 <= principal <= 1000000', '0 <= time <= 50'],
    tests: [
      ['1000 2', '115.00'],
      ['5000 1', '287.50'],
      ['2500 3', '431.25'],
      ['0 5', '0.00'],
      ['800 1.5', '69.00'],
    ],
    why: ['1000 x 5.75 x 2 / 100 = 115.', '5000 x 5.75 x 1 / 100 = 287.5.'],
    hints: [
      'Read both values as double with %lf.',
      'Store the rate in a const double or a #define.',
      'Print the result with %.2f.',
    ],
    solution: c`#include <stdio.h>
#define RATE 5.75

int main() {
    double p, t;
    scanf("%lf %lf", &p, &t);
    printf("%.2f\n", p * RATE * t / 100);
    return 0;
}`,
    explanation: 'The fixed rate is a named constant. All operands are double, so no integer division truncates the result.',
    keywords: ['scanf', 'printf', '5\\.75'],
  }),
  mk({
    id: 'swap-two',
    module: 'm2',
    level: 'Easy',
    title: 'Swap Two Numbers',
    statement: 'Read two integers a and b, swap their values using a temporary variable, and print the new values.',
    input: 'Two integers a and b.',
    output: 'One line in the form: a=<new a> b=<new b>',
    constraints: ['-1000000 <= a, b <= 1000000'],
    tests: [
      ['3 8', 'a=8 b=3'],
      ['-1 4', 'a=4 b=-1'],
      ['0 0', 'a=0 b=0'],
      ['100 -100', 'a=-100 b=100'],
    ],
    why: ['After the swap a holds 8 and b holds 3.', 'The negative sign travels with its value.'],
    hints: [
      'You need a third variable to hold one value while you overwrite it.',
      'temp = a; a = b; b = temp;',
      'Print with the exact text a=%d b=%d.',
    ],
    solution: c`#include <stdio.h>

int main() {
    int a, b, temp;
    scanf("%d %d", &a, &b);
    temp = a;
    a = b;
    b = temp;
    printf("a=%d b=%d\n", a, b);
    return 0;
}`,
    explanation: 'Overwriting a first would lose its value, so it is saved in temp before the assignments.',
    keywords: ['scanf', 'printf'],
  }),
  mk({
    id: 'post-increment',
    module: 'm2',
    level: 'Easy',
    title: 'Evaluate x = 5 * y++',
    statement: 'Read an integer y, evaluate x = 5 * y++ in a single statement, then print x and y. This tests your understanding of the postfix increment operator.',
    input: 'One integer y.',
    output: 'x and y separated by a space.',
    constraints: ['-1000 <= y <= 1000'],
    tests: [
      ['5', '25 6'],
      ['0', '0 1'],
      ['-2', '-10 -1'],
      ['10', '50 11'],
    ],
    why: ['y++ yields the old value 5, so x = 25. Afterwards y is 6.', 'x = 5 * 0 = 0, then y becomes 1.'],
    hints: [
      'Postfix ++ uses the current value first.',
      'The increment happens after the value has been used in the expression.',
      'Write int x = 5 * y++; and then print both variables.',
    ],
    solution: c`#include <stdio.h>

int main() {
    int y;
    scanf("%d", &y);
    int x = 5 * y++;
    printf("%d %d\n", x, y);
    return 0;
}`,
    explanation: 'In y++ the value of the expression is the old y; the increment of y is applied afterwards. So x uses the original y, and y ends up one larger.',
    keywords: ['scanf', 'printf', 'y\\+\\+'],
  }),
  mk({
    id: 'even-odd',
    module: 'm2',
    level: 'Easy',
    title: 'Check Even or Odd',
    statement: 'Read an integer and print Even if it is divisible by 2, otherwise print Odd.',
    input: 'One integer n.',
    output: 'Even or Odd.',
    constraints: ['-1000000000 <= n <= 1000000000'],
    tests: [
      ['4', 'Even'],
      ['7', 'Odd'],
      ['0', 'Even'],
      ['-3', 'Odd'],
      ['-8', 'Even'],
    ],
    why: ['4 % 2 is 0.', '7 % 2 is 1.'],
    hints: [
      'The remainder operator % tells you if a number divides evenly.',
      'In C, -3 % 2 is -1, not 1.',
      'Test n % 2 == 0 (or n % 2 != 0 for odd).',
    ],
    solution: c`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%s\n", (n % 2 == 0) ? "Even" : "Odd");
    return 0;
}`,
    explanation: 'Checking == 0 works for negatives too. Checking == 1 for odd would fail because -3 % 2 is -1.',
    keywords: ['scanf', 'printf', '%'],
  }),
  mk({
    id: 'bitwise-ops',
    module: 'm2',
    level: 'Medium',
    title: 'Bitwise Operations',
    statement: 'Read two non-negative integers a and b. Print the results of a & b, a | b, a ^ b, a << 1 and a >> 1, each on its own labelled line.',
    input: 'Two integers a and b.',
    output: 'Five lines: "AND: x", "OR: x", "XOR: x", "LEFT: x", "RIGHT: x". LEFT and RIGHT use a.',
    constraints: ['0 <= a, b <= 30000'],
    tests: [
      ['12 10', 'AND: 8\nOR: 14\nXOR: 6\nLEFT: 24\nRIGHT: 6'],
      ['5 3', 'AND: 1\nOR: 7\nXOR: 6\nLEFT: 10\nRIGHT: 2'],
      ['0 0', 'AND: 0\nOR: 0\nXOR: 0\nLEFT: 0\nRIGHT: 0'],
      ['255 15', 'AND: 15\nOR: 255\nXOR: 240\nLEFT: 510\nRIGHT: 127'],
      ['1 2', 'AND: 0\nOR: 3\nXOR: 3\nLEFT: 2\nRIGHT: 0'],
    ],
    why: ['1100 & 1010 = 1000 (8), OR = 1110 (14), XOR = 0110 (6); 12<<1 = 24 and 12>>1 = 6.', '101 & 011 = 001; OR = 111; XOR = 110; 5<<1 = 10; 5>>1 = 2.'],
    hints: ['Each result is a single operator applied to the inputs.', 'The shift operators are << and >>.', 'Use printf("AND: %d\\n", a & b); and so on.'],
    solution: c`#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("AND: %d\n", a & b);
    printf("OR: %d\n", a | b);
    printf("XOR: %d\n", a ^ b);
    printf("LEFT: %d\n", a << 1);
    printf("RIGHT: %d\n", a >> 1);
    return 0;
}`,
    explanation: 'Direct use of the five bitwise operators. Shifting left by one doubles a; shifting right by one halves it (truncating).',
    keywords: ['scanf', '&', '\\^', '<<', '>>'],
  }),
  mk({
    id: 'max-of-three',
    module: 'm2',
    level: 'Medium',
    title: 'Largest of Three (Conditional Operator)',
    statement: 'Read three integers and print the largest. Use the conditional operator ?: instead of if statements.',
    input: 'Three integers.',
    output: 'The largest value.',
    constraints: ['-1000000 <= each <= 1000000'],
    tests: [
      ['3 9 5', '9'],
      ['-1 -5 -3', '-1'],
      ['7 7 7', '7'],
      ['10 2 10', '10'],
      ['0 -1 1', '1'],
    ],
    why: ['9 is larger than 3 and 5.', 'Among negatives, -1 is the greatest.'],
    hints: [
      'First find the larger of a and b.',
      'Then compare that result with c.',
      'int m = (a > b) ? a : b; then (m > c) ? m : c',
    ],
    solution: c`#include <stdio.h>

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    int m = (a > b) ? a : b;
    m = (m > c) ? m : c;
    printf("%d\n", m);
    return 0;
}`,
    explanation: 'The ?: operator is an if-else that produces a value. Chaining two of them yields the maximum of three numbers.',
    keywords: ['scanf', 'printf', '\\?'],
  }),
  mk({
    id: 'precedence',
    module: 'm2',
    level: 'Medium',
    title: 'Operator Precedence Evaluator',
    statement: 'Read three integers a, b and c and print the values of these four expressions on separate lines: a + b * c, (a + b) * c, a - b - c, a / b * c. Use integer arithmetic.',
    input: 'Three integers a, b, c with b > 0.',
    output: 'Four lines, one per expression, in the order above.',
    constraints: ['1 <= b <= 1000', '0 <= a, c <= 1000'],
    tests: [
      ['10 3 2', '16\n26\n5\n6'],
      ['7 2 5', '17\n45\n0\n15'],
      ['1 1 1', '2\n2\n-1\n1'],
      ['20 4 3', '32\n72\n13\n15'],
      ['100 7 0', '100\n0\n93\n0'],
    ],
    why: ['10 + 3*2 = 16; (10+3)*2 = 26; 10-3-2 = 5; 10/3 = 3 then 3*2 = 6.', '7/2 = 3 (integer division) then 3*5 = 15.'],
    hints: ['Write each expression exactly as the statement shows and let C evaluate it.', '/ and * have the same precedence and associate left to right.', 'Integer division truncates before the multiplication.'],
    solution: c`#include <stdio.h>

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    printf("%d\n", a + b * c);
    printf("%d\n", (a + b) * c);
    printf("%d\n", a - b - c);
    printf("%d\n", a / b * c);
    return 0;
}`,
    explanation: 'Multiplication binds tighter than addition, parentheses override it, and operators of equal precedence group from left to right.',
    keywords: ['scanf', 'printf', '\\*'],
  }),
  mk({
    id: 'extract-bits',
    module: 'm2',
    level: 'Hard',
    title: 'Extract a Bit Field',
    statement: 'Given an unsigned integer n, a start position p (bit 0 is the least significant) and a length k, print the unsigned value of the k bits of n that begin at position p.',
    input: 'Three integers: n, p, k.',
    output: 'The extracted value.',
    constraints: ['0 <= n < 2^32', '0 <= p < 32', '1 <= k <= 31', 'p + k <= 32'],
    tests: [
      ['181 2 3', '5'],
      ['255 4 4', '15'],
      ['0 0 1', '0'],
      ['1024 10 1', '1'],
      ['43981 4 8', '188'],
    ],
    why: ['181 is 10110101. Bits 2..4 are 101, which is 5.', '255 is all ones. Any 4 bits of it give 1111 = 15.'],
    hints: ['Shift the field down to bit 0 with n >> p.', 'Build a mask of k ones with (1u << k) - 1.', 'Result: (n >> p) & mask, using unsigned types.'],
    solution: c`#include <stdio.h>

int main() {
    unsigned int n, p, k;
    scanf("%u %u %u", &n, &p, &k);
    unsigned int mask = (1u << k) - 1;
    printf("%u\n", (n >> p) & mask);
    return 0;
}`,
    explanation: 'Shifting right brings the wanted bits to the bottom. The mask (1<<k)-1 keeps only the lowest k bits. Unsigned types make the shifts well defined.',
    keywords: ['scanf', '>>', '&'],
  }),
  mk({
    id: 'next-power-two',
    module: 'm2',
    level: 'Hard',
    title: 'Power of Two and the Next One',
    statement: 'On the first line print Yes if n is a power of two, otherwise No. On the second line print the smallest power of two that is greater than or equal to n.',
    input: 'One integer n.',
    output: 'Two lines: Yes or No, then the next power of two.',
    constraints: ['1 <= n <= 1000000000'],
    tests: [
      ['16', 'Yes\n16'],
      ['20', 'No\n32'],
      ['1', 'Yes\n1'],
      ['1000', 'No\n1024'],
      ['536870912', 'Yes\n536870912'],
      ['1000000000', 'No\n1073741824'],
    ],
    why: ['16 = 10000 in binary: exactly one set bit.', '20 is not a power of two; the next one up is 32.'],
    hints: ['A power of two has exactly one set bit, so n & (n - 1) is 0.', 'Start with p = 1 and double it while p < n.', 'Use unsigned long long so 2^30 does not overflow intermediate steps.'],
    solution: c`#include <stdio.h>

int main() {
    unsigned long long n, p = 1;
    scanf("%llu", &n);
    printf("%s\n", (n & (n - 1)) == 0 ? "Yes" : "No");
    while (p < n) p <<= 1;
    printf("%llu\n", p);
    return 0;
}`,
    explanation: 'Clearing the lowest set bit with n & (n-1) leaves zero only when n had a single bit set. Doubling with a left shift finds the next power.',
    keywords: ['scanf', 'printf', '<<|\\*'],
  }),
  mk({
    id: 'rotate-bits',
    module: 'm2',
    level: 'Hard',
    title: 'Rotate Bits Left',
    statement: 'Rotate a 32-bit unsigned integer left by k positions. Bits shifted out on the left re-enter on the right. Print the result as an unsigned decimal.',
    input: 'Two integers: n and k.',
    output: 'The rotated value.',
    constraints: ['0 <= n < 2^32', '0 <= k <= 31'],
    tests: [
      ['1 1', '2'],
      ['2147483648 1', '1'],
      ['305419896 8', '878082066'],
      ['123 0', '123'],
      ['4294967295 17', '4294967295'],
    ],
    why: ['The single bit moves from position 0 to position 1.', 'The top bit wraps around to bit 0.'],
    hints: ['A plain left shift loses the top k bits. Where should they go?', 'They are n >> (32 - k).', 'Beware k == 0: shifting by 32 is undefined, so handle it separately.'],
    solution: c`#include <stdio.h>

int main() {
    unsigned int n, k;
    scanf("%u %u", &n, &k);
    unsigned int r = (k == 0) ? n : (n << k) | (n >> (32 - k));
    printf("%u\n", r);
    return 0;
}`,
    explanation: 'Left part: n << k drops the high bits. Right part: n >> (32-k) delivers exactly those dropped bits to the bottom. OR-ing combines both.',
    keywords: ['scanf', '<<', '>>'],
  }),
]
