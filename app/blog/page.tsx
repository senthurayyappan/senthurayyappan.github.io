import { BlogPosts } from '@/components/posts'

export const metadata = {
  title: 'Blog',
  description: 'Dev blogs, robotics notes, and assorted thoughts.',
}

export default function Page() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-6 md:py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--accent)]">
          Blog
        </h1>
        <p className="mt-2 text-base opacity-75 max-w-2xl">
          Dev blogs, robotics notes, and assorted thoughts I needed to write
          down.
        </p>
      </header>
      <BlogPosts />
    </section>
  )
}
