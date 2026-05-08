import Image from 'next/image'
import Link from 'next/link'
import { getBlogPosts, formatDate } from 'app/blog/utils'

const FilmGlyph = () => (
  <svg
    viewBox="0 0 56 40"
    width="56"
    height="40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="6" y="14" width="44" height="22" />
    <rect x="6" y="6" width="44" height="8" />
    <line x1="14" y1="14" x2="18" y2="6" />
    <line x1="22" y1="14" x2="26" y2="6" />
    <line x1="30" y1="14" x2="34" y2="6" />
    <line x1="38" y1="14" x2="42" y2="6" />
    <line x1="12" y1="22" x2="44" y2="22" />
    <line x1="12" y1="28" x2="44" y2="28" />
  </svg>
)

const RecipeGlyph = () => (
  <svg
    viewBox="0 0 56 40"
    width="56"
    height="40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 4 Q 21 7 18 10" />
    <path d="M28 4 Q 31 7 28 10" />
    <path d="M38 4 Q 41 7 38 10" />
    <line x1="10" y1="14" x2="46" y2="14" />
    <path d="M12 16 L 44 16 L 41 36 L 15 36 Z" />
    <path d="M10 18 L 6 22" />
    <path d="M46 18 L 50 22" />
  </svg>
)

const TrackGlyph = () => (
  <svg
    viewBox="0 0 56 40"
    width="56"
    height="40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <circle cx="28" cy="20" r="17" />
    <circle cx="28" cy="20" r="13" />
    <circle cx="28" cy="20" r="9" />
    <circle cx="28" cy="20" r="2" fill="currentColor" />
  </svg>
)

const RECS: {
  idx: string
  name: string
  kind: string
  href: string
  glyph: React.ReactNode
}[] = [
    {
      idx: 'i.',
      name: 'The Studio',
      kind: 'Show',
      href: 'https://www.imdb.com/title/tt23649128/',
      glyph: <FilmGlyph />,
    },
    {
      idx: 'ii.',
      name: 'Dindigul Biriyani',
      kind: 'Recipe',
      href: 'https://www.kannammacooks.com/tamilnadu-thalappakatti-biriyani/',
      glyph: <RecipeGlyph />,
    },
    {
      idx: 'iii.',
      name: 'Osai Kekkudho',
      kind: 'Track',
      href: 'https://youtu.be/E69KvVkemeM',
      glyph: <TrackGlyph />,
    },
  ]

function tagClass(tag?: string) {
  const t = (tag || '').toLowerCase()
  if (t.includes('research')) return 't-research'
  if (t.includes('tutorial')) return 't-tutorial'
  if (t.includes('life') || t.includes('personal')) return 't-life'
  if (t.includes('note')) return 't-notes'
  return 't-default'
}

function shortDate(d: string) {
  const dt = new Date(d.includes('T') ? d : `${d}T00:00:00`)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yy = String(dt.getFullYear()).slice(-2)
  return `${dd}/${mm}/${yy}`
}

function Hero() {
  return (
    <section className="hero">
      <p className="hero-intro">
        Hello there! I&rsquo;m a PhD student at the Neurobionics Lab, advised
        by Prof. Elliott Rouse. My research focuses on robot codesign: how a
        robot&rsquo;s mechanical design and its control policy can co-evolve
        inside a simulation environment.
      </p>
      <div className="hero-columns">
        <div className="hero-column">
          <span className="hero-column-value">PhD W26</span>
        </div>
        <div className="hero-column">
          <span className="hero-column-value">Neurobionics Lab, U-M Robotics</span>
        </div>
        <div className="hero-column">
          <span className="hero-column-value">Ann Arbor, 2026</span>
        </div>
      </div>
    </section>
  )
}

function SectionHead({
  num,
  title,
  right,
}: {
  num: string
  title: string
  right?: string
}) {
  return (
    <div className="section-head">
      <span className="num">§ {num}</span>
      <h2>{title}</h2>
      {right && <span className="right">{right}</span>}
    </div>
  )
}

function Featured({
  post,
}: {
  post: {
    slug: string
    title: string
    summary?: string
    publishedAt: string
    image?: string
    readingTime?: number
  }
}) {
  return (
    <section className="section" id="featured">
      <SectionHead
        num="01"
        title="Latest Dispatch"
        right={`Updated ${formatDate(post.publishedAt)}`}
      />
      <div className="featured">
        <Link
          href={`/blog/${post.slug}`}
          className="img-frame"
          aria-label={post.title}
        >
          <span className="stamp">Featured</span>
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 1240px) 50vw, 100vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : null}
          <span className="corner">Fig. 01</span>
        </Link>
        <div className="copy">
          <h3>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          {post.summary && <p className="dek">{post.summary}</p>}
          <div className="meta">
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTime !== undefined && (
              <span>· {post.readingTime} min read</span>
            )}
          </div>
          <Link href={`/blog/${post.slug}`} className="read-on">
            Read the dispatch
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function PostsList({
  posts,
}: {
  posts: {
    slug: string
    title: string
    publishedAt: string
    readingTime?: number
    tags?: string[]
  }[]
}) {
  if (posts.length === 0) return null
  return (
    <section className="section" id="blog">
      <SectionHead
        num="02"
        title="From the Blog"
        right={`Archive · ${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}`}
      />
      <div className="posts">
        {posts.map((p) => {
          const primary = p.tags && p.tags.length > 0 ? p.tags[0] : undefined
          return (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="post-row">
              <span className="date">{shortDate(p.publishedAt)}</span>
              <span className="title">
                <span
                  className={`tag-dot ${tagClass(primary)}`}
                  aria-hidden="true"
                />
                {p.title}
              </span>
              <span className="read">
                {p.readingTime !== undefined ? `${p.readingTime} min` : ''}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function FrontPackage() {
  return (
    <section className="section" id="inside-the-paper">
      <SectionHead num="03" title="Quick Tour" right="Three pages" />
      <div className="front-package">
        <Link href="/projects" className="fp-lead">
          <div className="fp-lead-photo">
            <Image
              src="/projects/osl-v2.jpg"
              alt="Open-Source Leg v2"
              fill
              sizes="(min-width: 960px) 60vw, 100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3>Projects</h3>
          <p className="dek">
            Hardware and software toolchains for robotics research. Most of &rsquo;em are open-source and mostly work. When they don&rsquo;t, someone awesome in the community (often someone like you) fixes them.
          </p>
          <ol className="teaser-list" aria-label="Selected projects">
            <li>
              <span className="idx">i.</span>
              <span className="name">Open-Source Leg</span>
            </li>
            <li>
              <span className="idx">ii.</span>
              <span className="name">Onshape Robotics Toolkit</span>
            </li>
            <li>
              <span className="idx">iii.</span>
              <span className="name">ROB311 Ballbot</span>
            </li>
            <li>
              <span className="idx">iv.</span>
              <span className="name">Robot CI</span>
            </li>
            <li>
              <span className="idx">v.</span>
              <span className="name">Anton</span>
            </li>
          </ol>
          <span className="more">
            All projects
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>

        <div className="fp-side">
          <Link href="/about" className="fp-story fp-story-photo">
            <h3>About</h3>
            <p className="dek">
              I lead the Open-Source Leg as a research engineer for the past five years. In that time I also consulted briefly for the Robotics &amp; AI Institute and co-developed the ROB311 Ballbot. Before coming to the US in 2021, what was I doing? I&rsquo;m glad you asked.
            </p>
            <span className="more">
              Full bio
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
          <Link href="/publications" className="fp-story">
            <h3>Publications</h3>
            <p className="dek">
              Most recent: &ldquo;A Compensated Open-Loop Impedance Controller Evaluated on the Second-Generation Open-Source Leg Prosthesis.&rdquo; IEEE/ASME T-Mech, 2025.
            </p>
            <span className="more">
              All publications
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Recommendations() {
  return (
    <section className="section" id="recommendations">
      <SectionHead num="04" title="Recommendations" right="Three picks" />
      <div className="rec-grid">
        {RECS.map((r) => (
          <a
            key={r.idx}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rec-cell"
          >
            <div className="rec-meta">
              <span className="rec-kind">{r.kind}</span>
              <span className="rec-glyph">{r.glyph}</span>
            </div>
            <span className="rec-name">{r.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function Page() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  )

  const featured = posts[0]
  const rest = posts.slice(1, 6)

  return (
    <>
      <Hero />
      {featured && (
        <Featured
          post={{
            slug: featured.slug,
            title: featured.metadata.title,
            summary: featured.metadata.summary,
            publishedAt: featured.metadata.publishedAt,
            image: featured.metadata.image,
            readingTime: featured.metadata.readingTime,
          }}
        />
      )}
      <PostsList
        posts={rest.map((p) => ({
          slug: p.slug,
          title: p.metadata.title,
          publishedAt: p.metadata.publishedAt,
          readingTime: p.metadata.readingTime,
          tags: p.metadata.tags,
        }))}
      />
      <FrontPackage />
      <Recommendations />
    </>
  )
}
