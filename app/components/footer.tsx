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
      <p className="text-muted text-sm">
        © {new Date().getFullYear()} <span className="hidden sm:inline">Senthur Ayyappan</span><span className="sm:hidden">SA</span>
      </p>
    </footer>
  )
}
