import Link from 'next/link'
import { getBlogPosts, formatDate } from 'app/blog/utils'

interface Post {
  slug: string
  metadata: {
    title: string
    publishedAt: string
    summary?: string
    image?: string
    imagePosition?: string
    readingTime?: number
    tags?: string[]
  }
}

function groupByYear(posts: Post[]) {
  const groups: Record<string, Post[]> = {}
  for (const p of posts) {
    const year = new Date(p.metadata.publishedAt).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(p)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
}

function PostEntry({ post }: { post: Post }) {
  const { metadata, slug } = post
  return (
    <Link
      href={`/blog/${slug}`}
      className="block group no-underline py-5 border-b border-current/15"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h3
            className="text-base md:text-lg font-medium leading-snug text-[var(--text)] group-hover:text-[var(--accent)] transition-colors"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            {metadata.title}
          </h3>
          {metadata.summary && (
            <p
              className="mt-1.5 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--text)_70%,transparent)]"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {metadata.summary}
            </p>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_55%,transparent)]">
            <time dateTime={metadata.publishedAt}>
              {formatDate(metadata.publishedAt)}
            </time>
            {metadata.readingTime !== undefined && (
              <>
                <span aria-hidden>·</span>
                <span>{metadata.readingTime} min read</span>
              </>
            )}
            {metadata.tags && metadata.tags.length > 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="flex flex-wrap gap-x-2">
                  {metadata.tags.map((tag, i) => (
                    <span key={tag}>
                      {tag}
                      {i < metadata.tags!.length - 1 && (
                        <span aria-hidden> ·</span>
                      )}
                    </span>
                  ))}
                </span>
              </>
            )}
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
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export function BlogPosts() {
  const allBlogs = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  )

  if (allBlogs.length === 0) {
    return (
      <p className="opacity-60 text-sm font-mono uppercase tracking-[0.15em] py-12 text-center">
        No posts yet — check back soon.
      </p>
    )
  }

  const grouped = groupByYear(allBlogs)

  return (
    <div className="space-y-10">
      {grouped.map(([year, posts]) => (
        <section key={year}>
          <div className="flex items-baseline gap-4 mb-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--accent)]">
              {year}
            </h2>
            <span className="flex-1 border-t border-current/20" />
          </div>
          <div>
            {posts.map((post) => (
              <PostEntry key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
