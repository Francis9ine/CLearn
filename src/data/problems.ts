import type { Problem } from './types'
import { P1 } from './problems/p1'
import { P2 } from './problems/p2'
import { P3 } from './problems/p3'
import { P4 } from './problems/p4'
import { P5 } from './problems/p5'

export const PROBLEMS: Problem[] = [...P1, ...P2, ...P3, ...P4, ...P5]
export const getProblem = (id: string) => PROBLEMS.find((p) => p.id === id)
export const LEVELS = ['Easy', 'Medium', 'Hard'] as const
