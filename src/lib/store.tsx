import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MODULES } from '../data/modules'
import { PROBLEMS } from '../data/problems'

export interface QuizResult {
  module: string
  score: number
  total: number
  date: number
}
export interface Progress {
  topics: Record<string, 'progress' | 'done'>
  problems: Record<string, 'attempted' | 'solved'>
  quizzes: QuizResult[]
  code: Record<string, string>
  unlocked: Record<string, boolean>
  theme: 'dark' | 'light'
}
const EMPTY: Progress = { topics: {}, problems: {}, quizzes: [], code: {}, unlocked: {}, theme: 'dark' }
const KEY = 'cquest:v1'

const mem: Record<string, string> = {}
export const storage = {
  get(k: string) {
    try {
      return localStorage.getItem(k)
    } catch {
      return mem[k] ?? null
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v)
    } catch {
      mem[k] = v
    }
  },
  remove(k: string) {
    try {
      localStorage.removeItem(k)
    } catch {
      delete mem[k]
    }
  },
}

function load(): Progress {
  try {
    const raw = storage.get(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

interface Ctx {
  p: Progress
  visitTopic: (id: string) => void
  toggleTopic: (id: string) => void
  setUnlocked: (module: string) => void
  addQuiz: (r: QuizResult) => void
  markProblem: (id: string, s: 'attempted' | 'solved') => void
  saveCode: (id: string, code: string) => void
  toggleTheme: () => void
  reset: () => void
  moduleTopicsDone: (m: string) => number
  moduleProblemsSolved: (m: string) => number
  moduleRatio: (m: string) => number
  isModuleDone: (m: string) => boolean
}
const C = createContext<Ctx>(null as never)
export const useProgress = () => useContext(C)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progress>(load)
  useEffect(() => {
    storage.set(KEY, JSON.stringify(p))
  }, [p])
  useEffect(() => {
    document.documentElement.dataset.theme = p.theme
  }, [p.theme])

  const value = useMemo<Ctx>(() => {
    const upd = (f: (s: Progress) => Progress) => setP((s) => f(s))
    const moduleTopicsDone = (m: string) =>
      MODULES.find((x) => x.id === m)!.topics.filter((t) => p.topics[t.id] === 'done').length
    const moduleProblemsSolved = (m: string) =>
      PROBLEMS.filter((x) => x.module === m && p.problems[x.id] === 'solved').length
    const moduleRatio = (m: string) => {
      const mod = MODULES.find((x) => x.id === m)!
      const pr = PROBLEMS.filter((x) => x.module === m).length
      const best = Math.max(0, ...p.quizzes.filter((q) => q.module === m).map((q) => q.score / q.total))
      const parts = [moduleTopicsDone(m) / mod.topics.length, best, pr ? moduleProblemsSolved(m) / pr : 0]
      return (parts[0] * 0.5 + parts[1] * 0.2 + parts[2] * 0.3)
    }
    return {
      p,
      visitTopic: (id) => upd((s) => (s.topics[id] ? s : { ...s, topics: { ...s.topics, [id]: 'progress' } })),
      toggleTopic: (id) =>
        upd((s) => ({ ...s, topics: { ...s.topics, [id]: s.topics[id] === 'done' ? 'progress' : 'done' } })),
      setUnlocked: (m) => upd((s) => ({ ...s, unlocked: { ...s.unlocked, [m]: true } })),
      addQuiz: (r) => upd((s) => ({ ...s, quizzes: [...s.quizzes, r] })),
      markProblem: (id, st) =>
        upd((s) =>
          s.problems[id] === 'solved' && st === 'attempted' ? s : { ...s, problems: { ...s.problems, [id]: st } },
        ),
      saveCode: (id, code) => upd((s) => ({ ...s, code: { ...s.code, [id]: code } })),
      toggleTheme: () => upd((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' })),
      reset: () => {
        storage.remove(KEY)
        setP({ ...EMPTY, theme: p.theme })
      },
      moduleTopicsDone,
      moduleProblemsSolved,
      moduleRatio,
      isModuleDone: (m) => moduleTopicsDone(m) === MODULES.find((x) => x.id === m)!.topics.length,
    }
  }, [p])

  return <C.Provider value={value}>{children}</C.Provider>
}
