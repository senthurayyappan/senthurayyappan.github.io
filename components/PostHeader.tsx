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
    <header className="mb-10">
      <h1
        className="font-medium tracking-tight text-[var(--text)] leading-[1.05]"
        style={{
          fontFamily: 'var(--font-serif), Georgia, serif',
          fontSize: 'clamp(2.5rem, 1.75rem + 3vw, 4rem)',
        }}
      >
        {metadata.title}
        <span className="text-[var(--accent)]">.</span>
      </h1>
      {metadata.summary && (
        <p
          className="mt-4 max-w-[640px] text-lg leading-relaxed text-[color:color-mix(in_srgb,var(--text)_70%,transparent)]"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {metadata.summary}
        </p>
      )}
      <div className="meta-line mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="flex flex-wrap gap-x-5 gap-y-1">
          <time dateTime={metadata.publishedAt}>
            {formatDate(metadata.publishedAt)}
          </time>
          {metadata.readingTime !== undefined && (
            <span>{metadata.readingTime} min read</span>
          )}
        </span>
        {metadata.tags && metadata.tags.length > 0 && (
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            {metadata.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        )}
      </div>
    </header>
  )
}
