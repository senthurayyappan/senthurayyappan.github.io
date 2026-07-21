'use client'

import { useVisitorCount } from '@/lib/utils';
import { SketchArrow } from './SketchArrow';

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      fill="none"
    >
      {/* Eye outline */}
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" fill="none"/>
      {/* Iris (transparent) */}
      <circle cx="12" cy="12" r="3.5" fill="none"/>
      {/* Pupil */}
      <circle cx="12" cy="12" r="1.6" fill="#000"/>
      {/* Highlight */}
      <circle cx="13.2" cy="11" r="0.75" fill="#fff"/>
    </svg>
  );
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
            <SketchArrow direction="up-right" className="footer-sketch-arrow" />
            <p data-sketch-target className="ml-2 h-7 sa-link">rss</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center hover:var(--sa-white) dark:hover:var(--sa-black)"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/senthurayyappan/senthurayyappan.github.io"
          >
            <SketchArrow direction="up-right" className="footer-sketch-arrow" />
            <p data-sketch-target className="ml-2 h-7 sa-link">source</p>
          </a>
        </li>
      </ul>
      <span className="text-sm font-semibold flex flex-row text-[var(--accent)]">
          <EyeIcon />
          {views !== null ? (
              <span className="ml-1">{views}</span>
          ) : '000'}
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
