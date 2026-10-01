import { Check, X } from 'lucide-react'
import type { QuizQ } from '../data/types'

export default function QuizCard({
  q,
  picked,
  onPick,
}: {
  q: QuizQ
  picked: number | null
  onPick: (i: number) => void
}) {
  const done = picked !== null
  return (
    <div className="rise">
      <h2 className="!font-sans text-xl font-semibold leading-snug sm:text-2xl">{q.q}</h2>
      <div className="mt-5 grid gap-3" role="radiogroup" aria-label="Answers">
        {q.options.map((o, i) => {
          const right = i === q.answer
          const state = !done ? 'idle' : right ? 'right' : i === picked ? 'wrong' : 'dim'
          const cls = {
            idle: 'border-line bg-surface hover:border-accent/60 hover:bg-surface2',
            right: 'border-ok bg-ok/10',
            wrong: 'border-bad bg-bad/10',
            dim: 'border-line bg-surface opacity-60',
          }[state]
          return (
            <button
              key={i}
              role="radio"
              aria-checked={picked === i}
              disabled={done}
              onClick={() => onPick(i)}
              className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition sm:p-4 ${cls}`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-current/30 font-mono text-sm">
                {state === 'right' ? <Check size={16} className="text-ok" /> : state === 'wrong' ? <X size={16} className="text-bad" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-[15px]">{o}</span>
              <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] text-mute lg:block">{i + 1}</kbd>
            </button>
          )
        })}
      </div>
      {done && (
        <div className={`rise mt-5 rounded-xl border-l-4 p-4 ${picked === q.answer ? 'border-ok bg-ok/10' : 'border-bad bg-bad/10'}`} role="status">
          <p className="font-semibold">{picked === q.answer ? 'Correct' : `Not quite. The answer is ${String.fromCharCode(65 + q.answer)}.`}</p>
          <p className="mt-1 text-sm text-mute">{q.why}</p>
        </div>
      )}
    </div>
  )
}
