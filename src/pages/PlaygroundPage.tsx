import { lazy, Suspense, useCallback, useState } from 'react'
import { Minus, Play, Plus } from 'lucide-react'
import ConsolePanel, { type RunState } from '../components/ConsolePanel'
import { PG_KEY } from '../components/CodeBlock'
import { Skeleton, btnPrimary, Eyebrow } from '../components/ui'
import { runCode } from '../lib/runCode'
import { storage } from '../lib/store'

const Editor = lazy(() => import('../components/Editor'))

const DEFAULT = `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum: %d\\n", a + b);
    return 0;
}
`

export default function PlaygroundPage() {
  const [code, setCode] = useState(() => storage.get(PG_KEY) ?? DEFAULT)
  const [stdin, setStdin] = useState('3 4')
  const [fs, setFs] = useState(14)
  const [running, setRunning] = useState(false)
  const [state, setState] = useState<RunState | null>(null)
  const change = (v: string) => { setCode(v); storage.set(PG_KEY, v) }

  const run = useCallback(async () => {
    setRunning(true)
    try {
      const r = await runCode(code, stdin)
      setState({ kind: 'free', results: [], compileError: r.compileError, stdout: r.stdout, stderr: r.stderr, mode: r.mode, verdict: r.compileError ? 'Compilation Error' : undefined })
    } finally { setRunning(false) }
  }, [code, stdin])

  return (
    <div className="flex h-[calc(100dvh-var(--top)-var(--bot))] flex-col px-3 py-3 sm:px-6 lg:h-screen lg:py-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="mr-auto"><Eyebrow>Free playground</Eyebrow><h1 className="text-2xl">Scratchpad</h1></div>
        <div className="flex items-center rounded-lg border border-line">
          <button aria-label="Smaller font" onClick={() => setFs((f) => Math.max(11, f - 1))} className="grid size-11 cursor-pointer place-items-center text-mute hover:text-fg"><Minus size={14} /></button>
          <span className="w-9 text-center font-mono text-xs">{fs}px</span>
          <button aria-label="Larger font" onClick={() => setFs((f) => Math.min(24, f + 1))} className="grid size-11 cursor-pointer place-items-center text-mute hover:text-fg"><Plus size={14} /></button>
        </div>
        <button onClick={run} disabled={running} className={`${btnPrimary} disabled:opacity-60`}><Play size={16} /> Run</button>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-1">
        <div className="min-h-[260px] overflow-hidden rounded-xl border border-line">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <Editor value={code} onChange={change} fontSize={fs} onRun={run} />
          </Suspense>
        </div>
        <div className="grid min-h-0 grid-rows-[auto_minmax(200px,1fr)] gap-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-mute">Standard input</span>
            <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} rows={3} spellCheck={false} className="w-full resize-none rounded-xl border border-line bg-surface p-3 font-mono text-sm outline-none focus:border-accent" />
          </label>
          <div className="min-h-0 overflow-hidden rounded-xl border border-line">
            <ConsolePanel state={state} running={running} tab="output" onTab={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
