'use client'

import { useVisitorCount } from '@/lib/utils';

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="-translate-y-[2px]"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  const views = useVisitorCount();

  return (
    <footer className="mt-auto flex flex-row justify-between">
      <ul className="font-sm flex flex-row space-x-4">
        <li>
          <a
            className="flex items-center hover:var(--sa-white) dark:hover:var(--sa-black)"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <ArrowIcon />
            <p className="ml-2 h-7 sa-link">rss</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center hover:var(--sa-white) dark:hover:var(--sa-black)"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/senthurayyappan/senthurayyappan.github.io"
          >
            <ArrowIcon />
            <p className="ml-2 h-7 sa-link">source</p>
          </a>
        </li>
      </ul>
      <span className="text-sm font-semibold text-black bg-white border rounded-sm px-4 py-1" 
      style={{
        fontFamily: "Comic Neue",
        fontStyle: "italic"
      }}>
          {views !== null ? (
            <>
              Hello, <span className="text-[var(--sa-blue)]">{views}{getOrdinalSuffix(views)}</span> visitor!
            </>
          ) : '...'}
      </span>
      <p className="text-muted text-sm">
        © {new Date().getFullYear()} <span className="hidden sm:inline">Senthur Ayyappan</span><span className="sm:hidden">SA</span>
      </p>
    </footer>
  )
}

// Add a helper function for ordinal suffix
function getOrdinalSuffix(n: number): string {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
