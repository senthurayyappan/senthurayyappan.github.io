'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

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
      className="border flex items-center justify-center bg-white p-1"
      aria-label="Toggle Dark Mode"
      style={{ cursor: 'pointer' }}
    >
      {resolvedTheme === 'dark' ? (
        <Image src="/icons/sun.svg" alt="GitHub" width={24} height={24} />
      ) : (
        <Image src="/icons/moon.svg" alt="GitHub" width={24} height={24} />
      )}
    </button>
  )
} 