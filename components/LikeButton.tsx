'use client'

import { useLikeCount } from '@/lib/utils'
import { useState } from 'react'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 transition-colors duration-200 ${
        filled ? 'fill-[var(--accent)]' : 'fill-none'
      }`}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function LikeButton({ slug }: { slug: string }) {
  const { likes, hasLiked, incrementLike } = useLikeCount(slug)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (hasLiked || isLoading) return

    setIsLoading(true)

    try {
      await incrementLike()
    } catch {
      // Silently handle any errors
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isLoading}
      className={`flex items-center space-x-1 px-3 py-1 border-2 transition-colors duration-200 ${
        hasLiked
          ? 'bg-[var(--accent)]/10'
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label="Like this post"
    >
      <HeartIcon filled={hasLiked} />
      <span className="text-sm font-medium min-w-[1.5rem] text-center">
        {likes === null ? '...' : likes}
      </span>
    </button>
  )
} 