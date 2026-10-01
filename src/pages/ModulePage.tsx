import { ArrowLeft, ClipboardCheck, Code2, Lock, Unlock } from 'lucide-react'
import TopicCard from '../components/TopicCard'
import { Empty, Eyebrow, ProgressRing, btnPrimary } from '../components/ui'
import { Link } from '../lib/router'
import { getModule } from '../data/modules'
import { PROBLEMS } from '../data/problems'
import { useProgress } from '../lib/store'

export default function ModulePage({ id }: { id: string }) {
  const { p, moduleRatio, moduleTopicsDone, moduleProblemsSolved, setUnlocked, isModuleDone } = useProgress()
  const m = getModule(id)
  if (!m)
    return (
      <Empty title="Module not found">
        <Link to="/" className={btnPrimary}>Back to modules</Link>
      </Empty>
    )
  const done = moduleTopicsDone(m.id)
  const open = done === m.topics.length || !!p.unlocked[m.id]
  const best = Math.max(0, ...p.quizzes.filter((q) => q.module === m.id).map((q) => q.score))
  const probs = PROBLEMS.filter((x) => x.module === m.id)
  const cards = [
    { to: `/quiz/${m.id}`, icon: ClipboardCheck, title: 'Module Quiz', sub: best ? `10 questions. Best score ${best}/10.` : '10 multiple-choice questions with instant feedback.' },
    { to: `/practice/${m.id}`, icon: Code2, title: 'Practice Problems', sub: `${moduleProblemsSolved(m.id)}/${probs.length} solved. Easy, Medium and Hard.` },
  ]
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
      <Link to="/" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-mute hover:text-fg">
        <ArrowLeft size={16} /> All modules
      </Link>
      <header className="rise mt-2 flex items-start justify-between gap-4">
        <div>
          <Eyebrow>Module {m.n}</Eyebrow>
          <h1 className="mt-2 text-3xl sm:text-5xl">{m.title}</h1>
          <p className="mt-3 max-w-xl text-mute">{m.blurb}</p>
        </div>
        <ProgressRing value={moduleRatio(m.id)} size={72} stroke={6} label={`${m.title} progress`} />
      </header>

      <h2 className="mt-10 text-xl">Topics <span className="font-sans text-sm font-normal text-mute">{done}/{m.topics.length} complete</span></h2>
      <div className="mt-4 grid gap-3">
        {m.topics.map((t, i) => (
          <TopicCard key={t.id} t={t} index={i} status={p.topics[t.id]} />
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.to} className={`rounded-2xl border border-line p-5 ${open ? 'bg-surface' : 'bg-surface/50'}`}>
            <div className="flex items-center gap-3">
              <span className={`grid size-11 place-items-center rounded-xl ${open ? 'bg-accent-soft text-accent' : 'bg-surface2 text-mute'}`}>
                {open ? <c.icon size={20} /> : <Lock size={20} />}
              </span>
              <h3 className="text-lg">{c.title}</h3>
            </div>
            <p className="mt-3 text-sm text-mute">{open ? c.sub : `Locked. Complete all ${m.topics.length} topics to unlock (${done} done).`}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {open ? (
                <Link to={c.to} className={btnPrimary}>{c.title === 'Module Quiz' ? (best ? 'Retake quiz' : 'Start quiz') : 'View problems'}</Link>
              ) : (
                <button onClick={() => setUnlocked(m.id)} className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-line px-4 text-sm font-semibold text-mute hover:bg-surface2 hover:text-fg">
                  <Unlock size={15} /> Skip lock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {isModuleDone(m.id) && <p className="mt-6 text-center text-sm text-ok">Module complete. Nicely done.</p>}
    </div>
  )
}
