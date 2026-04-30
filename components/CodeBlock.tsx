import { highlight } from 'sugar-high'
import CopyButton from './CopyButton'

interface CodeBlockProps {
  children: string
  filename?: string
  language?: string
  source?: string
  lines?: string
}

function buildSourceHref(source: string, lines?: string): string {
  if (!lines) return source
  const range = lines.includes('-')
    ? `L${lines.replace('-', '-L')}`
    : `L${lines}`
  return `${source}#${range}`
}

export default function CodeBlock({
  children,
  filename,
  language,
  source,
  lines,
}: CodeBlockProps) {
  const raw = String(children).replace(/^\n+|\n+$/g, '')
  const codeHTML = highlight(raw)
  const sourceHref = source ? buildSourceHref(source, lines) : undefined
  const langLabel = language || (filename ? filename.split('.').pop() : null)

  return (
    <figure className="code-block">
      {(filename || sourceHref) && (
        <header className="code-block-header">
          <span className="code-block-filename">
            {filename ?? langLabel ?? 'Code'}
          </span>
          <div className="code-block-actions">
            {sourceHref && (
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="code-block-action"
              >
                View on GitHub
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            )}
            <CopyButton text={raw} />
          </div>
        </header>
      )}
      <pre className="code-block-pre">
        <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
      </pre>
    </figure>
  )
}
