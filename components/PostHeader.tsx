import { formatDate } from 'app/blog/utils'

interface PostHeaderProps {
  metadata: {
    title: string
    publishedAt: string
    summary?: string
    readingTime?: number
    tags?: string[]
  }
}

export default function PostHeader({ metadata }: PostHeaderProps) {
  return (
    <header className="mb-8">
      <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_55%,transparent)] mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
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
            <span className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </span>
          </>
        )}
      </div>
      <h1
        className="font-medium text-[var(--text)] leading-[1.2] tracking-[0.01em]"
        style={{
          fontFamily: 'var(--font-serif), Georgia, serif',
          fontSize: 'clamp(1.75rem, 1.4rem + 1.5vw, 2.25rem)',
        }}
      >
        {metadata.title}
      </h1>
      {metadata.summary && (
        <p
          className="mt-3 text-base leading-relaxed text-[color:color-mix(in_srgb,var(--text)_70%,transparent)]"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {metadata.summary}
        </p>
      )}
    </header>
  )
}
