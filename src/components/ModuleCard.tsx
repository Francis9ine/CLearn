import { ArrowUpRight } from 'lucide-react'
import { Link } from '../lib/router'
import { useProgress } from '../lib/store'
import type { Module } from '../data/types'
import { ProgressRing } from './ui'

export default function ModuleCard({ m, i }: { m: Module; i: number }) {
  const { moduleRatio, moduleTopicsDone } = useProgress()
  return (
    <Link
      to={`/module/${m.id}`}
      style={{ animationDelay: `${i * 60}ms` }}
      className="rise group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/60 sm:p-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[9rem] font-bold leading-none text-accent/[0.07] transition group-hover:text-accent/15"
      >
        {m.n}
      </span>
      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Module {m.n}</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight">{m.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-mute">{m.blurb}</p>
      </div>
      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProgressRing value={moduleRatio(m.id)} label={`Module ${m.n}`} />
          <p className="font-mono text-xs text-mute">
            {moduleTopicsDone(m.id)}/{m.topics.length} topics
          </p>
        </div>
        <ArrowUpRight className="text-mute transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>
    </Link>
  )
}
