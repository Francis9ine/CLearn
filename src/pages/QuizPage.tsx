import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import QuizCard from '../components/QuizCard'
import { Empty, ProgressRing, btn, btnGhost, btnPrimary } from '../components/ui'
import { Link } from '../lib/router'
import { getModule } from '../data/modules'
import { QUIZZES } from '../data/quizzes'
import { useProgress } from '../lib/store'

export default function QuizPage({ id }: { id: string }) {
  const { addQuiz } = useProgress()
  const m = getModule(id)
  const qs = QUIZZES[id]
  const [i, setI] = useState(0)
  const [picks, setPicks] = useState<(number | null)[]>([])
  const [fin, setFin] = useState(false)

  const cur = qs?.[i]
  const picked = picks[i] ?? null
  const last = !!qs && i === qs.length - 1
  const score = qs ? qs.reduce((s, q, k) => s + (picks[k] === q.answer ? 1 : 0), 0) : 0

  const pick = (k: number) => picked === null && setPicks((p) => { const n = [...p]; n[i] = k; return n })
  const advance = () => {
    if (picked === null) return
    if (last) {
      addQuiz({ module: id, score, total: qs.length, date: Date.now() })
      setFin(true)
    } else setI(i + 1)
  }
  const retry = () => { setI(0); setPicks([]); setFin(false) }

  useEffect(() => {
    if (fin || !cur) return
    const k = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (/^[1-4]$/.test(e.key) && Number(e.key) <= cur.options.length) pick(Number(e.key) - 1)
      else if (e.key === 'Enter') advance()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  })

  if (!m || !qs) return <Empty title="Quiz not found"><Link to="/" className={btnPrimary}>Back to modules</Link></Empty>

  if (fin) {
    const ratio = score / qs.length
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center sm:py-20">
        <div className="rise">
          <div className="flex justify-center"><ProgressRing value={ratio} size={140} stroke={10} label="Quiz score" /></div>
          <h1 className="mt-6 text-4xl">{score}/{qs.length}</h1>
          <p className="mt-2 text-mute">
            {ratio === 1 ? 'Flawless. You know this module.' : ratio >= 0.7 ? 'Solid result. Review the misses and move on.' : 'A good start. Revisit the topics and try again.'}
          </p>
          <ul className="mt-6 grid grid-cols-5 gap-2" aria-label="Per-question result">
            {qs.map((q, k) => (
              <li key={k} className={`rounded-lg border py-2 font-mono text-sm ${picks[k] === q.answer ? 'border-ok text-ok' : 'border-bad text-bad'}`}>Q{k + 1}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={retry} className={btnGhost}><RotateCcw size={16} /> Retry quiz</button>
            <Link to={`/practice/${id}`} className={btnPrimary}>Continue to coding problems <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
      <Link to={`/module/${id}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-mute hover:text-fg"><ArrowLeft size={16} /> {m.title}</Link>
      <div className="mt-2 flex items-center justify-between font-mono text-xs text-mute">
        <span>Question {i + 1} of {qs.length}</span>
        <span>Module {m.n} quiz</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuemin={0} aria-valuemax={qs.length} aria-valuenow={i + (picked !== null ? 1 : 0)}>
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${((i + (picked !== null ? 1 : 0)) / qs.length) * 100}%` }} />
      </div>
      <div className="mt-8" key={i}>
        <QuizCard q={cur} picked={picked} onPick={pick} />
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={advance} disabled={picked === null} className={`${btn} bg-accent text-accent-fg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40`}>
          {last ? 'See results' : 'Next question'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
