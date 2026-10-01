import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Code2, Search } from 'lucide-react'
import { MODULES } from '../data/modules'
import { PROBLEMS } from '../data/problems'
import { go } from '../lib/router'

interface Hit {
  kind: 'Topic' | 'Problem'
  title: string
  sub: string
  to: string
  score: number
}

const INDEX: Omit<Hit, 'score'>[] & { text: string }[] = [] as never
const ENTRIES = [
  ...MODULES.flatMap((m) =>
    m.topics.map((t) => ({
      kind: 'Topic' as const,
      title: t.title,
      sub: `Module ${m.n}`,
      to: `/topic/${t.id}`,
      text: (t.intro.join(' ') + ' ' + t.takeaways.join(' ')).toLowerCase(),
    })),
  ),
  ...PROBLEMS.map((p) => ({
    kind: 'Problem' as const,
    title: p.title,
    sub: `${p.level} - Module ${MODULES.find((m) => m.id === p.module)?.n}`,
    to: `/problem/${p.id}`,
    text: p.statement.toLowerCase(),
  })),
]
void INDEX

export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const inp = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setI(0)
      setTimeout(() => inp.current?.focus(), 30)
    }
  }, [open])

  const hits = useMemo<Hit[]>(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return ENTRIES.map((e) => {
      const t = e.title.toLowerCase()
      let score = 0
      for (const w of words) {
        if (t.includes(w)) score += t.startsWith(w) ? 6 : 4
        else if (e.text.includes(w)) score += 1
        else return { ...e, score: 0 }
      }
      return { ...e, score }
    })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
  }, [q])

  if (!open) return null
  const pick = (h: Hit) => {
    onClose()
    go(h.to)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-3 pt-[10vh] sm:p-6 sm:pt-[12vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onMouseDown={(e) => e.stopPropagation()}
        className="rise w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="text-mute" />
          <input
            ref={inp}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setI(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setI((x) => Math.min(x + 1, hits.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setI((x) => Math.max(x - 1, 0))
              } else if (e.key === 'Enter' && hits[i]) pick(hits[i])
            }}
            placeholder="Search topics and problems..."
            aria-label="Search topics and problems"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-mute"
          />
          <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] text-mute sm:block">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {!q && <li className="p-6 text-center text-sm text-mute">Try "pointer", "recursion" or "matrix".</li>}
          {q && !hits.length && <li className="p-6 text-center text-sm text-mute">No matches for "{q}". Try a shorter keyword.</li>}
          {hits.map((h, idx) => (
            <li key={h.to} role="option" aria-selected={idx === i}>
              <button
                onMouseEnter={() => setI(idx)}
                onClick={() => pick(h)}
                className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left ${idx === i ? 'bg-accent-soft' : ''}`}
              >
                {h.kind === 'Topic' ? <BookOpen size={16} className="text-accent" /> : <Code2 size={16} className="text-accent" />}
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{h.title}</span>
                <span className="shrink-0 font-mono text-[11px] text-mute">{h.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
