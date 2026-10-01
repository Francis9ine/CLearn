import { useEffect, useState, type ReactNode } from 'react'
import { BarChart3, BookOpen, Code2, Info, Moon, Search, SquareTerminal, Sun, Terminal } from 'lucide-react'
import { Link } from '../lib/router'
import { useProgress } from '../lib/store'
import { MODULES } from '../data/modules'
import SearchPalette from './SearchPalette'
import { ProgressRing } from './ui'

const NAV = [
  { to: '/', label: 'Learn', icon: BookOpen, match: (p: string) => p === '/' || /^\/(module|topic|quiz)/.test(p) },
  { to: '/practice', label: 'Practice', icon: Code2, match: (p: string) => /^\/(practice|problem)/.test(p) },
  { to: '/playground', label: 'Playground', icon: SquareTerminal, match: (p: string) => p === '/playground' },
  { to: '/progress', label: 'Progress', icon: BarChart3, match: (p: string) => p === '/progress' },
  { to: '/about', label: 'About', icon: Info, match: (p: string) => p === '/about' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="C Quest home">
      <span className="grid size-9 place-items-center rounded-xl bg-accent font-mono text-lg font-bold text-accent-fg shadow-[0_0_18px_-2px_var(--accent)]">C</span>
      <span className="font-display text-xl font-semibold tracking-tight">
        C Quest<span className="text-accent">_</span>
      </span>
    </Link>
  )
}

export default function Shell({ path, children }: { path: string; children: ReactNode }) {
  const { p, toggleTheme, moduleRatio } = useProgress()
  const [search, setSearch] = useState(false)
  const [, a, b] = path.split('/')
  const mod = a === 'module' ? b : a === 'topic' || a === 'quiz' ? b?.split('-')[0] : a === 'practice' ? b : undefined
  const title =
    a === 'problem' ? 'Problem' : a === 'playground' ? 'Playground' : a === 'progress' ? 'Progress' : a === 'about' ? 'About' : a === 'practice' && !b ? 'Practice' : (mod && MODULES.find((m) => m.id === mod)?.title) || 'Learn'

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch((s) => !s)
      }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const themeBtn = (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${p.theme === 'dark' ? 'light' : 'dark'} theme`}
      className="grid size-10 cursor-pointer place-items-center rounded-xl border border-line bg-surface2/60 text-mute transition hover:bg-surface2 hover:text-fg"
    >
      {p.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )

  return (
    <div className="min-h-screen overflow-x-clip">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-line bg-surface lg:flex">
        <div className="p-5">
          <Logo />
        </div>
        <button
          onClick={() => setSearch(true)}
          className="mx-4 mb-4 flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-line bg-bg px-3 text-sm text-mute transition hover:border-accent/50"
        >
          <Search size={16} /> Search
          <kbd className="ml-auto rounded border border-line px-1.5 font-mono text-[10px]">Ctrl K</kbd>
        </button>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3" aria-label="Main">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  aria-current={n.match(path) ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${n.match(path) ? 'bg-accent-soft text-accent' : 'text-mute hover:bg-surface2 hover:text-fg'}`}
                >
                  <n.icon size={18} /> {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mb-2 mt-6 px-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Modules</p>
          <ul className="space-y-1 pb-4">
            {MODULES.map((m) => {
              const active = path.includes(`/${m.id}`) || (path.startsWith('/topic/') && path.includes(`/${m.id}-`))
              return (
                <li key={m.id}>
                  <Link
                    to={`/module/${m.id}`}
                    className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${active ? 'bg-surface2 text-fg' : 'text-mute hover:bg-surface2 hover:text-fg'}`}
                  >
                    <span className="w-6 font-mono text-xs text-accent">{m.n}</span>
                    <span className="min-w-0 flex-1 truncate">{m.title}</span>
                    <ProgressRing value={moduleRatio(m.id)} size={26} stroke={3} label={m.title} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex items-center justify-between border-t border-line p-4">
          <p className="flex items-center gap-1.5 font-mono text-xs text-mute">
            <Terminal size={14} /> no account needed
          </p>
          {themeBtn}
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/95 pt-[var(--safe-top)] backdrop-blur lg:hidden">
        <div className="flex h-14 items-center gap-2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
          <button
            onClick={() => setSearch(true)}
            aria-label="Search"
            className="flex h-10 min-w-[5.5rem] cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line bg-surface2 px-4 text-sm font-semibold text-accent shadow-sm"
          >
            <Search size={15} /> Search
          </button>
          <Link to="/" className="min-w-0 flex-1 text-center leading-tight" aria-label="C Quest home">
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute">C Quest<span className="text-accent">_</span></span>
            <span className="block truncate font-display text-base font-semibold">{title}</span>
          </Link>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${p.theme === 'dark' ? 'light' : 'dark'} theme`}
            className="flex h-10 min-w-[5.5rem] cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line bg-surface2 px-4 text-sm font-semibold text-accent shadow-sm"
          >
            {p.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />} {p.theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <div className="h-0.5 bg-accent/15" aria-hidden>
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${(MODULES.reduce((t, m) => t + moduleRatio(m.id), 0) / MODULES.length) * 100}%` }} />
        </div>
      </header>

      <main className="min-w-0 pt-[var(--top)] lg:pt-0 overflow-x-clip pb-[var(--bot)] lg:pb-0 lg:pl-72">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Main">
        {NAV.map((n) => {
          const on = n.match(path)
          return (
            <Link
              key={n.to}
              to={n.to}
              aria-current={on ? 'page' : undefined}
              className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${on ? 'text-accent' : 'text-mute'}`}
            >
              <n.icon size={22} strokeWidth={on ? 2.4 : 1.8} />
              {n.label}
            </Link>
          )
        })}
      </nav>

      <SearchPalette open={search} onClose={() => setSearch(false)} />
    </div>
  )
}
