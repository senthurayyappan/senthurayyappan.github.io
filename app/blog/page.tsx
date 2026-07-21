import { BlogExplorer } from '@/components/BlogExplorer'
import { formatDate, getBlogPosts } from './utils'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog posts.',
}

export default function Page() {
  const posts = getBlogPosts()
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .map(({ slug, metadata }) => ({ slug, metadata, formattedDate: formatDate(metadata.publishedAt) }))

  return (
    <main className="blog-index py-4">
      <BlogExplorer posts={posts} />
    </main>
  )
}
