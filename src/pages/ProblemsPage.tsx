import ProblemRow from '../components/ProblemRow'
import { Empty, Eyebrow } from '../components/ui'
import { Link } from '../lib/router'
import { MODULES } from '../data/modules'
import { LEVELS, PROBLEMS } from '../data/problems'
import { useProgress } from '../lib/store'

export default function ProblemsPage({ moduleId }: { moduleId?: string }) {
  const { p } = useProgress()
  const list = PROBLEMS.filter((x) => !moduleId || x.module === moduleId)
  const solved = list.filter((x) => p.problems[x.id] === 'solved').length
  const chip = (on: boolean) => `inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition ${on ? 'border-accent bg-accent-soft text-accent' : 'border-line text-mute hover:bg-surface2'}`
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
      <Eyebrow>Practice</Eyebrow>
      <h1 className="mt-2 text-3xl sm:text-5xl">Coding problems</h1>
      <p className="mt-2 text-mute">{solved} of {list.length} solved. Write C, hit Run, and submit against hidden tests.</p>
      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2" role="navigation" aria-label="Filter by module">
        <Link to="/practice" className={chip(!moduleId)}>All</Link>
        {MODULES.map((m) => <Link key={m.id} to={`/practice/${m.id}`} className={chip(moduleId === m.id)}>{m.n}. {m.title.split(' ').slice(0, 2).join(' ')}</Link>)}
      </div>
      {!list.length && <Empty title="No problems here yet" />}
      {LEVELS.map((lv) => {
        const rows = list.filter((x) => x.level === lv)
        if (!rows.length) return null
        return (
          <section key={lv} className="mt-8">
            <h2 className="text-xl">{lv} <span className="font-sans text-sm font-normal text-mute">{rows.filter((r) => p.problems[r.id] === 'solved').length}/{rows.length}</span></h2>
            <div className="mt-3 grid gap-2">
              {rows.map((r, i) => <ProblemRow key={r.id} p={r} n={i + 1} showModule={!moduleId} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}
