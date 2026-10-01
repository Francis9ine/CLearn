import { useEffect, useRef, type ReactNode } from 'react'
import { CheckCircle2, Circle, CircleDot, MinusCircle } from 'lucide-react'
import type { Level } from '../data/types'

export const btn =
  'inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-lg text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none'
export const btnPrimary = `${btn} bg-accent text-accent-fg hover:brightness-110`
export const btnGhost = `${btn} border border-line bg-surface text-fg hover:bg-surface2`

export function ProgressRing({ value, size = 56, stroke = 5, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label ?? 'Progress'} ${pct} percent`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - value)}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-[11px] font-medium" style={{ fontSize: size < 50 ? 10 : size > 90 ? 20 : 12 }}>
        {pct}%
      </span>
    </div>
  )
}

const LV: Record<Level, string> = {
  Easy: 'text-ok border-ok/40 bg-ok/10',
  Medium: 'text-warn border-warn/40 bg-warn/10',
  Hard: 'text-bad border-bad/40 bg-bad/10',
}
export const Badge = ({ level }: { level: Level }) => (
  <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider ${LV[level]}`}>{level}</span>
)

export function TopicStatus({ s }: { s?: 'progress' | 'done' }) {
  if (s === 'done')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ok">
        <CheckCircle2 size={16} /> Done
      </span>
    )
  if (s === 'progress')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warn">
        <CircleDot size={16} /> In progress
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute">
      <Circle size={16} /> Not started
    </span>
  )
}

export function ProblemStatus({ s, size = 20 }: { s?: 'attempted' | 'solved'; size?: number }) {
  if (s === 'solved') return <CheckCircle2 size={size} className="text-ok" aria-label="Solved" />
  if (s === 'attempted') return <MinusCircle size={size} className="text-warn" aria-label="Attempted" />
  return <Circle size={size} className="text-mute" aria-label="Unsolved" />
}

export const Skeleton = ({ className = '' }: { className?: string }) => <div className={`skeleton ${className}`} />

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  )
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-10 text-center">
      <p className="font-display text-xl">{title}</p>
      <div className="mt-2 text-sm text-mute">{children}</div>
    </div>
  )
}

export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className="rise w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
      >
        <h2 className="font-display text-2xl">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{children}</p>
}
