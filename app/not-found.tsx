import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="py-16">
      <h1
        className="font-medium tracking-tight text-[var(--text)] leading-[0.95]"
        style={{
          fontFamily: 'var(--font-serif), Georgia, serif',
          fontSize: 'clamp(3rem, 2rem + 4vw, 5rem)',
        }}
      >
        Not found<span className="text-[var(--accent)]">.</span>
      </h1>
      <p
        className="mt-6 max-w-[480px] text-lg leading-relaxed text-[color:color-mix(in_srgb,var(--text)_70%,transparent)]"
        style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
      >
        This page doesn&rsquo;t exist — the line looped back without enclosing
        a dot.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors"
        style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
      >
        Back home
        <span
          aria-hidden
          className="text-[var(--accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </section>
  )
}
