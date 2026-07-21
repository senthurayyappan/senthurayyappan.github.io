import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CustomMDX } from '@/components/mdx'
import { ReadingProgress } from '@/components/ReadingProgress'
import { SketchArrow } from '@/components/SketchArrow'
import { formatDate, getBlogPosts, getTableOfContents } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }) {
  const post = getBlogPosts().find((candidate) => candidate.slug === params.slug)
  if (!post) return

  const { title, publishedAt, summary, image, tags } = post.metadata
  const ogImage = image ? `${baseUrl}${image}` : `${baseUrl}/default.png`

  return {
    title,
    description: summary,
    keywords: tags,
    openGraph: {
      title,
      description: summary,
      type: 'article',
      publishedTime: publishedAt,
      url: `${baseUrl}/blog/${post.slug}`,
      tags,
      images: [{ url: ogImage }],
    },
    twitter: { card: 'summary_large_image', title, description: summary, images: [ogImage] },
  }
}

export default function Blog({ params }) {
  const posts = getBlogPosts().sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  )
  const postIndex = posts.findIndex((candidate) => candidate.slug === params.slug)
  const post = posts[postIndex]
  if (!post) notFound()

  const tableOfContents = getTableOfContents(post.content)
  const newerPost = postIndex > 0 ? posts[postIndex - 1] : null
  const olderPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null

  return (
    <article className="article-page">
      <ReadingProgress />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            keywords: post.metadata.tags?.join(', '),
            image: post.metadata.image ? `${baseUrl}${post.metadata.image}` : `${baseUrl}/default.png`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: { '@type': 'Person', name: 'Senthur Ayyappan' },
          }),
        }}
      />

      <header className="article-header">
        <h1>{post.metadata.title}</h1>
        <p className="article-dek">{post.metadata.summary}</p>
        <div className="article-meta-row">
          <div className="article-tags">
            {(post.metadata.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="article-meta-timing">
            <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.metadata.readingTime} min read</span>
          </div>
        </div>
      </header>

      {post.metadata.image && (
        <figure className="article-hero sketch-box">
          <Image
            src={post.metadata.image}
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 92vw, 900px"
            style={{ objectPosition: post.metadata.imagePosition || 'center' }}
          />
        </figure>
      )}

      <div className="article-layout">
        <div className="prose article-prose" data-article-body>
          <CustomMDX source={post.content} />
        </div>

        {tableOfContents.length > 0 && (
          <aside className="article-toc" aria-label="Table of contents">
            <p>In this post</p>
            <ol>
              {tableOfContents.map((item) => (
                <li key={item.slug} className={item.depth === 3 ? 'is-nested' : ''}>
                  <a href={`#${item.slug}`}>{item.title}</a>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>

      {(newerPost || olderPost) && (
        <nav className="article-pagination" aria-label="More posts">
          {olderPost ? (
            <div className="article-pagination-cell article-pagination__older">
              <Link href={`/blog/${olderPost.slug}`} className="article-pagination-card" data-sketch="off">
                <span><SketchArrow className="article-pagination-arrow article-pagination-arrow--back" /> Older post</span>
                <strong>{olderPost.metadata.title}</strong>
              </Link>
            </div>
          ) : null}
          {newerPost && (
            <div className="article-pagination-cell article-pagination__newer">
              <Link href={`/blog/${newerPost.slug}`} className="article-pagination-card" data-sketch="off">
                <span>Newer post <SketchArrow className="article-pagination-arrow" /></span>
                <strong>{newerPost.metadata.title}</strong>
              </Link>
            </div>
          )}
        </nav>
      )}
    </article>
  )
}
