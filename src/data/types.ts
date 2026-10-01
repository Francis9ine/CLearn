export type Lang = 'c' | 'sh' | 'txt'
export interface Example {
  title: string
  lang?: Lang
  code: string
  notes: string[]
}
export interface Topic {
  id: string
  title: string
  intro: string[]
  syntax: { code: string; lang?: Lang; caption: string }
  examples: Example[]
  mistakes: string[]
  takeaways: string[]
}
export interface Module {
  id: string
  n: string
  title: string
  blurb: string
  topics: Topic[]
}
export interface QuizQ {
  q: string
  options: string[]
  answer: number
  why: string
}
export type Level = 'Easy' | 'Medium' | 'Hard'
export interface TestCase {
  input: string
  output: string
  hidden?: boolean
}
export interface Problem {
  id: string
  module: string
  level: Level
  title: string
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string[]
  examples: { input: string; output: string; explanation: string }[]
  tests: TestCase[]
  hints: [string, string, string]
  solution: string
  explanation: string
  starter: string
  mockKeywords: string[]
}
