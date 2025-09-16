import { BlogPosts } from '@/components/posts'
import ComicPanel from '@/components/ComicPanel'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog posts.',
}

export default function Page() {
  return (
    <section className="py-4 comic grid grid-cols-2 md:grid-cols-3 gap-2 grid-rows-[minmax(200px,1fr)_minmax(200px,1fr)_auto_auto]">
      <BlogPosts />
    </section>
  )
}
