import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import CodeBlock from './CodeBlock'
import Callout from './Callout'
import Step from './Step'

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} className="sa-link" {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a className="sa-link" {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" className="sa-link" {...props} />
}

function RoundedImage(props) {
  return (
    <figure className="my-8">
      <Image
        alt={props.alt}
        className="block w-full h-auto"
        {...props}
      />
      {props.alt && <figcaption>{props.alt}</figcaption>}
    </figure>
  )
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return (
    <code
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
  )
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      {
        id: slug,
        className: 'group relative scroll-mt-24',
      },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className:
            'anchor opacity-0 group-hover:opacity-100 transition-opacity duration-200',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  CodeBlock,
  Callout,
  Step,
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={components}
    />
  )
}
