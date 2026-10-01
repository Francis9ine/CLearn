import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import type { TestCase } from '../data/types'

export interface TestResult {
  pass: boolean
  actual: string
  stderr: string
}
export type Verdict = 'Accepted' | 'Wrong Answer' | 'Compilation Error' | 'Runtime Error'
export interface RunState {
  kind: 'run' | 'submit' | 'free'
  verdict?: Verdict
  results: (TestResult | null)[]
  compileError: string
  stdout: string
  stderr: string
  mode: 'judge0' | 'mock'
}

const VC: Record<Verdict, string> = {
  Accepted: 'text-ok border-ok/40 bg-ok/10',
  'Wrong Answer': 'text-bad border-bad/40 bg-bad/10',
  'Compilation Error': 'text-warn border-warn/40 bg-warn/10',
  'Runtime Error': 'text-bad border-bad/40 bg-bad/10',
}

const Pre = ({ children, tone }: { children: string; tone?: 'bad' }) => (
  <pre className={`max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-line bg-bg p-3 font-mono text-[13px] leading-5 ${tone === 'bad' ? 'text-bad' : ''}`}>
    {children || ' '}
  </pre>
)
const Label = ({ children }: { children: string }) => <p className="mb-1 mt-3 font-mono text-[11px] uppercase tracking-wider text-mute first:mt-0">{children}</p>

export default function ConsolePanel({
  tests,
  state,
  running,
  tab,
  onTab,
}: {
  tests?: TestCase[]
  state: RunState | null
  running: boolean
  tab: 'tests' | 'output'
  onTab: (t: 'tests' | 'output') => void
}) {
  const [sel, setSel] = useState(0)
  useEffect(() => {
    if (tests && sel >= tests.length) setSel(0)
  }, [tests, sel])

  const tabs = tests ? (['tests', 'output'] as const) : (['output'] as const)
  const cur = tests?.[sel]
  const res = state?.results[sel] ?? null
  const shown = state?.kind === 'run' ? tests?.filter((t) => !t.hidden) : tests

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex items-center gap-1 border-b border-line px-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => onTab(t)}
            className={`min-h-11 cursor-pointer border-b-2 px-3 text-sm font-semibold transition ${tab === t ? 'border-accent text-fg' : 'border-transparent text-mute hover:text-fg'}`}
          >
            {t === 'tests' ? 'Test Cases' : 'Output'}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-2 pr-2">
          {running && <Loader2 size={16} className="animate-spin text-accent" aria-label="Running" />}
          {state && (
            <span
              title={state.mode === 'mock' ? 'Judge0 was unreachable, so results come from the offline mock runner' : 'Executed with GCC via Judge0 CE'}
              className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${state.mode === 'mock' ? 'bg-warn/15 text-warn' : 'bg-accent-soft text-accent'}`}
            >
              {state.mode === 'mock' ? 'Mock mode' : 'GCC'}
            </span>
          )}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        {tab === 'tests' && tests && cur && (
          <div>
            {state?.verdict && (
              <div className={`mb-3 flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${VC[state.verdict]}`}>
                {state.verdict === 'Accepted' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {state.verdict}
                {state.verdict !== 'Compilation Error' && (
                  <span className="font-mono text-xs font-normal opacity-80">
                    {state.results.filter((r) => r?.pass).length}/{shown?.length} passed
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {tests.map((t, i) => {
                const r = state?.results[i]
                if (state?.kind === 'run' && t.hidden) return null
                return (
                  <button
                    key={i}
                    onClick={() => setSel(i)}
                    aria-pressed={sel === i}
                    className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 font-mono text-xs transition ${sel === i ? 'border-accent bg-accent-soft' : 'border-line hover:bg-surface2'}`}
                  >
                    {r ? r.pass ? <CheckCircle2 size={14} className="text-ok" /> : <XCircle size={14} className="text-bad" /> : null}
                    {t.hidden ? `Hidden ${i + 1}` : `Case ${i + 1}`}
                  </button>
                )
              })}
            </div>
            <div className="mt-3">
              {cur.hidden && state?.kind !== 'submit' ? (
                <p className="text-sm text-mute">Hidden test cases are revealed only as pass or fail when you Submit.</p>
              ) : cur.hidden ? (
                <p className={`text-sm font-semibold ${res?.pass ? 'text-ok' : 'text-bad'}`}>
                  {res ? (res.pass ? 'Passed' : 'Failed') : 'Not run'} <span className="font-normal text-mute">- input and expected output are hidden</span>
                </p>
              ) : (
                <>
                  <Label>Input</Label>
                  <Pre>{cur.input}</Pre>
                  <Label>Expected output</Label>
                  <Pre>{cur.output}</Pre>
                  {res && (
                    <>
                      <Label>{`Your output - ${res.pass ? 'Pass' : 'Fail'}`}</Label>
                      <Pre tone={res.pass ? undefined : 'bad'}>{res.actual}</Pre>
                      {res.stderr && (
                        <>
                          <Label>stderr</Label>
                          <Pre tone="bad">{res.stderr}</Pre>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {tab === 'output' && (
          <div>
            {!state && !running && <p className="text-sm text-mute">Run your code to see its output here.</p>}
            {running && !state && <p className="text-sm text-mute">Compiling and running...</p>}
            {state?.verdict && (
              <div className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${VC[state.verdict]}`}>
                {state.verdict === 'Compilation Error' ? <AlertTriangle size={18} /> : state.verdict === 'Accepted' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {state.verdict}
              </div>
            )}
            {state?.compileError && (
              <>
                <Label>Compilation error</Label>
                <Pre tone="bad">{state.compileError}</Pre>
              </>
            )}
            {state && !state.compileError && (
              <>
                <Label>stdout</Label>
                <Pre>{state.stdout}</Pre>
                {state.stderr && (
                  <>
                    <Label>stderr</Label>
                    <Pre tone="bad">{state.stderr}</Pre>
                  </>
                )}
              </>
            )}
            {state?.mode === 'mock' && (
              <p className="mt-3 rounded-lg border border-warn/30 bg-warn/10 p-3 text-xs text-warn">
                Mock mode: the online compiler could not be reached, so this is a demonstration run and not real GCC output. Verdicts for practice problems are approximated from your source code.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
