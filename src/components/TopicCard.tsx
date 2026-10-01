import { ChevronRight } from 'lucide-react'
import { Link } from '../lib/router'
import type { Topic } from '../data/types'
import { TopicStatus } from './ui'

export default function TopicCard({ t, index, status }: { t: Topic; index: number; status?: 'progress' | 'done' }) {
  return (
    <Link
      to={`/topic/${t.id}`}
      className="group flex min-h-20 items-center gap-4 rounded-xl border border-line bg-surface p-4 transition hover:border-accent/60 hover:bg-surface2 sm:p-5"
    >
      <span className="w-9 shrink-0 font-mono text-2xl font-medium text-accent/70 sm:w-12 sm:text-3xl">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0 flex-1">
        <h3 className="!font-sans text-base font-semibold leading-snug sm:text-lg">{t.title}</h3>
        <div className="mt-1.5">
          <TopicStatus s={status} />
        </div>
      </div>
      <ChevronRight className="shrink-0 text-mute transition group-hover:translate-x-1 group-hover:text-accent" />
    </Link>
  )
}
