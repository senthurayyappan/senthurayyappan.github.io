'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('[data-article-body]')
      if (!article) return

      const rect = article.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      const travelled = Math.min(Math.max(-rect.top, 0), Math.max(distance, 0))
      setProgress(distance > 0 ? (travelled / distance) * 100 : 100)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="reading-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  )
}
