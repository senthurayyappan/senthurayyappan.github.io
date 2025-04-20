'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './theme-switch'
import { useState } from 'react';

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <aside className="-ml-[8px] mb-4 tracking-tight">
      <div className="lg:sticky lg:top-20">
        {/* --- Main Nav for Medium and Up --- */}
        <nav
          className="hidden md:flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav-large"
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={() => setSidebarOpen(false)}>
              {/* Responsive Logo */}
              <Image
                src="/logo/160.png"
                alt="SA"
                width={160} // Base width (used for aspect ratio)
                height={160} // Base height (used for aspect ratio)
                className="w-32 h-32 lg:w-40 lg:h-40 object-contain" // Responsive classes
                priority
              />
            </Link>
          </div>
          {/* Nav Links */}
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
          {/* Theme Switch */}
          <div className="flex flex-row items-center space-x-0">
            <ThemeSwitch />
          </div>
        </nav>

        {/* --- Mobile Nav Trigger --- */}
        <div className="md:hidden flex items-center justify-between px-4 py-2">
          {/* Logo (smaller for mobile header) */}
          <Link href="/" onClick={() => setSidebarOpen(false)} className="flex-shrink-0">
            <Image
              src="/logo/160.png"
              alt="SA"
              width={100} // Smaller base for mobile header
              height={100}
              className="w-16 h-16 object-contain" // Small fixed size for header
              priority
            />
          </Link>
          {/* Right side controls: Theme Toggle + Hamburger */}
          <div className="flex items-center space-x-2">
            <ThemeSwitch />
            {/* Hamburger Button */}
            <button
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
            >
              {/* Simple Hamburger Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* --- Sidebar (Mobile) --- */}
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 sidebar z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar Container */}
        <div
          className={`fixed top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
            {/* Sidebar Logo */}
             <Link href="/" onClick={() => setSidebarOpen(false)}>
              <Image
                src="/logo/160.png"
                alt="SA"
                width={100}
                height={100}
                className="w-16 h-16 object-contain"
                priority
              />
            </Link>
            {/* Close Button */}
            <button
              onClick={toggleSidebar}
              aria-label="Close navigation"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
            >
              {/* Simple Close Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Sidebar Nav Links */}
          <nav className="flex flex-col p-4 space-y-2">
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                onClick={toggleSidebar} // Close sidebar on link click
                className="transition-all block py-2 px-3 rounded sa-link"
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
