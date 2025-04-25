import { BlogPosts } from '@/components/posts'

export const metadata = {
  title: 'Articles',
  description: 'Read my articles.',
}

export default function Page() {
  return (
    <section className='comic grid grid-cols-2 md:grid-cols-3 gap-2 grid-rows-[minmax(200px,1fr)_minmax(200px,1fr)_auto_auto]'>
      <BlogPosts />
    </section>
  )
}
