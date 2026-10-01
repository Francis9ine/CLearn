import type { Module } from './types'
import { M1 } from './content/m1'
import { M2 } from './content/m2'
import { M3 } from './content/m3'
import { M4 } from './content/m4'
import { M5 } from './content/m5'

export const MODULES: Module[] = [
  {
    id: 'm1',
    n: 'I',
    title: 'Introduction to Computers',
    blurb: 'How a machine thinks: hardware, memory, software, translators and the operating system.',
    topics: M1,
  },
  {
    id: 'm2',
    n: 'II',
    title: 'Programming in C',
    blurb: 'Where C came from, how a program is shaped, and how to compute, read and print.',
    topics: M2,
  },
  {
    id: 'm3',
    n: 'III',
    title: 'Fundamental Features in C',
    blurb: 'Decisions, loops, storage classes, the preprocessor and command-line input.',
    topics: M3,
  },
  {
    id: 'm4',
    n: 'IV',
    title: 'Arrays and Functions',
    blurb: 'Group data into arrays and matrices, and organise logic into functions and recursion.',
    topics: M4,
  },
  {
    id: 'm5',
    n: 'V',
    title: 'Advanced Features in C',
    blurb: 'Pointers, strings, structures, unions and files: the power tools of C.',
    topics: M5,
  },
]

export const getModule = (id: string) => MODULES.find((m) => m.id === id)
export const findTopic = (id: string) => {
  for (const m of MODULES) {
    const i = m.topics.findIndex((t) => t.id === id)
    if (i >= 0) return { module: m, topic: m.topics[i], index: i }
  }
  return undefined
}
