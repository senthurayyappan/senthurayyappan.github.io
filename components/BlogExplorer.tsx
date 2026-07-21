'use client'

import { useMemo, useState } from 'react'
import type { Metadata } from '@/app/blog/utils'
import ComicPanel from './ComicPanel'

export type BlogIndexPost = {
  slug: string
  metadata: Metadata
  formattedDate: string
}

export function BlogExplorer({ posts }: { posts: BlogIndexPost[] }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const tags = useMemo(
    () => ['All', ...Array.from(new Set(posts.flatMap((post) => post.metadata.tags || []))).sort()],
    [posts],
  )

  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesTag = activeTag === 'All' || post.metadata.tags?.includes(activeTag)
      const haystack = [post.metadata.title, post.metadata.summary, ...(post.metadata.tags || [])].join(' ').toLowerCase()
      return matchesTag && (!needle || haystack.includes(needle))
    })
  }, [activeTag, posts, query])

  return (
    <>
      <section className="blog-controls" aria-label="Filter posts">
        <label className="blog-search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search posts"
            placeholder="Try “controls” or “design”"
          />
        </label>
        <div className="blog-tags" aria-label="Filter by topic">
          {tags.map((tag) => (
            <span className="blog-tag-cell" key={tag}>
              <button
                type="button"
                className={activeTag === tag ? 'is-active' : ''}
                aria-pressed={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            </span>
          ))}
        </div>
      </section>

      {filteredPosts.length ? (
        <div className="blog-panel-grid" aria-live="polite">
          {filteredPosts.map((post) => (
            <ComicPanel
              key={post.slug}
              className="blog-post-panel"
              imageSrc={post.metadata.image}
              imagePosition={post.metadata.imagePosition || 'center center'}
              title={post.metadata.title}
              titlePosition="top-right"
              description={
                <div className="blog-panel-caption">
                  <p>{post.metadata.summary}</p>
                  <div className="blog-panel-details">
                    <span className="blog-panel-dateline">
                      <time dateTime={post.metadata.publishedAt}>{post.formattedDate}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.metadata.readingTime} min read</span>
                    </span>
                    <span className="blog-panel-tags" aria-label="Topics">
                      {(post.metadata.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
                    </span>
                  </div>
                </div>
              }
              descriptionPosition="bottom"
              href={`/blog/${post.slug}`}
              newTab={false}
            />
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <p>No posts match that search yet.</p>
          <button type="button" onClick={() => { setQuery(''); setActiveTag('All') }}>Clear filters</button>
        </div>
      )}
    </>
  )
}
