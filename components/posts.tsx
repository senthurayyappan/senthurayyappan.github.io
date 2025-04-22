import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <div key={post.slug} className="flex flex-col space-y-1 mb-4">
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="tracking-tight font-semibold sa-link accent"
              >
                {post.metadata.title}
              </Link>
            </div>
          </div>
        ))}
    </div>
  )
}
