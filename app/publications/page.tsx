import React, { Fragment } from 'react'

interface Publication {
  title: string
  authors: string[]
  venue: string
  year: number
  href: string
}

const publications: Publication[] = [
  {
    title:
      'A Compensated Open-Loop Impedance Controller Evaluated on the Second-Generation Open-Source Leg Prosthesis',
    authors: [
      'T Kevin Best',
      'Gray C Thomas',
      'Senthur R Ayyappan',
      'Robert D Gregg',
      'Elliott J Rouse',
    ],
    venue: 'IEEE/ASME Transactions on Mechatronics',
    year: 2025,
    href: 'https://ieeexplore.ieee.org/abstract/document/10807510',
  },
  {
    title:
      'Quantitative Estimation of Dynamic Modulation in Impedance Controlled Remote Environment Sensing',
    authors: [
      'Srikar A',
      'Vijay Kumar P',
      'Senthur Raj',
      'Asokan T',
    ],
    venue: 'IEEE Sensors Journal',
    year: 2020,
    href: 'https://ieeexplore.ieee.org/document/9279234',
  },
  {
    title:
      'Ibex: A reconfigurable ground vehicle with adaptive terrain navigation capability',
    authors: [
      'Senthur Raj',
      'Manu Aatitya R P',
      'Jack Samuel S',
      'J Veejay Karthik',
      'Ezhilarasi D',
    ],
    venue:
      'IEEE International Conference on Robotics and Automation (ICRA), Paris',
    year: 2020,
    href: 'https://ieeexplore.ieee.org/document/9196571',
  },
  {
    title:
      'Parameter Determination Technique for Impedance Control of Interactive Robots Using Transformation Matrices',
    authors: [
      'Srikar A',
      'Senthur Raj',
      'Vijay Kumar P',
      'Asokan T',
    ],
    venue:
      'IFAC Conference on Advances in Control and Optimization of Dynamical Systems (ACODS), Chennai',
    year: 2020,
    href: 'https://www.sciencedirect.com/science/article/pii/S2405896320300525',
  },
  {
    title: 'Dynamic Modulation of Human Interactive Robots using Impedance Control',
    authors: [
      'Srikar A',
      'Senthur Raj',
      'Vijay Kumar P',
      'Asokan T',
    ],
    venue:
      'International Conference on Advances in Robotics (AIR), Chennai',
    year: 2019,
    href: 'https://dl.acm.org/doi/10.1145/3352593.3352597',
  },
]

export const metadata = {
  title: 'Publications',
  description: 'Peer-reviewed papers and conference proceedings.',
}

function isAuthor(name: string) {
  return /senthur/i.test(name)
}

function groupByYear(pubs: Publication[]) {
  const groups = new Map<number, Publication[]>()
  for (const p of pubs) {
    if (!groups.has(p.year)) groups.set(p.year, [])
    groups.get(p.year)!.push(p)
  }
  return Array.from(groups.entries()).sort(([a], [b]) => b - a)
}

function PublicationEntry({ pub }: { pub: Publication }) {
  return (
    <a
      href={pub.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group no-underline py-5 border-b border-current/15"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h3
            className="text-base md:text-lg font-medium leading-snug text-[var(--text)] group-hover:text-[var(--accent)] transition-colors"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            {pub.title}
          </h3>
          <p
            className="mt-1.5 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--text)_70%,transparent)]"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            {pub.authors.map((a, i) => (
              <Fragment key={`${a}-${i}`}>
                {isAuthor(a) ? (
                  <span className="font-semibold text-[var(--text)]">{a}</span>
                ) : (
                  a
                )}
                {i < pub.authors.length - 1 ? ', ' : ''}
              </Fragment>
            ))}
          </p>
          <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_55%,transparent)]">
            {pub.venue}
          </p>
        </div>
        <span
          aria-hidden
          className="flex-none mt-1 text-[var(--accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
      </div>
    </a>
  )
}

export default function Page() {
  const grouped = groupByYear(publications)

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-6 md:py-10">
      <header className="mb-12">
        <h1
          className="font-medium tracking-tight text-[var(--text)] leading-[0.95]"
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'clamp(3rem, 2rem + 4vw, 5rem)',
          }}
        >
          Publications<span className="text-[var(--accent)]">.</span>
        </h1>
      </header>

      <div className="space-y-10">
        {grouped.map(([year, pubs]) => (
          <section key={year}>
            <div className="flex items-baseline gap-4 mb-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--accent)]">
                {year}
              </h2>
              <span className="flex-1 border-t border-current/20" />
            </div>
            <div>
              {pubs.map((p, i) => (
                <PublicationEntry key={`${p.year}-${i}`} pub={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
