import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import ComicPanel from './ComicPanel'
export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <>
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
          <ComicPanel
            key={post.slug}
            description={post.metadata.title}
            title={formatDate(post.metadata.publishedAt, false)}
            imageSrc={post.metadata.image}
            imagePosition={post.metadata.imagePosition}
            className={post.metadata.className}
            titlePosition='top-right'
            href={`/blog/${post.slug}`}
            newTab={false}
          />

        ))}
    </>
  )
}
