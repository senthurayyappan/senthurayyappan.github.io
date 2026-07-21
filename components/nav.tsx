'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './theme-switch'
import { SketchArrow } from './SketchArrow'
import { useState } from 'react';
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/publications', label: 'Publications' },
]

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.95 10.95 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.49v6.25zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </svg>
  )
}

function RssIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
      <path d="M5.5 17a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 10c6.08 0 11 4.92 11 11h-3.5c0-4.14-3.36-7.5-7.5-7.5V10zm0-7c10.49 0 19 8.51 19 19h-3.5C18.5 14.6 10.4 6.5 3 6.5V3z" />
    </svg>
  )
}

function NavList({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return (
    <ul className="sidenav-list">
      {navItems.map(({ href, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <li key={href}>
            <Link href={href} onClick={onClick} aria-current={active ? 'page' : undefined}>
              <span data-sketch-target>{label}</span>
              <SketchArrow className="sn-arrow" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function SocialRow() {
  return (
    <div className="sidenav-social" aria-label="Elsewhere">
      <a href="https://github.com/senthurayyappan" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
      <a href="https://www.linkedin.com/in/imsenthur/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
      <a href="mailto:senthur@umich.edu" aria-label="Email"><MailIcon /></a>
      <a href="/rss" aria-label="RSS"><RssIcon /></a>
      <ThemeSwitch />
    </div>
  )
}

export function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname() || '/';

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      <aside className="sidenav hidden md:block tracking-tight">
        <Link href="/" className="sidenav-mark" aria-label="Senthur Ayyappan - home" data-sketch="off">
          <Image src="/logo/640.png" alt="Senthur Ayyappan" width={220} height={120} priority />
        </Link>
        <nav aria-label="Sections"><NavList pathname={pathname} /></nav>
        <SocialRow />
      </aside>

      <div className="md:hidden mobile-masthead">
        <Link href="/" onClick={() => setSidebarOpen(false)} className="relative w-28 h-12 overflow-hidden" data-sketch="off">
          <Image src="/logo/400.png" alt="SA" fill style={{ objectFit: 'contain', objectPosition: 'left center' }} priority />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button onClick={toggleSidebar} aria-label="Toggle navigation" aria-expanded={isSidebarOpen} className="comic-menu-button">
            <span aria-hidden="true">{isSidebarOpen ? 'X' : '|||'}</span>
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-[rgba(21,19,13,.38)]" onClick={toggleSidebar} />
      )}
      <aside className={`mobile-drawer md:hidden ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="flex items-center justify-between">
          <Link href="/" onClick={() => setSidebarOpen(false)} className="relative w-28 h-12 overflow-hidden" data-sketch="off">
            <Image src="/logo/400.png" alt="SA" fill style={{ objectFit: 'contain', objectPosition: 'left center' }} />
          </Link>
          <button onClick={toggleSidebar} aria-label="Close navigation" className="comic-menu-button">X</button>
        </div>
        <nav aria-label="Mobile sections"><NavList pathname={pathname} onClick={toggleSidebar} /></nav>
        <SocialRow />
      </aside>
    </>
  )
}
