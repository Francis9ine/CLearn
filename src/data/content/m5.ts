import type { Topic } from '../types'
const c = String.raw

export const M5: Topic[] = [
  {
    id: 'm5-1',
    title: 'Pointers and the relationship between arrays and pointers',
    intro: [
      'A pointer is a variable that stores a memory address. You declare one with an asterisk: int *p. The address-of operator & gives the address of a variable, and the dereference operator * follows a pointer to the value it points at. So p = &x makes p point to x, and *p = 7 changes x.',
      'Pointers and arrays are closely related. In most expressions the name of an array decays into a pointer to its first element, so arr and &arr[0] are the same address. Pointer arithmetic is scaled by the element size: p + 1 moves to the next element, not the next byte. This means arr[i] is defined as *(arr + i).',
      'An uninitialised pointer holds garbage and dereferencing it is undefined behaviour. Set pointers to NULL when they have no target. Remember the difference: an array name is not a variable you can assign to, but a pointer is.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Pointer basics',
      code: c`int x = 10;
int *p = &x;        /* p holds the address of x     */
*p = 20;            /* x is now 20                  */

int a[3] = {5, 6, 7};
int *q = a;         /* same as &a[0]                */
*(q + 2)            /* same as a[2], value 7        */
q++;                /* moves to a[1]                */`,
    },
    examples: [
      {
        title: 'Address, value and dereference',
        code: c`#include <stdio.h>

int main() {
    int x = 10;
    int *p = &x;
    printf("x = %d\n", x);
    printf("*p = %d\n", *p);
    *p = 20;
    printf("x after *p = 20: %d\n", x);
    printf("same address? %d\n", p == &x);
    return 0;
}`,
        notes: [
          '*p reads the value stored at the address in p.',
          'Writing through *p changes x because both refer to the same memory.',
          'p == &x is 1 because the pointer holds exactly the address of x.',
        ],
      },
      {
        title: 'Walking an array with a pointer',
        code: c`#include <stdio.h>

int main() {
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a;
    for (int i = 0; i < 5; i++)
        printf("%d ", *(p + i));       /* same as a[i] */
    printf("\n");

    int sum = 0;
    for (p = a; p < a + 5; p++)
        sum += *p;
    printf("sum = %d\n", sum);         /* 150 */
    return 0;
}`,
        notes: [
          'p + i advances by i elements; the compiler multiplies by sizeof(int).',
          'p++ in the second loop steps through the array, using a pointer as the loop variable.',
          'a + 5 is one past the end, a legal pointer to compare against but not to dereference.',
        ],
      },
    ],
    mistakes: [
      'Dereferencing an uninitialised or NULL pointer.',
      'Confusing int *p = &x (declaration) with *p = x (assignment through a pointer).',
      'Forgetting that p + 1 is scaled by the element size.',
      'Returning the address of a local variable from a function.',
    ],
    takeaways: [
      '& gets an address; * follows a pointer.',
      'An array name decays to a pointer to its first element.',
      'arr[i] is the same as *(arr + i).',
      'Initialise pointers; use NULL when empty.',
    ],
  },
  {
    id: 'm5-2',
    title: 'Passing arguments using pointers; array of pointers; passing arrays as arguments',
    intro: [
      'Because C passes arguments by value, a function that must change a caller variable receives its address. The classic example is swap(int *a, int *b). Inside, *a and *b read and write the caller variables. The same technique lets a function return several results through pointer parameters.',
      'When you pass an array, the function receives a pointer to the first element, so void f(int a[], int n) and void f(int *a, int n) are identical. For a 2D array you must specify the column count: void f(int m[][3], int rows). Changes made through the array parameter affect the original data.',
      'An array of pointers holds addresses as its elements. The most common use is an array of strings: char *names[] = {"Ann", "Bob"} stores a pointer to each string literal. This is how argv works. A pointer to a pointer (char **) is the type you get when such an array is passed to a function.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Pointer parameters and arrays of pointers',
      code: c`void swap(int *a, int *b);       /* call: swap(&x, &y)       */
void fill(int arr[], int n);      /* same as int *arr         */
void show(int m[][3], int rows);  /* 2D: column size required */

char *names[3] = {"Asha", "Ben", "Chen"};   /* array of pointers */
printf("%s", names[1]);                      /* Ben               */`,
    },
    examples: [
      {
        title: 'Swap using pointers',
        code: c`#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main() {
    int x = 3, y = 8;
    swap(&x, &y);
    printf("x=%d y=%d\n", x, y);   /* x=8 y=3 */
    return 0;
}`,
        notes: [
          '&x and &y pass the addresses, so swap can modify the originals.',
          '*a and *b are the values at those addresses.',
          'A swap(int a, int b) taking values would swap only its own copies.',
        ],
      },
      {
        title: 'Min and max returned through pointers, array of strings',
        code: c`#include <stdio.h>

void minMax(int a[], int n, int *min, int *max) {
    *min = *max = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < *min) *min = a[i];
        if (a[i] > *max) *max = a[i];
    }
}

int main() {
    int v[] = {4, 9, 1, 7};
    int lo, hi;
    minMax(v, 4, &lo, &hi);
    printf("%d %d\n", lo, hi);                 /* 1 9 */

    char *days[] = {"Mon", "Tue", "Wed"};
    for (int i = 0; i < 3; i++) printf("%s ", days[i]);
    printf("\n");
    return 0;
}`,
        notes: [
          'A function can return multiple results by writing through pointer parameters.',
          'v decays to a pointer, so minMax reads the caller array.',
          'days is an array of three char pointers, each aimed at a string literal.',
        ],
      },
    ],
    mistakes: [
      'Writing swap(x, y) instead of swap(&x, &y).',
      'Forgetting the * and assigning to the local pointer instead of the pointed-to value.',
      'Modifying string literals through a char * (they are read-only).',
      'Omitting the column dimension in 2D array parameters.',
    ],
    takeaways: [
      'Pass &variable and use *param to modify the caller variable.',
      'Array parameters are really pointers to the first element.',
      'An array of pointers is ideal for lists of strings.',
      'Functions can "return" many values via pointer parameters.',
    ],
  },
  {
    id: 'm5-3',
    title: 'Strings and the C string library',
    intro: [
      'C has no string type. A string is an array of char terminated by the null character \'\\0\'. The literal "Hi" occupies 3 bytes: \'H\', \'i\' and \'\\0\'. Every string function relies on that terminator to find the end, so an array must always have room for it.',
      'The header <string.h> offers the standard tools: strlen (length, without the terminator), strcpy (copy), strcat (append), strcmp (compare - returns 0 when equal, negative or positive otherwise), strchr and strstr (search). Prefer the bounded forms strncpy, strncat and snprintf when the destination size is limited. <ctype.h> adds character tests such as isalpha, toupper and isdigit.',
      'Read a string with scanf("%s", s), which stops at whitespace, or fgets(s, size, stdin), which reads a whole line including the newline. You cannot compare strings with == (that compares addresses) or copy them with =; always use the library functions.',
    ],
    syntax: {
      lang: 'c',
      caption: 'Common string operations',
      code: c`char s[20] = "hello";          /* 5 chars + '\0' */
strlen(s)                      /* 5                */
strcpy(dest, src);             /* copy src to dest */
strcat(dest, src);             /* append           */
strcmp(a, b)                   /* 0 if equal       */
fgets(s, sizeof s, stdin);     /* read a line      */`,
    },
    examples: [
      {
        title: 'Library functions in action',
        code: c`#include <stdio.h>
#include <string.h>

int main() {
    char a[30] = "Hello";
    char b[] = "World";
    strcat(a, ", ");
    strcat(a, b);
    printf("%s (%zu chars)\n", a, strlen(a));
    printf("%d\n", strcmp("apple", "banana") < 0);   /* 1 */
    return 0;
}`,
        notes: [
          'a has room (30) for the result of the concatenations. strcat does not check.',
          'strlen counts characters up to, but not including, the null terminator.',
          'strcmp returns a negative number when the first string sorts before the second.',
        ],
      },
      {
        title: 'Walking a string manually',
        code: c`#include <stdio.h>
#include <ctype.h>

int main() {
    char s[100];
    scanf("%99s", s);
    int letters = 0;
    for (int i = 0; s[i] != '\0'; i++) {
        if (isalpha((unsigned char)s[i])) letters++;
        s[i] = toupper((unsigned char)s[i]);
    }
    printf("%s has %d letters\n", s, letters);
    return 0;
}`,
        notes: [
          'The loop ends at the null terminator, so no length is needed.',
          'isalpha and toupper come from <ctype.h>.',
          '%99s limits input to 99 characters, leaving one byte for the terminator.',
        ],
      },
    ],
    mistakes: [
      'Not leaving room for the terminating \'\\0\' when sizing arrays.',
      'Comparing strings with ==, which compares addresses.',
      'Using strcpy or strcat into a buffer that is too small (buffer overflow).',
      'Using gets(), which is unsafe and removed from the language.',
    ],
    takeaways: [
      'A string is a char array ending with \'\\0\'.',
      'Use strlen, strcpy, strcat, strcmp from <string.h>.',
      'Compare with strcmp, never ==.',
      'Always size buffers for the terminator and the longest input.',
    ],
  },
  {
    id: 'm5-4',
    title: 'Structures and Unions (defining, initializing, array of structures, nested structures)',
    intro: [
      'A structure groups variables of different types under one name. It models a real-world record, such as a student with a name, roll number and marks. You define the layout with struct, create variables of that type, and reach members with the dot operator (s.marks). Through a pointer use the arrow operator: p->marks is the same as (*p).marks. typedef lets you drop the struct keyword.',
      'Structures can be initialised in braces in member order or with designated initialisers ({.roll = 1}). They can be copied with =, passed to functions and returned from them. An array of structures stores many records and is processed with a loop, a very common pattern for databases and sorting by a field. A structure can contain another structure, called nesting: s.dob.year.',
      'A union looks like a structure but all members share the same memory. Its size is that of its largest member, and only one member holds a valid value at a time. Unions save memory and let you view the same bytes as different types.',
    ],
    syntax: {
      lang: 'c',
      caption: 'struct, typedef and union',
      code: c`struct Student {
    char name[30];
    int  roll;
    float marks;
};
struct Student s = {"Asha", 1, 88.5f};
s.marks = 90;                    /* dot operator   */
struct Student *p = &s;
p->roll = 2;                     /* arrow operator */

union Value { int i; float f; char c; };   /* members share memory */`,
    },
    examples: [
      {
        title: 'Array of structures and a nested structure',
        code: c`#include <stdio.h>

struct Date { int d, m, y; };
struct Student {
    char name[20];
    float marks;
    struct Date dob;               /* nested structure */
};

int main() {
    struct Student cls[2] = {
        {"Asha", 88.5f, {12, 5, 2005}},
        {"Ben",  72.0f, {3, 9, 2004}}
    };
    for (int i = 0; i < 2; i++)
        printf("%s %.1f born %d/%d/%d\n", cls[i].name, cls[i].marks,
               cls[i].dob.d, cls[i].dob.m, cls[i].dob.y);
    return 0;
}`,
        notes: [
          'cls is an array of two Student records initialised with nested braces.',
          'cls[i].dob.y chains the array index and two dot operators.',
          'Inner braces initialise the nested Date structure.',
        ],
      },
      {
        title: 'A union shares one block of memory',
        code: c`#include <stdio.h>

union Value {
    int   i;
    float f;
};

int main() {
    union Value v;
    v.i = 65;
    printf("as int  : %d\n", v.i);
    v.f = 3.5f;                          /* overwrites the same bytes */
    printf("as float: %.1f\n", v.f);
    printf("size    : %zu\n", sizeof(union Value));   /* 4 */
    return 0;
}`,
        notes: [
          'Both members start at the same address, so the union is only as big as one int.',
          'Writing v.f destroys the int that was stored; reading v.i now would give a meaningless number.',
          'Unions are used for variant data and for inspecting the raw bytes of a value.',
        ],
      },
    ],
    mistakes: [
      'Forgetting the semicolon after the closing brace of a struct definition.',
      'Comparing two structures with ==; compare member by member.',
      'Using . on a pointer instead of ->.',
      'Reading a union member other than the one last written.',
    ],
    takeaways: [
      'struct groups different types; access with . or -> for pointers.',
      'Arrays of structures model tables of records.',
      'Structures can be nested and copied with =.',
      'A union shares memory among members; only one is valid at a time.',
    ],
  },
  {
    id: 'm5-5',
    title: 'File handling',
    intro: [
      'File handling lets a program keep data after it ends. In C a file is accessed through a FILE pointer. fopen(name, mode) opens a file and returns NULL on failure, and fclose releases it. Common modes are "r" (read; the file must exist), "w" (write; creates or truncates), "a" (append) and "r+" / "w+" (read and write). Add "b" for binary files.',
      'Text I/O mirrors the console functions: fprintf and fscanf for formatted data, fgets and fputs for lines, fgetc and fputc for single characters. fscanf and fgets return a value you can test to detect end of file; avoid looping on feof alone. Binary files use fwrite and fread to move whole structures at once, and fseek, ftell and rewind to move around inside a file.',
      'Always check that fopen succeeded, close every file you open, and remember that written data may stay in a buffer until you call fflush or fclose.',
    ],
    syntax: {
      lang: 'c',
      caption: 'The life of a file',
      code: c`FILE *fp = fopen("data.txt", "w");    /* "r" "w" "a" "r+" "rb" "wb" */
if (fp == NULL) { perror("open"); return 1; }
fprintf(fp, "%d %s\n", id, name);     /* write */
fscanf (fp, "%d %s", &id, name);      /* read  */
fwrite(&rec, sizeof rec, 1, fp);      /* binary write */
fclose(fp);`,
    },
    examples: [
      {
        title: 'Write, then read a text file',
        code: c`#include <stdio.h>

int main() {
    FILE *fp = fopen("scores.txt", "w");
    if (fp == NULL) { printf("cannot open\n"); return 1; }
    fprintf(fp, "Asha 91\nBen 78\nChen 85\n");
    fclose(fp);

    fp = fopen("scores.txt", "r");
    char name[20];
    int score;
    while (fscanf(fp, "%19s %d", name, &score) == 2)
        printf("%s scored %d\n", name, score);
    fclose(fp);
    return 0;
}`,
        notes: [
          'Mode "w" creates the file (or empties an existing one).',
          'The while condition checks that fscanf read both fields; it stops cleanly at end of file.',
          'Each file is closed after use so the data is flushed to disk.',
        ],
      },
      {
        title: 'Binary records with fwrite and fread',
        code: c`#include <stdio.h>

struct Rec { int id; float mark; };

int main() {
    struct Rec out = {7, 88.5f}, in;
    FILE *fp = fopen("rec.bin", "wb");
    fwrite(&out, sizeof out, 1, fp);
    fclose(fp);

    fp = fopen("rec.bin", "rb");
    if (fread(&in, sizeof in, 1, fp) == 1)
        printf("id=%d mark=%.1f\n", in.id, in.mark);
    fclose(fp);
    return 0;
}`,
        notes: [
          'fwrite copies the raw bytes of the structure into the file in one call.',
          'fread returns the number of records actually read, a handy success check.',
          'Binary files are compact but not human-readable and may differ between platforms.',
        ],
      },
    ],
    mistakes: [
      'Not checking whether fopen returned NULL.',
      'Forgetting fclose, so data may never reach the disk.',
      'Using while(!feof(fp)) which processes the last record twice; test the read function instead.',
      'Opening with "w" when you meant "a" and erasing the existing file.',
    ],
    takeaways: [
      'fopen/fclose manage files; always check for NULL.',
      'Text: fprintf/fscanf/fgets. Binary: fwrite/fread.',
      'Modes: r, w, a, r+, plus b for binary.',
      'Loop on the return value of the read function, not on feof.',
    ],
  },
]
