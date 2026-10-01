import { useEffect } from 'react'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Lightbulb } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import { Empty, Eyebrow, btnGhost, btnPrimary, btn } from '../components/ui'
import { Link, go } from '../lib/router'
import { findTopic } from '../data/modules'
import { useProgress } from '../lib/store'

export default function TopicPage({ id }: { id: string }) {
  const { p, visitTopic, toggleTopic } = useProgress()
  const f = findTopic(id)
  useEffect(() => {
    if (f) visitTopic(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!f)
    return (
      <Empty title="Topic not found">
        <Link to="/" className={btnPrimary}>Back to modules</Link>
      </Empty>
    )
  const { module: m, topic: t, index } = f
  const prev = m.topics[index - 1]
  const next = m.topics[index + 1]
  const done = p.topics[id] === 'done'
  return (
    <article className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
      <Link to={`/module/${m.id}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-mute hover:text-fg">
        <ArrowLeft size={16} /> Module {m.n}: {m.title}
      </Link>
      <header className="rise mt-2">
        <Eyebrow>Topic {index + 1} of {m.topics.length}</Eyebrow>
        <h1 className="mt-2 text-3xl sm:text-5xl">{t.title}</h1>
      </header>

      <div className="mt-6 space-y-4 text-[17px] leading-relaxed">
        {t.intro.map((x, i) => <p key={i}>{x}</p>)}
      </div>

      <h2 className="mt-10 text-xl">Syntax</h2>
      <div className="mt-3">
        <CodeBlock code={t.syntax.code} lang={t.syntax.lang} tryIt={false} />
        <p className="mt-2 text-sm text-mute">{t.syntax.caption}</p>
      </div>

      <h2 className="mt-10 text-xl">Examples</h2>
      <div className="mt-3 space-y-8">
        {t.examples.map((e, i) => (
          <section key={i}>
            <h3 className="mb-2 font-sans text-base font-semibold">{i + 1}. {e.title}</h3>
            <CodeBlock code={e.code} lang={e.lang} tryIt={(e.lang ?? 'c') === 'c'} />
            <ul className="mt-3 space-y-1.5 text-[15px] text-mute">
              {e.notes.map((n, j) => (
                <li key={j} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{n}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <aside className="mt-10 rounded-2xl border border-warn/40 bg-warn/10 p-5">
        <h2 className="flex items-center gap-2 font-sans text-base font-semibold text-warn"><AlertTriangle size={18} /> Common mistakes</h2>
        <ul className="mt-3 space-y-2 text-[15px]">
          {t.mistakes.map((x, i) => <li key={i} className="flex gap-2"><span className="text-warn">-</span>{x}</li>)}
        </ul>
      </aside>

      <aside className="mt-5 rounded-2xl border border-accent/40 bg-accent-soft p-5">
        <h2 className="flex items-center gap-2 font-sans text-base font-semibold text-accent"><Lightbulb size={18} /> Key takeaways</h2>
        <ul className="mt-3 space-y-2 text-[15px]">
          {t.takeaways.map((x, i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-accent" />{x}</li>)}
        </ul>
      </aside>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
        <button onClick={() => toggleTopic(id)} aria-pressed={done} className={done ? `${btn} border border-ok bg-ok/10 text-ok` : btnPrimary}>
          <Check size={16} /> {done ? 'Completed (click to undo)' : 'Mark as complete'}
        </button>
        <div className="flex gap-3 sm:ml-auto">
          {prev ? <Link to={`/topic/${prev.id}`} className={`${btnGhost} flex-1`}><ArrowLeft size={16} /> Previous</Link> : <span className="flex-1" />}
          {next ? (
            <Link to={`/topic/${next.id}`} className={`${btnGhost} flex-1`}>Next <ArrowRight size={16} /></Link>
          ) : (
            <button onClick={() => go(`/module/${m.id}`)} className={`${btnGhost} flex-1`}>Finish module <ArrowRight size={16} /></button>
          )}
        </div>
      </div>
    </article>
  )
}
