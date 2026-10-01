import { ArrowRight } from 'lucide-react'
import ModuleCard from '../components/ModuleCard'
import { Eyebrow, ProgressRing, btnPrimary, btnGhost } from '../components/ui'
import { Link } from '../lib/router'
import { MODULES } from '../data/modules'
import { PROBLEMS } from '../data/problems'
import { useProgress } from '../lib/store'

export default function HomePage() {
  const { p, moduleRatio } = useProgress()
  const overall = MODULES.reduce((s, m) => s + moduleRatio(m.id), 0) / MODULES.length
  const topicCount = MODULES.reduce((s, m) => s + m.topics.length, 0)
  const next = MODULES.flatMap((m) => m.topics).find((t) => p.topics[t.id] !== 'done')
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <Eyebrow>Learn C. Then prove it.</Eyebrow>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] sm:text-6xl">
            From <span className="text-accent">printf</span> to pointers, one small program at a time.
          </h1>
          <p className="mt-5 max-w-xl text-base text-mute sm:text-lg">
            {MODULES.length} modules, {topicCount} lessons, {MODULES.length} quizzes and {PROBLEMS.length} coding problems. Read the idea, run the example, then solve it yourself. No account, no setup.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={next ? `/topic/${next.id}` : '/practice'} className={btnPrimary}>
              {Object.keys(p.topics).length ? 'Continue learning' : 'Start with lesson 1'} <ArrowRight size={16} />
            </Link>
            <Link to="/playground" className={btnGhost}>
              Open playground
            </Link>
          </div>
        </div>
        <div className="rise rounded-2xl border border-line bg-surface p-5 font-mono text-[13px] leading-6 shadow-xl" aria-hidden>
          <div className="mb-3 flex gap-1.5">
            <span className="size-2.5 rounded-full bg-bad" />
            <span className="size-2.5 rounded-full bg-warn" />
            <span className="size-2.5 rounded-full bg-ok" />
          </div>
          <p><span className="text-mute">#include</span> &lt;stdio.h&gt;</p>
          <p className="mt-2"><span className="text-accent">int</span> main(<span className="text-accent">void</span>) {'{'}</p>
          <p className="pl-4">printf(<span className="text-ok">"Hello, C Quest!\n"</span>);</p>
          <p className="pl-4"><span className="text-accent">return</span> 0;</p>
          <p>{'}'}</p>
          <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
            <ProgressRing value={overall} size={44} stroke={4} label="Overall progress" />
            <span className="text-xs text-mute">{Math.round(overall * 100)}% of the course complete</span>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl">Modules</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m, i) => (
            <ModuleCard key={m.id} m={m} i={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
