import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'
import { formatDate } from 'app/blog/utils'
import ComicPanel from './ComicPanel'

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

function PostRow({ post }: { post: Post }) {
  const { metadata, slug } = post
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block py-6 border-b border-current/15 no-underline transition-colors hover:bg-[color:color-mix(in_srgb,var(--accent)_5%,transparent)]"
    >
      <div className="flex flex-col md:grid md:grid-cols-[110px_minmax(0,1fr)] md:gap-8 md:items-baseline">
        <time
          dateTime={metadata.publishedAt}
          className="text-xs font-mono uppercase tracking-[0.15em] opacity-50 mb-2 md:mb-0 md:pt-1"
        >
          {new Date(
            metadata.publishedAt.includes('T')
              ? metadata.publishedAt
              : `${metadata.publishedAt}T00:00:00`
          ).toLocaleString('en-us', { month: 'short', day: 'numeric' })}
        </time>
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-snug text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            {metadata.title}
          </h3>
          {metadata.summary && (
            <p className="mt-2 text-sm md:text-base opacity-75 leading-relaxed">
              {metadata.summary}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono uppercase tracking-[0.15em] opacity-60">
            {metadata.readingTime !== undefined && (
              <span>{metadata.readingTime} min read</span>
            )}
            {metadata.tags && metadata.tags.length > 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="flex flex-wrap gap-1.5">
                  {metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 border border-current/40"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </div>
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

  const [featured, ...rest] = allBlogs
  const grouped = groupByYear(rest)

  return (
    <div className="space-y-8">
      <ComicPanel
        className="w-full"
        imageSrc={featured.metadata.image}
        imagePosition={featured.metadata.imagePosition || 'center center'}
        title={featured.metadata.title}
        titlePosition="bottom-right"
        description={featured.metadata.summary}
        descriptionPosition="bottom"
        href={`/blog/${featured.slug}`}
        newTab={false}
      >
        <div className="absolute top-4 left-4 z-10">
          <span className="speech text-[10px] font-mono uppercase tracking-[0.15em]">
            Latest · {formatDate(featured.metadata.publishedAt)}
            {featured.metadata.readingTime !== undefined && (
              <> · {featured.metadata.readingTime} min</>
            )}
          </span>
        </div>
        <div className="h-40 md:h-48" />
      </ComicPanel>

      {rest.length > 0 && (
        <div className="space-y-10">
          {grouped.map(([year, posts]) => (
            <section key={year}>
              <div className="flex items-baseline gap-4 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--accent)]">
                  {year}
                </h2>
                <span className="flex-1 border-t border-current/20" />
                <span className="text-xs font-mono uppercase tracking-[0.15em] opacity-50">
                  {posts.length} post{posts.length === 1 ? '' : 's'}
                </span>
              </div>
              <div>
                {posts.map((post) => (
                  <PostRow key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
