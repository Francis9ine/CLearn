import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Eye, Lock, Minus, Play, Plus, RotateCcw, Send } from 'lucide-react'
import ConsolePanel, { type RunState, type TestResult, type Verdict } from '../components/ConsolePanel'
import CodeBlock from '../components/CodeBlock'
import { Badge, Empty, ProblemStatus, Skeleton, btn, btnPrimary } from '../components/ui'
import { Link } from '../lib/router'
import { runCode } from '../lib/runCode'
import { getProblem } from '../data/problems'
import { getModule } from '../data/modules'
import { useProgress } from '../lib/store'
import type { Problem } from '../data/types'

const Editor = lazy(() => import('../components/Editor'))

const norm = (s: string) => s.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '')

type Left = 'desc' | 'hints' | 'sol'
type Mob = 'problem' | 'code' | 'output'

const H = ({ children }: { children: string }) => <h3 className="mb-1.5 mt-6 font-mono text-[11px] uppercase tracking-wider text-mute">{children}</h3>

function Description({ p }: { p: Problem }) {
  return (
    <div className="text-[15px] leading-relaxed">
      <h1 className="font-sans text-xl font-semibold">{p.title}</h1>
      <div className="mt-2 flex items-center gap-2"><Badge level={p.level} /></div>
      <p className="mt-4 whitespace-pre-line">{p.statement}</p>
      <H>Input format</H><p>{p.inputFormat}</p>
      <H>Output format</H><p>{p.outputFormat}</p>
      <H>Constraints</H>
      <ul className="list-disc space-y-1 pl-5 font-mono text-[13px]">{p.constraints.map((c, i) => <li key={i}>{c}</li>)}</ul>
      {p.examples.map((e, i) => (
        <div key={i}>
          <H>{`Example ${i + 1}`}</H>
          <div className="grid gap-2 sm:grid-cols-2">
            <div><p className="mb-1 text-xs text-mute">Input</p><pre className="overflow-auto rounded-lg border border-line bg-bg p-3 font-mono text-[13px]">{e.input}</pre></div>
            <div><p className="mb-1 text-xs text-mute">Output</p><pre className="overflow-auto rounded-lg border border-line bg-bg p-3 font-mono text-[13px]">{e.output}</pre></div>
          </div>
          <p className="mt-2 text-sm text-mute">{e.explanation}</p>
        </div>
      ))}
    </div>
  )
}

export default function WorkspacePage({ id }: { id: string }) {
  const { p: prog, markProblem, saveCode } = useProgress()
  const prob = getProblem(id)
  const [code, setCode] = useState('')
  const [left, setLeft] = useState<Left>('desc')
  const [mob, setMob] = useState<Mob>('problem')
  const [ctab, setCtab] = useState<'tests' | 'output'>('tests')
  const [fs, setFs] = useState(14)
  const [hints, setHints] = useState(0)
  const [running, setRunning] = useState(false)
  const [state, setState] = useState<RunState | null>(null)

  useEffect(() => {
    if (!prob) return
    setCode(prog.code[id] ?? prob.starter)
    setLeft('desc'); setMob('problem'); setCtab('tests'); setHints(0); setState(null)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const change = (v: string) => { setCode(v); saveCode(id, v) }

  const exec = useCallback(async (kind: 'run' | 'submit') => {
    if (!prob || running) return
    const tests = kind === 'run' ? prob.tests.filter((t) => !t.hidden) : prob.tests
    setRunning(true)
    setCtab('tests')
    if (mob === 'code') setMob('output')
    if (prog.problems[id] !== 'solved') markProblem(id, 'attempted')
    try {
      const hint = { tests: prob.tests, keywords: prob.mockKeywords }
      const rs = await Promise.all(tests.map((t) => runCode(code, t.input, hint)))
      const compile = rs.find((r) => r.compileError)
      const results: (TestResult | null)[] = prob.tests.map(() => null)
      let k = 0
      prob.tests.forEach((t, i) => {
        if (kind === 'run' && t.hidden) return
        const r = rs[k++]
        results[i] = { pass: !r.compileError && !r.stderr.trim() ? norm(r.stdout) === norm(t.output) : !r.compileError && norm(r.stdout) === norm(t.output), actual: r.stdout, stderr: r.stderr }
      })
      const ran = results.filter(Boolean) as TestResult[]
      let verdict: Verdict = 'Accepted'
      if (compile) verdict = 'Compilation Error'
      else if (ran.some((r) => !r.pass)) verdict = ran.some((r) => !r.pass && r.stderr.trim()) ? 'Runtime Error' : 'Wrong Answer'
      setState({ kind, verdict, results, compileError: compile?.compileError ?? '', stdout: rs[0].stdout, stderr: rs[0].stderr, mode: rs[0].mode })
      if (kind === 'submit' && verdict === 'Accepted') markProblem(id, 'solved')
    } finally {
      setRunning(false)
    }
  }, [prob, running, code, mob, prog.problems, id, markProblem])

  if (!prob) return <Empty title="Problem not found"><Link to="/practice" className={btnPrimary}>All problems</Link></Empty>

  const attempted = !!prog.problems[id]
  const mod = getModule(prob.module)

  const leftPane = (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex border-b border-line px-2" role="tablist">
        {([['desc', 'Description'], ['hints', 'Hints'], ['sol', 'Solution']] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={left === k} onClick={() => setLeft(k)} className={`flex min-h-11 cursor-pointer items-center gap-1.5 border-b-2 px-3 text-sm font-semibold ${left === k ? 'border-accent text-fg' : 'border-transparent text-mute hover:text-fg'}`}>
            {l}{k === 'sol' && !attempted && <Lock size={12} />}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {left === 'desc' && <Description p={prob} />}
        {left === 'hints' && (
          <div>
            <p className="text-sm text-mute">Three hints, from a gentle nudge to nearly the answer. Reveal one at a time.</p>
            <ol className="mt-4 space-y-3">
              {prob.hints.slice(0, hints).map((h, i) => (
                <li key={i} className="rise rounded-xl border border-line bg-bg p-4 text-[15px]"><span className="font-mono text-xs text-accent">Hint {i + 1}</span><p className="mt-1">{h}</p></li>
              ))}
            </ol>
            {hints < 3 && <button onClick={() => setHints(hints + 1)} className={`${btn} mt-4 border border-line hover:bg-surface2`}><Eye size={16} /> Reveal hint {hints + 1}</button>}
          </div>
        )}
        {left === 'sol' && (attempted ? (
          <div>
            <CodeBlock code={prob.solution} tryIt={false} title="Reference solution" />
            <p className="mt-4 text-[15px] leading-relaxed">{prob.explanation}</p>
          </div>
        ) : (
          <Empty title="Solution locked">
            <p className="text-sm text-mute">Run or submit your code at least once to unlock the reference solution.</p>
          </Empty>
        ))}
      </div>
    </div>
  )

  const toolbar = (
    <div className="flex items-center gap-2 border-b border-line bg-surface px-2 py-1.5">
      <span className="hidden px-1 font-mono text-xs text-mute sm:block">main.c</span>
      <div className="ml-auto flex items-center rounded-lg border border-line">
        <button aria-label="Smaller font" onClick={() => setFs((f) => Math.max(11, f - 1))} className="grid size-11 cursor-pointer place-items-center text-mute hover:text-fg sm:size-9"><Minus size={14} /></button>
        <span className="w-9 text-center font-mono text-xs">{fs}px</span>
        <button aria-label="Larger font" onClick={() => setFs((f) => Math.min(24, f + 1))} className="grid size-11 cursor-pointer place-items-center text-mute hover:text-fg sm:size-9"><Plus size={14} /></button>
      </div>
      <button onClick={() => { setCode(prob.starter); saveCode(id, prob.starter) }} className={`${btn} border border-line px-3 hover:bg-surface2`} aria-label="Reset code"><RotateCcw size={15} /><span className="hidden sm:inline">Reset</span></button>
      <button onClick={() => exec('run')} disabled={running} className={`${btn} border border-line px-3 hover:bg-surface2 disabled:opacity-60`}><Play size={15} /> Run</button>
      <button onClick={() => exec('submit')} disabled={running} className={`${btnPrimary} px-3 disabled:opacity-60`}><Send size={15} /> Submit</button>
    </div>
  )
  const editor = (
    <div className="min-h-0 flex-1 overflow-hidden">
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <Editor value={code} onChange={change} fontSize={fs} onRun={() => exec('run')} />
      </Suspense>
    </div>
  )
  const consolePane = <ConsolePanel tests={prob.tests} state={state} running={running} tab={ctab} onTab={setCtab} />

  return (
    <div className="flex h-[calc(100dvh-var(--top)-var(--bot))] flex-col lg:h-screen">
      <div className="flex min-h-12 items-center gap-3 border-b border-line px-3">
        <Link to={`/practice/${prob.module}`} aria-label="Back to problems" className="grid size-11 place-items-center text-mute hover:text-fg"><ArrowLeft size={18} /></Link>
        <ProblemStatus s={prog.problems[id]} />
        <span className="truncate text-sm font-semibold">{prob.title}</span>
        <span className="hidden font-mono text-xs text-mute sm:block">Module {mod?.n}</span>
        <span className="ml-auto"><Badge level={prob.level} /></span>
      </div>

      <div className="grid min-h-0 flex-1 lg:hidden" style={{ gridTemplateRows: 'auto minmax(0,1fr)' }}>
        <div className="grid grid-cols-3 border-b border-line bg-surface" role="tablist">
          {([['problem', 'Problem'], ['code', 'Code'], ['output', 'Output']] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={mob === k} onClick={() => setMob(k)} className={`min-h-11 cursor-pointer border-b-2 text-sm font-semibold ${mob === k ? 'border-accent text-fg' : 'border-transparent text-mute'}`}>{l}</button>
          ))}
        </div>
        <div className="flex min-h-0 flex-col">
          {mob === 'problem' && leftPane}
          {mob === 'code' && <>{toolbar}{editor}</>}
          {mob === 'output' && <>{toolbar}<div className="min-h-0 flex-1">{consolePane}</div></>}
        </div>
      </div>

      <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(340px,5fr)_7fr]">
        <div className="min-h-0 border-r border-line">{leftPane}</div>
        <div className="grid min-h-0" style={{ gridTemplateRows: 'minmax(0,3fr) minmax(0,2fr)' }}>
          <div className="flex min-h-0 flex-col">{toolbar}{editor}</div>
          <div className="min-h-0 border-t border-line">{consolePane}</div>
        </div>
      </div>
    </div>
  )
}
