import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './theme-switch'

const navItems = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
  'https://github.com/senthurayyappan': {
    name: 'github',
  },
}

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0">
            {Object.entries(navItems).map(([path, { name }]) => {
              if (path === '/') return null;
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center py-1 px-2 m-1"
                  target="_blank"
                >
                  {name}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Portfolio Logo"
                width={75}
                height={75}
                priority
              />
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  )
}
