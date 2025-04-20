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
      className="rounded-md w-6 h-6 flex items-center justify-center"
      aria-label="Toggle Dark Mode"
      style={{ cursor: 'pointer' }}
    >
      {resolvedTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
} 