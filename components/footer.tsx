import { SketchArrow } from './SketchArrow';

export default function Footer() {
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
            <p className="ml-2 h-7 sa-link sa-mark" data-sa-mark="underline" data-sa-trigger="interaction">rss</p>
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
            <p className="ml-2 h-7 sa-link sa-mark" data-sa-mark="underline" data-sa-trigger="interaction">source</p>
          </a>
        </li>
      </ul>
      <p className="footer-handwriting text-muted text-sm">
        © {new Date().getFullYear()} <span className="hidden sm:inline">Senthur Ayyappan</span><span className="sm:hidden">SA</span>
      </p>
    </footer>
  )
}
