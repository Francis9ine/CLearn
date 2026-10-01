import type { Level, Problem } from '../types'

export const c = String.raw
export const STARTER = c`#include <stdio.h>

int main() {
    // Write your code here

    return 0;
}
`

type T = [input: string, output: string, hidden?: boolean]
interface Spec {
  id: string
  module: string
  level: Level
  title: string
  statement: string
  input: string
  output: string
  constraints: string[]
  tests: T[]
  why: [string, string]
  hints: [string, string, string]
  solution: string
  explanation: string
  keywords?: string[]
  starter?: string
}

export function mk(s: Spec): Problem {
  const tests = s.tests.map(([input, output], i) => ({
    input,
    output,
    hidden: i >= 2,
  }))
  return {
    id: s.id,
    module: s.module,
    level: s.level,
    title: s.title,
    statement: s.statement,
    inputFormat: s.input,
    outputFormat: s.output,
    constraints: s.constraints,
    examples: [0, 1].map((i) => ({ input: tests[i].input, output: tests[i].output, explanation: s.why[i] })),
    tests,
    hints: s.hints,
    solution: s.solution,
    explanation: s.explanation,
    starter: s.starter ?? STARTER,
    mockKeywords: s.keywords ?? ['printf'],
  }
}
