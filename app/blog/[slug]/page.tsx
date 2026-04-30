import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import PostHeader from '@/components/PostHeader'
import PostFigure from '@/components/PostFigure'
import PostFooter from '@/components/PostFooter'

const REPO_URL = 'https://github.com/senthurayyappan/senthurayyappan.github.io'

function getOrderedPosts() {
  return getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  )
}

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
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
      images: [{ url: ogImage }],
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
  const posts = getOrderedPosts()
  const idx = posts.findIndex((p) => p.slug === params.slug)
  if (idx === -1) {
    notFound()
  }

  const post = posts[idx]
  // Posts are sorted newest-first: the older neighbor (prev in time) sits at idx+1.
  const prev = posts[idx + 1]
  const next = posts[idx - 1]

  return (
    <article className="w-full py-8 md:py-12">
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

      <div className="mx-auto max-w-[640px] px-4 sm:px-6">
        <PostHeader metadata={post.metadata} />

        {post.metadata.image && (
          <PostFigure
            src={post.metadata.image}
            alt={post.metadata.title}
            position={post.metadata.imagePosition}
          />
        )}

        <div className="prose dark:prose-invert">
          <CustomMDX source={post.content} />
        </div>

        <PostFooter
          slug={post.slug}
          prev={prev}
          next={next}
          repoUrl={REPO_URL}
        />
      </div>
    </article>
  )
}
