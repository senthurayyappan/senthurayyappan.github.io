import Link from 'next/link'

interface PostRef {
  slug: string
  metadata: { title: string }
}

interface PostFooterProps {
  slug: string
  prev?: PostRef
  next?: PostRef
  repoUrl: string
}

export default function PostFooter({
  slug,
  prev,
  next,
  repoUrl,
}: PostFooterProps) {
  const editUrl = `${repoUrl}/edit/main/app/blog/posts/${slug}.mdx`
  return (
    <footer className="mt-16 pt-8 border-t border-[color:color-mix(in_srgb,var(--text)_15%,transparent)]">
      {(prev || next) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="block group no-underline"
            >
              <span className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_50%,transparent)]">
                ← Previous
              </span>
              <span
                className="block mt-1 font-medium text-base leading-snug text-[var(--text)] group-hover:underline"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                {prev.metadata.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="block group no-underline md:text-right md:col-start-2"
            >
              <span className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_50%,transparent)]">
                Next →
              </span>
              <span
                className="block mt-1 font-medium text-base leading-snug text-[var(--text)] group-hover:underline"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                {next.metadata.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-[11px] font-mono uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_55%,transparent)]">
        <Link href="/blog" className="hover:text-[var(--text)] transition-colors">
          All posts
        </Link>
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--text)] transition-colors"
        >
          Edit on GitHub
        </a>
        <a
          href="/rss"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--text)] transition-colors"
        >
          RSS
        </a>
      </div>
    </footer>
  )
}
