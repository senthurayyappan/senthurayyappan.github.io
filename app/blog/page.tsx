import { BlogPosts } from '@/components/posts'

export const metadata = {
  title: 'Articles',
  description: 'Read my articles.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Articles</h1>
      <BlogPosts />
    </section>
  )
}
