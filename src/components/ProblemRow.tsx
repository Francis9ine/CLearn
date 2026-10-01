import { useState } from 'react'
import { Link } from '../lib/router'
import { useProgress } from '../lib/store'
import type { Problem } from '../data/types'
import { Badge, ProblemStatus } from './ui'

export default function ProblemRow({ p, n, showModule }: { p: Problem; n: number; showModule?: boolean }) {
  const { p: prog } = useProgress()
  const [show, setShow] = useState(false)
  const dot = { Easy: 'bg-ok', Medium: 'bg-warn', Hard: 'bg-bad' }[p.level]
  return (
    <Link
      to={`/problem/${p.id}`}
      className="flex min-h-14 items-center gap-3 border-b border-line px-3 py-3 transition last:border-b-0 hover:bg-surface2 sm:gap-4 sm:px-4"
    >
      <ProblemStatus s={prog.problems[p.id]} />
      <span className="w-6 font-mono text-xs text-mute">{n}</span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{p.title}</span>
      {showModule && <span className="hidden font-mono text-xs text-mute sm:inline">M{p.module.slice(1)}</span>}
      <span
        role="button"
        tabIndex={0}
        aria-label={`Difficulty: ${p.level}. Tap to ${show ? 'hide' : 'show'} label`}
        aria-expanded={show}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShow((v) => !v) }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setShow((v) => !v) } }}
        className="grid min-h-11 min-w-11 shrink-0 cursor-pointer place-items-center"
      >
        {show ? <Badge level={p.level} /> : <span className={`size-3 rounded-full ${dot}`} />}
      </span>
    </Link>
  )
}
