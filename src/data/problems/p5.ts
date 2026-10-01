import { mk, c } from './helper'

export const P5 = [
  mk({
    id: 'pointer-swap',
    module: 'm5',
    level: 'Easy',
    title: 'Swap Using Pointers',
    statement: 'Write a function swap(int *a, int *b) that exchanges two integers through their addresses. Read two numbers, call swap and print the result.',
    input: 'Two integers.',
    output: 'One line: After swap: <first> <second>',
    constraints: ['-1000000 <= value <= 1000000'],
    tests: [
      ['3 8', 'After swap: 8 3'],
      ['-5 5', 'After swap: 5 -5'],
      ['0 9', 'After swap: 9 0'],
      ['7 7', 'After swap: 7 7'],
    ],
    why: ['The two values trade places.', 'The signs stay attached to their values.'],
    hints: ['Call swap(&x, &y) so the function receives addresses.', 'Inside, use a temporary: int t = *a;', 'Assign *a = *b; *b = t;'],
    solution: c`#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("After swap: %d %d\n", x, y);
    return 0;
}`,
    explanation: 'Because C passes copies, the function needs the addresses. Dereferencing them modifies the caller variables.',
    keywords: ['\\*', '&', 'printf'],
  }),
  mk({
    id: 'pointer-array-sum',
    module: 'm5',
    level: 'Easy',
    title: 'Array Sum with Pointer Arithmetic',
    statement: 'Read n integers into an array and compute their sum using only a pointer and pointer arithmetic (*(p + i)), not array indexing, in the summing loop.',
    input: 'First line n, second line n integers.',
    output: 'The sum.',
    constraints: ['1 <= n <= 100', '-1000 <= value <= 1000'],
    tests: [
      ['4\n1 2 3 4', '10'],
      ['3\n-1 -2 -3', '-6'],
      ['1\n100', '100'],
      ['5\n0 0 0 0 0', '0'],
    ],
    why: ['1+2+3+4 = 10.', 'The sum of negatives is negative.'],
    hints: ['int *p = a; makes p point to the first element.', '*(p + i) is the same as a[i].', 'Add every element to a running total.'],
    solution: c`#include <stdio.h>

int main() {
    int n, a[100], sum = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", a + i);
    int *p = a;
    for (int i = 0; i < n; i++) sum += *(p + i);
    printf("%d\n", sum);
    return 0;
}`,
    explanation: 'Pointer arithmetic scales by the element size, so p + i points at the ith element. a + i is also a valid address for scanf.',
    keywords: ['scanf', 'printf', '\\*'],
  }),
  mk({
    id: 'string-length',
    module: 'm5',
    level: 'Easy',
    title: 'String Length',
    statement: 'Read a single word (no spaces) and print its length using the strlen function.',
    input: 'One word of at most 100 characters.',
    output: 'The length.',
    constraints: ['1 <= length <= 100'],
    tests: [
      ['hello', '5'],
      ['C', '1'],
      ['programming', '11'],
      ['abcdefghijklmnopqrstuvwxyz', '26'],
    ],
    why: ['"hello" has five characters.', 'A single character has length 1.'],
    hints: ['Include <string.h>.', 'Declare char s[101] so there is space for the terminator.', 'Print strlen(s) with %zu.'],
    solution: c`#include <stdio.h>
#include <string.h>

int main() {
    char s[101];
    scanf("%100s", s);
    printf("%zu\n", strlen(s));
    return 0;
}`,
    explanation: 'strlen counts characters before the null terminator. The buffer is one byte larger than the longest input to hold the terminator.',
    keywords: ['scanf', 'printf', 'strlen'],
  }),
  mk({
    id: 'count-vowels',
    module: 'm5',
    level: 'Medium',
    title: 'Count Vowels in a String',
    statement: 'Read a line of text and count the vowels (a, e, i, o, u in either case).',
    input: 'One line of text (it may contain spaces).',
    output: 'The number of vowels.',
    constraints: ['1 <= length <= 200'],
    tests: [
      ['Hello World', '3'],
      ['rhythm', '0'],
      ['AEIOU aeiou', '10'],
      ['C Programming Language', '7'],
    ],
    why: ['The vowels are e, o, o.', 'None of the letters in rhythm is a vowel.'],
    hints: ['Use fgets to read a whole line.', 'Convert each character with tolower before comparing.', 'Loop until the null terminator.'],
    solution: c`#include <stdio.h>
#include <ctype.h>

int main() {
    char s[256];
    int count = 0;
    fgets(s, sizeof s, stdin);
    for (int i = 0; s[i] != '\0'; i++) {
        char ch = tolower((unsigned char)s[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') count++;
    }
    printf("%d\n", count);
    return 0;
}`,
    explanation: 'fgets keeps the spaces that scanf("%s") would stop at. tolower removes the need to test both cases of each vowel.',
    keywords: ['printf', 'fgets|gets|scanf|getchar'],
  }),
  mk({
    id: 'palindrome-string',
    module: 'm5',
    level: 'Medium',
    title: 'Check Palindrome String',
    statement: 'Read a word and print Yes if it reads the same forwards and backwards, ignoring case, otherwise print No.',
    input: 'One word.',
    output: 'Yes or No.',
    constraints: ['1 <= length <= 100'],
    tests: [
      ['madam', 'Yes'],
      ['hello', 'No'],
      ['a', 'Yes'],
      ['abba', 'Yes'],
      ['abca', 'No'],
      ['Racecar', 'Yes'],
    ],
    why: ['madam is symmetrical.', 'hello reversed is olleh.'],
    hints: ['Compare the first and last characters, then move inward.', 'Use two indexes i and j = len - 1.', 'Compare tolower(s[i]) with tolower(s[j]).'],
    solution: c`#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char s[101];
    scanf("%100s", s);
    int i = 0, j = (int)strlen(s) - 1, ok = 1;
    while (i < j) {
        if (tolower((unsigned char)s[i]) != tolower((unsigned char)s[j])) { ok = 0; break; }
        i++;
        j--;
    }
    printf("%s\n", ok ? "Yes" : "No");
    return 0;
}`,
    explanation: 'Two indexes walk toward the middle. The first mismatch proves it is not a palindrome.',
    keywords: ['scanf', 'printf', 'strlen|\\\\0'],
  }),
  mk({
    id: 'concat-compare',
    module: 'm5',
    level: 'Medium',
    title: 'Concatenate and Compare Strings',
    statement: 'Read two words. Print their concatenation, the length of the concatenation, and then Equal if the two words are identical (case-sensitive) or Not equal otherwise. Use strcat, strlen and strcmp.',
    input: 'Two words on one line.',
    output: 'Three lines: the concatenation, its length, and Equal / Not equal.',
    constraints: ['Each word has 1 to 50 characters'],
    tests: [
      ['ab cd', 'abcd\n4\nNot equal'],
      ['hi hi', 'hihi\n4\nEqual'],
      ['x y', 'xy\n2\nNot equal'],
      ['Code Code', 'CodeCode\n8\nEqual'],
      ['abc ABC', 'abcABC\n6\nNot equal'],
    ],
    why: ['abcd has four characters and the words differ.', 'The same word twice is Equal.'],
    hints: ['Copy the first word into a larger buffer, then strcat the second.', 'Compare the original words before or after, but remember strcat changes the destination only.', 'strcmp returns 0 when strings are equal.'],
    solution: c`#include <stdio.h>
#include <string.h>

int main() {
    char a[51], b[51], both[101];
    scanf("%50s %50s", a, b);
    strcpy(both, a);
    strcat(both, b);
    printf("%s\n%zu\n", both, strlen(both));
    printf("%s\n", strcmp(a, b) == 0 ? "Equal" : "Not equal");
    return 0;
}`,
    explanation: 'The destination buffer is large enough for both words plus the terminator. strcmp returns 0 only for identical strings.',
    keywords: ['scanf', 'strcat|strcpy', 'strcmp'],
  }),
  mk({
    id: 'student-topper',
    module: 'm5',
    level: 'Medium',
    title: 'Class Topper with Structures',
    statement: 'Define a struct Student with a name and marks. Read n students and print the topper (the first student with the highest marks).',
    input: 'First line n, then n lines: name marks (marks may be decimal).',
    output: 'One line: Topper: <name> <marks with 1 decimal>',
    constraints: ['1 <= n <= 50', 'Names have no spaces and at most 30 characters'],
    tests: [
      ['3\nAsha 91.5\nBen 78\nChen 85.25', 'Topper: Asha 91.5'],
      ['2\nZed 60\nYan 60', 'Topper: Zed 60.0'],
      ['1\nSolo 45', 'Topper: Solo 45.0'],
      ['4\nA 10\nB 99.5\nC 99.8\nD 50', 'Topper: C 99.8'],
    ],
    why: ['Asha has the highest marks, 91.5.', 'On a tie the first student read is the topper.'],
    hints: ['struct Student { char name[31]; double marks; };', 'Keep the index of the best student so far.', 'Use > (not >=) to keep the first on ties.'],
    solution: c`#include <stdio.h>

struct Student {
    char name[31];
    double marks;
};

int main() {
    int n, best = 0;
    struct Student s[50];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%30s %lf", s[i].name, &s[i].marks);
        if (s[i].marks > s[best].marks) best = i;
    }
    printf("Topper: %s %.1f\n", s[best].name, s[best].marks);
    return 0;
}`,
    explanation: 'An array of structures stores the records. Comparing with strict > ensures that equal marks keep the earlier student.',
    keywords: ['struct', 'scanf', 'printf'],
  }),
  mk({
    id: 'sort-structs',
    module: 'm5',
    level: 'Hard',
    title: 'Sort Students by Marks',
    statement: 'Read n students (name and integer marks) into an array of structures and print them sorted by marks in descending order. Students with equal marks must keep their original relative order (stable sort).',
    input: 'First line n, then n lines: name marks.',
    output: 'n lines: name marks.',
    constraints: ['1 <= n <= 50', '0 <= marks <= 100'],
    tests: [
      ['3\nAsha 91\nBen 78\nChen 85', 'Asha 91\nChen 85\nBen 78'],
      ['4\nA 50\nB 70\nC 50\nD 70', 'B 70\nD 70\nA 50\nC 50'],
      ['1\nZ 1', 'Z 1'],
      ['3\nX 5\nY 6\nZ 7', 'Z 7\nY 6\nX 5'],
      ['5\nP 40\nQ 40\nR 40\nS 90\nT 10', 'S 90\nP 40\nQ 40\nR 40\nT 10'],
    ],
    why: ['Sort by marks from high to low.', 'B and D tie at 70 and keep their input order, as do A and C.'],
    hints: ['Use bubble sort or insertion sort on the array of structs.', 'Swap whole structures with a temporary struct variable.', 'Only swap when the left marks are strictly smaller to keep the sort stable.'],
    solution: c`#include <stdio.h>

struct Student {
    char name[31];
    int marks;
};

int main() {
    int n;
    struct Student s[50];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%30s %d", s[i].name, &s[i].marks);

    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (s[j].marks < s[j + 1].marks) {
                struct Student t = s[j];
                s[j] = s[j + 1];
                s[j + 1] = t;
            }

    for (int i = 0; i < n; i++) printf("%s %d\n", s[i].name, s[i].marks);
    return 0;
}`,
    explanation: 'Structures can be copied with =, which makes swapping whole records easy. Bubble sort swaps only on strictly smaller, so equal elements never pass each other.',
    keywords: ['struct', 'scanf', 'printf'],
  }),
  mk({
    id: 'file-student-record',
    module: 'm5',
    level: 'Hard',
    title: 'Student Records with File Handling',
    statement:
      'Write n student records (roll, name, marks) to a text file "students.txt", close it, reopen it for reading and print every record back. Finally read a roll number and search the file for it, printing "Found: <name> <marks>" or "Not found".',
    input: 'First line n. Then n lines: roll name marks. Last line: the roll number to search.',
    output: 'The n records as "roll name marks", then the search result.',
    constraints: ['1 <= n <= 20', 'Names have no spaces', 'The sandbox must allow writing in the working directory'],
    tests: [
      ['2\n1 Asha 91\n2 Ben 78\n2', '1 Asha 91\n2 Ben 78\nFound: Ben 78'],
      ['1\n10 Zed 50\n99', '10 Zed 50\nNot found'],
      ['3\n5 A 1\n6 B 2\n7 C 3\n5', '5 A 1\n6 B 2\n7 C 3\nFound: A 1'],
      ['3\n5 A 1\n6 B 2\n7 C 3\n8', '5 A 1\n6 B 2\n7 C 3\nNot found'],
      ['1\n1 Solo 100\n1', '1 Solo 100\nFound: Solo 100'],
    ],
    why: ['Both records are written then read back; roll 2 belongs to Ben.', 'Roll 99 is not in the file.'],
    hints: ['Open with fopen("students.txt", "w"), write with fprintf and always fclose.', 'Reopen with "r" and loop while fscanf returns 3.', 'Search while reading: compare the roll and remember the match.'],
    solution: c`#include <stdio.h>

int main() {
    int n, roll, marks, query, found = 0;
    char name[31], fname[31] = "";
    int fmarks = 0;
    scanf("%d", &n);

    FILE *fp = fopen("students.txt", "w");
    if (fp == NULL) { printf("File error\n"); return 1; }
    for (int i = 0; i < n; i++) {
        scanf("%d %30s %d", &roll, name, &marks);
        fprintf(fp, "%d %s %d\n", roll, name, marks);
    }
    fclose(fp);
    scanf("%d", &query);

    fp = fopen("students.txt", "r");
    if (fp == NULL) { printf("File error\n"); return 1; }
    while (fscanf(fp, "%d %30s %d", &roll, name, &marks) == 3) {
        printf("%d %s %d\n", roll, name, marks);
        if (roll == query && !found) {
            found = 1;
            snprintf(fname, sizeof fname, "%s", name);
            fmarks = marks;
        }
    }
    fclose(fp);

    if (found) printf("Found: %s %d\n", fname, fmarks);
    else printf("Not found\n");
    return 0;
}`,
    explanation: 'The file is written, closed (flushing the data to disk) and reopened for reading. Looping on the fscanf return value stops cleanly at end of file.',
    keywords: ['fopen', 'fprintf', 'fscanf', 'fclose'],
  }),
  mk({
    id: 'manual-string-fns',
    module: 'm5',
    level: 'Hard',
    title: 'Implement strlen, strcmp and strcpy',
    statement: 'Without using <string.h>, implement myStrlen, myStrcmp and myStrcpy using pointers. Read two words a and b. Print: the lengths of a and b; the comparison of a with b (-1, 0 or 1); and a copy of a made with myStrcpy.',
    input: 'Two words a and b.',
    output: 'Three lines: "len(a) len(b)", the comparison result (-1, 0 or 1) and the copy of a.',
    constraints: ['Each word has 1 to 50 characters', 'Do not include <string.h>'],
    tests: [
      ['apple banana', '5 6\n-1\napple'],
      ['same same', '4 4\n0\nsame'],
      ['zebra apple', '5 5\n1\nzebra'],
      ['ab abc', '2 3\n-1\nab'],
      ['abc ab', '3 2\n1\nabc'],
      ['C c', '1 1\n-1\nC'],
    ],
    why: ['"apple" sorts before "banana", so the result is -1.', 'Identical strings compare as 0.'],
    hints: ['Walk with a pointer until you reach \'\\0\'.', 'myStrcmp: advance while both characters are equal and non-zero, then compare the differing characters.', 'myStrcpy: copy each character, including the terminator.'],
    solution: c`#include <stdio.h>

int myStrlen(const char *s) {
    const char *p = s;
    while (*p) p++;
    return (int)(p - s);
}

int myStrcmp(const char *a, const char *b) {
    while (*a && *a == *b) { a++; b++; }
    if (*(unsigned char *)a < *(unsigned char *)b) return -1;
    if (*(unsigned char *)a > *(unsigned char *)b) return 1;
    return 0;
}

void myStrcpy(char *dst, const char *src) {
    while ((*dst++ = *src++))
        ;
}

int main() {
    char a[51], b[51], copy[51];
    scanf("%50s %50s", a, b);
    printf("%d %d\n", myStrlen(a), myStrlen(b));
    printf("%d\n", myStrcmp(a, b));
    myStrcpy(copy, a);
    printf("%s\n", copy);
    return 0;
}`,
    explanation: 'Pointer subtraction gives the length. The strcmp loop stops at the first difference or the terminator; comparing as unsigned char matches the standard. The copy loop assigns, tests the copied character and stops after copying the terminator.',
    keywords: ['scanf', 'printf', 'while'],
  }),
  mk({
    id: 'tictactoe',
    module: 'm5',
    level: 'Hard',
    title: 'Tic-Tac-Toe Winner Checker',
    statement: 'A 3x3 board is given with X, O and . (empty). Print "X wins" or "O wins" if a player has three in a row (row, column or diagonal). If there is no winner and no empty cell, print Draw. Otherwise print Pending.',
    input: 'Three lines of three characters each.',
    output: 'X wins, O wins, Draw or Pending.',
    constraints: ['The board is a valid game position with at most one winner'],
    tests: [
      ['XOX\nOXO\nOXX', 'X wins'],
      ['XOX\nXOO\nOXX', 'Draw'],
      ['OOO\nXX.\n...', 'O wins'],
      ['X..\n.O.\n...', 'Pending'],
      ['XXX\nOO.\n...', 'X wins'],
      ['O.X\n.XO\nX.O', 'X wins'],
    ],
    why: ['X holds the main diagonal.', 'The board is full and nobody has a line.'],
    hints: ['Read each row as a string with %s.', 'Check the 3 rows, 3 columns and 2 diagonals with a helper that compares three cells.', 'If no winner, scan for any "." to decide between Draw and Pending.'],
    solution: c`#include <stdio.h>

char b[3][4];

int line(char p, int r1, int c1, int r2, int c2, int r3, int c3) {
    return b[r1][c1] == p && b[r2][c2] == p && b[r3][c3] == p;
}

int wins(char p) {
    for (int i = 0; i < 3; i++) {
        if (line(p, i, 0, i, 1, i, 2)) return 1;
        if (line(p, 0, i, 1, i, 2, i)) return 1;
    }
    return line(p, 0, 0, 1, 1, 2, 2) || line(p, 0, 2, 1, 1, 2, 0);
}

int main() {
    for (int i = 0; i < 3; i++) scanf("%3s", b[i]);
    if (wins('X')) printf("X wins\n");
    else if (wins('O')) printf("O wins\n");
    else {
        int empty = 0;
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                if (b[i][j] == '.') empty = 1;
        printf(empty ? "Pending\n" : "Draw\n");
    }
    return 0;
}`,
    explanation: 'A helper tests one line of three cells. Rows and columns are checked in a single loop, the diagonals separately. Only when nobody wins does an empty-cell scan decide between Draw and Pending.',
    keywords: ['scanf', 'printf', 'wins'],
  }),
]
