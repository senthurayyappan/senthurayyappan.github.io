import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import ComicPanel from './ComicPanel'
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
          <ComicPanel
            key={post.slug}
            description={post.metadata.title}
            title={formatDate(post.metadata.publishedAt, false)}
            className='col-span-1 row-span-2'
            titlePosition='top-right'
            href={`/blog/${post.slug}`}/>

        ))}
    </div>
  )
}
