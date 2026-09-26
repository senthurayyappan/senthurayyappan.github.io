import { getBlogPosts } from 'app/blog/utils'

export const baseUrl = 'https://senthurayyappan.com'

const staticRoutes = ['', '/about', '/projects', '/blog', '/publications', '/stats']

export default async function sitemap() {
  const pages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const posts = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  return [...pages, ...posts]
}
