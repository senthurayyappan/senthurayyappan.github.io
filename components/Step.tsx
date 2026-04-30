import React from 'react'

interface StepProps {
  n: number
  of?: number
  title: string
  children?: React.ReactNode
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export default function Step({ n, of, title, children }: StepProps) {
  const slug = `step-${n}-${slugify(title)}`
  return (
    <section id={slug} className="step scroll-mt-24">
      <header className="step-header">
        <span className="step-num">
          {String(n).padStart(2, '0')}
          {of && (
            <span className="step-of"> / {String(of).padStart(2, '0')}</span>
          )}
        </span>
        <h2 className="step-title">{title}</h2>
      </header>
      <div className="step-body">{children}</div>
    </section>
  )
}
