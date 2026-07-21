import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'
import Image from 'next/image'
import ComicPanel from './ComicPanel'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return allBlogs.map((post) => (
    <ComicPanel
      key={post.slug}
      className={post.metadata.className}
      imageSrc={post.metadata.image}
      imagePosition={post.metadata.imagePosition || 'center center'}
      title={post.metadata.title}
      titlePosition="top-right"
      description={post.metadata.summary}
      descriptionPosition="bottom"
      href={`/blog/${post.slug}`}
      newTab={false}
    >
    </ComicPanel>
  ))
}
