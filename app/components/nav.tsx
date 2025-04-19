import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './theme-switch'

const navItems = {
  '/': {
    name: 'home',
    shortName: 'h',
  },
  '/blog': {
    name: 'articles',
    shortName: 'b',
  },
  '/projects': {
    name: 'projects',
    shortName: 'pr',
  },
  '/publications': {
    name: 'publications',
    shortName: `pu`
  },
  '/tutorials': {
    name: 'tutorials',
    shortName: 't',
  },
  '/gallery': {
    name: 'gallery',
    shortName: 'g',
  },
}

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-4 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex items-center space-x-4 hidden sm:block">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="SA"
                width={128}
                height={128}
                priority
              />
            </Link>
          </div>
          <div className="flex flex-row items-center space-x-0 gap-4">
            {Object.entries(navItems).map(([path, { name, shortName }]) => {
              if (path === '/') return null;
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center py-1 px-2 m-1 sa-link"
                >
                  <span className="hidden sm:inline">{name}</span>
                  <span className="sm:hidden font-semibold">{shortName}</span>
                </Link>
              )
            })}
          </div>
          <div className="flex flex-row items-center space-x-0">
            <ThemeSwitch />
          </div>
        </nav>
      </div>
    </aside>
  )
}
