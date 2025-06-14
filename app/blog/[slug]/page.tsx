import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import Image from 'next/image'
import ComicPanel from '@/components/ComicPanel'
import LikeButton from '@/components/LikeButton'

export async function generateStaticParams() {
  let posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  
  let ogImage = image ? `${baseUrl}${image}` : `${baseUrl}/default.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-none py-4">
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
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/default.png`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Senthur Ayyappan',
            },
          }),
        }}
      />      
      {/* Featured Image */}
      {post.metadata.image && (
        <ComicPanel
          className="mb-8"
          imageSrc={post.metadata.image}
          imagePosition={post.metadata.imagePosition || 'center center'}
          description={`${formatDate(post.metadata.publishedAt)} · ${post.metadata.readingTime} min read`}
        />
      )}

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight m-0">
            {post.metadata.title}
          </h1>
          <div className="flex-shrink-0">
            <LikeButton slug={post.slug} />
          </div>
        </div>
        <CustomMDX source={post.content} />
      </div>
    </article>
  )
}
