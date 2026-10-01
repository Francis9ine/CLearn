import { Eyebrow, btnPrimary } from '../components/ui'
import { Link } from '../lib/router'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-14">
      <Eyebrow>About</Eyebrow>
      <h1 className="rise mt-3 text-4xl leading-tight sm:text-6xl">
        Hi, I'm <span className="text-accent">Francis</span>.
      </h1>
      <div className="mt-6 space-y-4 text-[17px] leading-relaxed">
        <p>I made C Quest as a place to learn C the way I wish it had been taught: clear explanations first, then hands-on problems to prove it.</p>
        <p>The app was designed in Figma Design and built with Figma Make, taking it from first sketch to a working learn-and-practice platform.</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          ['Designed with', 'Figma Design'],
          ['Built with', 'Figma Make'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-mute">{k}</p>
            <p className="mt-1 font-display text-2xl">{v}</p>
          </div>
        ))}
      </div>
      <Link to="/" className={`${btnPrimary} mt-8`}>Start learning</Link>
    </div>
  )
}
