import { useState } from 'react'
import { Eyebrow, ProgressRing, Dialog, btnGhost, btn } from '../components/ui'
import { Link } from '../lib/router'
import { MODULES } from '../data/modules'
import { LEVELS, PROBLEMS } from '../data/problems'
import { useProgress } from '../lib/store'

export default function ProgressPage() {
  const { p, moduleRatio, reset } = useProgress()
  const [ask, setAsk] = useState(false)
  const overall = MODULES.reduce((s, m) => s + moduleRatio(m.id), 0) / MODULES.length
  const quizzes = [...p.quizzes].reverse()
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <Eyebrow>Progress</Eyebrow>
      <h1 className="mt-2 text-3xl sm:text-5xl">Your journey</h1>
      <p className="mt-2 text-mute">Saved on this device only.</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-5 rounded-2xl border border-line bg-surface p-6">
          <ProgressRing value={overall} size={104} stroke={9} label="Overall completion" />
          <div><p className="font-display text-3xl">{Math.round(overall * 100)}%</p><p className="text-sm text-mute">overall completion</p></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {LEVELS.map((lv) => {
            const all = PROBLEMS.filter((x) => x.level === lv)
            const s = all.filter((x) => p.problems[x.id] === 'solved').length
            return (
              <div key={lv} className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-mute">{lv}</p>
                <p className="mt-2 font-display text-3xl">{s}<span className="text-lg text-mute">/{all.length}</span></p>
                <div className="mt-3 h-1.5 rounded-full bg-surface2"><div className="h-full rounded-full bg-accent" style={{ width: `${(s / all.length) * 100}%` }} /></div>
              </div>
            )
          })}
        </div>
      </div>

      <h2 className="mt-10 text-xl">Modules</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Link key={m.id} to={`/module/${m.id}`} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-accent/50">
            <ProgressRing value={moduleRatio(m.id)} size={52} stroke={5} label={m.title} />
            <div className="min-w-0"><p className="font-mono text-xs text-accent">Module {m.n}</p><p className="truncate text-sm font-semibold">{m.title}</p></div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-xl">Quiz history</h2>
      {!quizzes.length ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-mute">No quizzes taken yet. Finish a module's topics and try its quiz.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
          {quizzes.map((q, i) => (
            <li key={i} className="flex min-h-12 items-center gap-3 px-4 text-sm">
              <span className="flex-1 truncate">Module {MODULES.find((m) => m.id === q.module)?.n}: {MODULES.find((m) => m.id === q.module)?.title}</span>
              <span className="hidden text-mute sm:block">{new Date(q.date).toLocaleDateString()}</span>
              <span className={`font-mono font-semibold ${q.score / q.total >= 0.7 ? 'text-ok' : 'text-warn'}`}>{q.score}/{q.total}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 border-t border-line pt-6">
        <button onClick={() => setAsk(true)} className={`${btn} border border-bad/50 text-bad hover:bg-bad/10`}>Reset progress</button>
      </div>
      <Dialog open={ask} onClose={() => setAsk(false)} title="Reset all progress?">
        <p className="mt-2 text-sm text-mute">This clears completed topics, quiz scores, solved problems and saved code on this device. It cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setAsk(false)} className={btnGhost}>Cancel</button>
          <button onClick={() => { reset(); setAsk(false) }} className={`${btn} bg-bad text-white hover:brightness-110`}>Yes, reset</button>
        </div>
      </Dialog>
    </div>
  )
}
