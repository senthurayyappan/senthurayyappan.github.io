import { BlogPosts } from '@/components/posts'

export const metadata = {
  title: 'Articles',
  description: 'Read my articles.',
}

export default function Page() {
  return (
    <section>
      <BlogPosts />
    </section>
  )
}
