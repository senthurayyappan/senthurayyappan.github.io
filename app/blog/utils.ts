import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Metadata = {
  title: string
  publishedAt: string
  summary: string
  className?: string
  image?: string
  imagePosition?: string
  readingTime?: number
  tags?: string[]
}

export type BlogPost = {
  metadata: Metadata
  slug: string
  content: string
}

export type TableOfContentsItem = {
  depth: 2 | 3
  title: string
  slug: string
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  return undefined
}

function asTags(value: unknown): string[] | undefined {
  const raw = Array.isArray(value)
    ? value.map(String)
    : typeof value === 'string'
      ? value.split(',')
      : []
  const tags = raw.map((tag) => tag.trim()).filter(Boolean)
  return tags.length > 0 ? tags : undefined
}

function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent)
  const body = content.trim()

  return {
    metadata: {
      title: asString(data.title) ?? '',
      publishedAt: asString(data.publishedAt) ?? '',
      summary: asString(data.summary) ?? '',
      className: asString(data.className),
      image: asString(data.image),
      imagePosition: asString(data.imagePosition),
      tags: asTags(data.tags),
      readingTime: calculateReadingTime(body),
    },
    content: body,
  }
}

function getMDXFiles(dir: string) {
  return fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === '.mdx' && file !== 'template.mdx')
}

function readMDXFile(filePath: string) {
  return parseFrontmatter(fs.readFileSync(filePath, 'utf-8'))
}

function getMDXData(dir: string): BlogPost[] {
  return getMDXFiles(dir).map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    return {
      metadata,
      slug: path.basename(file, path.extname(file)),
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function getTableOfContents(content: string): TableOfContentsItem[] {
  return Array.from(content.matchAll(/^(##|###)\s+(.+)$/gm)).map((match) => ({
    depth: match[1].length as 2 | 3,
    title: match[2].replace(/[`*_]/g, '').trim(),
    slug: slugifyHeading(match[2].replace(/[`*_]/g, '').trim()),
  }))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}
