import { useState } from 'react'
import { Check, Copy, Play } from 'lucide-react'
import { highlightC } from '../lib/highlight'
import { storage } from '../lib/store'
import { go } from '../lib/router'
import type { Lang } from '../data/types'

export const PG_KEY = 'cquest:playground'

export default function CodeBlock({ code, lang = 'c', title, tryIt = true }: { code: string; lang?: Lang; title?: string; tryIt?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const open = () => {
    storage.set(PG_KEY, code)
    go('/playground')
  }
  const small =
    'inline-flex min-h-9 items-center gap-1.5 rounded-md border border-line px-3 text-xs font-semibold text-fg transition hover:bg-surface2 cursor-pointer'
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface">
      <figcaption className="flex items-center justify-between gap-2 border-b border-line bg-surface2 px-3 py-1.5">
        <span className="truncate font-mono text-xs uppercase tracking-wider text-mute">{title ?? lang}</span>
        <span className="flex gap-2">
          <button onClick={copy} className={small} aria-label="Copy code">
            {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
          </button>
          {lang === 'c' && tryIt && (
            <button onClick={open} className={`${small} !border-accent/50 text-accent`}>
              <Play size={14} /> Try it
            </button>
          )}
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        {lang === 'c' ? <code dangerouslySetInnerHTML={{ __html: highlightC(code) }} /> : <code>{code}</code>}
      </pre>
    </figure>
  )
}
