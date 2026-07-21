import Link from 'next/link'
import Image, { type ImageProps } from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { slugifyHeading } from '@/app/blog/utils'

function CustomLink(props) {
  const href = props.href || ''

  if (href.startsWith('/')) {
    return <Link href={href} className="sa-link" {...props}>{props.children}</Link>
  }

  if (href.startsWith('#')) {
    return <a className="sa-link" {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" className="sa-link" {...props} />
}

type ArticleImageProps = Omit<ImageProps, 'width' | 'height'> & {
  width?: number
  height?: number
  caption?: string
}

function ArticleImage({ caption, alt, width = 1200, height = 760, ...props }: ArticleImageProps) {
  return (
    <figure className="article-figure">
      <Image alt={alt} width={width} height={height} sizes="(max-width: 767px) 92vw, 760px" {...props} />
      {(caption || alt) && <figcaption>{caption || alt}</figcaption>}
    </figure>
  )
}

type FloatImageProps = ArticleImageProps & {
  side?: 'left' | 'right'
  shape?: 'box' | 'circle' | 'soft'
}

function FloatImage({
  side = 'right',
  shape = 'soft',
  caption,
  alt,
  width = 480,
  height = 480,
  ...props
}: FloatImageProps) {
  return (
    <figure className={`article-float article-float--${side} article-float--${shape}`}>
      <Image alt={alt} width={width} height={height} sizes="(max-width: 767px) 92vw, 360px" {...props} />
      {(caption || alt) && <figcaption>{caption || alt}</figcaption>}
    </figure>
  )
}

function Callout({ title = 'Field note', tone = 'yellow', children }) {
  return (
    <aside className={`article-callout article-callout--${tone}`}>
      <span className="article-callout__label">{title}</span>
      <div>{children}</div>
    </aside>
  )
}

function Code({ children, ...props }) {
  const raw = String(children ?? '')
  return (
    <code
      className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm font-mono"
      dangerouslySetInnerHTML={{ __html: highlight(raw) }}
      {...props}
    />
  )
}

function Pre({ children, ...props }) {
  return (
    <div className="article-code-wrap">
      <div className="article-code-label" aria-hidden="true">code</div>
      <pre {...props}>{children}</pre>
    </div>
  )
}

function Blockquote({ children, ...props }) {
  return <blockquote className="sketch-rule-left" {...props}>{children}</blockquote>
}

function createHeading(level) {
  const Heading = ({ children }) => {
    const slug = slugifyHeading(String(children))
    return React.createElement(
      `h${level}`,
      { id: slug, className: `article-heading article-heading--${level}` },
      React.createElement('a', { href: `#${slug}`, className: 'article-heading-link', 'aria-label': `Link to ${children}` }, '#'),
      children,
    )
  }

  Heading.displayName = `Heading${level}`
  return Heading
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: ArticleImage,
  Figure: ArticleImage,
  FloatImage,
  Callout,
  a: CustomLink,
  code: Code,
  pre: Pre,
  blockquote: Blockquote,
  ul: (props) => <ul {...props} />,
  ol: (props) => <ol {...props} />,
  li: (props) => <li {...props} />,
  p: (props) => <p {...props} />,
  table: (props) => <div className="article-table-wrap"><table {...props} /></div>,
  hr: () => <hr className="sketch-hr" />,
}

export function CustomMDX(props) {
  return <MDXRemote {...props} components={components} />
}
