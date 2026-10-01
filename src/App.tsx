import { useEffect, useState } from 'react'
import Shell from './components/Shell'
import { Empty, PageSkeleton, btnPrimary } from './components/ui'
import { Link, useRoute } from './lib/router'
import { ProgressProvider } from './lib/store'
import HomePage from './pages/HomePage'
import ModulePage from './pages/ModulePage'
import TopicPage from './pages/TopicPage'
import QuizPage from './pages/QuizPage'
import ProblemsPage from './pages/ProblemsPage'
import WorkspacePage from './pages/WorkspacePage'
import ProgressPage from './pages/ProgressPage'
import AboutPage from './pages/AboutPage'
import PlaygroundPage from './pages/PlaygroundPage'

function Routes({ path }: { path: string }) {
  const [, a, b] = path.split('/')
  if (path === '/') return <HomePage />
  if (a === 'module' && b) return <ModulePage id={b} />
  if (a === 'topic' && b) return <TopicPage id={b} />
  if (a === 'quiz' && b) return <QuizPage key={b} id={b} />
  if (a === 'practice') return <ProblemsPage moduleId={b} />
  if (a === 'problem' && b) return <WorkspacePage id={b} />
  if (a === 'playground') return <PlaygroundPage />
  if (a === 'about') return <AboutPage />
  if (a === 'progress') return <ProgressPage />
  return (
    <Empty title="Page not found">
      <Link to="/" className={btnPrimary}>Go home</Link>
    </Empty>
  )
}

function Inner() {
  const path = useRoute()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 160)
    return () => clearTimeout(t)
  }, [path])
  return <Shell path={path}>{loading ? <PageSkeleton /> : <Routes path={path} />}</Shell>
}

export default function App() {
  return (
    <ProgressProvider>
      <Inner />
    </ProgressProvider>
  )
}
