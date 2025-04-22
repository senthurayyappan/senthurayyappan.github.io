'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="rounded-md w-6 h-6" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
      aria-label="Toggle Dark Mode"
      style={{ cursor: 'pointer' }}
    >
      {resolvedTheme === 'dark' ? (
        <img src="/icons/dark-mode.png" alt="Dark Mode Icon" /> 
      ) : (
        <img src="/icons/light-mode.png" alt="Light Mode Icon" />
      )}
    </button>
  )
} 