import { BlogPosts } from '@/components/posts'

export const metadata = {
  title: 'Blog',
  description: 'Dev blogs, robotics notes, and assorted thoughts.',
}

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-6 md:py-10">
      <header className="mb-12">
        <h1
          className="font-medium tracking-tight text-[var(--text)] leading-[0.95]"
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'clamp(3rem, 2rem + 4vw, 5rem)',
          }}
        >
          Blog<span className="text-[var(--accent)]">.</span>
        </h1>
      </header>
      <BlogPosts />
    </section>
  )
}
