import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

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
    <div className="my-8">
      <Image
        alt={props.alt}
        className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" 
        {...props} 
      />
      {props.alt && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 text-center">
          {props.alt}
        </p>
      )}
    </div>
  )
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return (
    <code 
      className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm font-mono" 
      dangerouslySetInnerHTML={{ __html: codeHTML }} 
      {...props} 
    />
  )
}

function Pre({ children, ...props }) {
  return (
    <pre className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-x-auto my-8" {...props}>
      {children}
    </pre>
  )
}

function Blockquote({ children, ...props }) {
  return (
    <blockquote 
      className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 py-2 my-6 italic text-neutral-700 dark:text-neutral-300" 
      {...props}
    >
      {children}
    </blockquote>
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
        className: `group relative scroll-mt-20 ${
          level === 1 ? 'text-4xl font-bold mt-8 mb-4' :
          level === 2 ? 'text-3xl font-semibold mt-8 mb-4' :
          level === 3 ? 'text-2xl font-medium mt-6 mb-3' :
          level === 4 ? 'text-xl font-medium mt-6 mb-3' :
          'text-lg font-medium mt-4 mb-2'
        }`
      },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor opacity-0 group-hover:opacity-100 transition-opacity duration-200',
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
  pre: Pre,
  blockquote: Blockquote,
  ul: (props) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
  li: (props) => <li className="my-1" {...props} />,
  p: (props) => <p className="my-4 leading-7" {...props} />,
  hr: () => <hr className="my-8 border-neutral-200 dark:border-neutral-700" />,
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={components}
    />
  )
}
