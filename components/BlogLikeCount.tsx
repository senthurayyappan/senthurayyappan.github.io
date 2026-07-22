'use client'

import { useEffect, useState } from 'react'
import { getLocalLiked, getVisitorId } from './likeStorage'

type LikeResponse = {
  likes: number
}

export function BlogLikeCount({ slug }: { slug: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_LIKES_API_URL?.replace(/\/$/, '')
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    setLikes(getLocalLiked(slug) ? 1 : 0)

    function handleLocalLikeChange(event: Event) {
      const detail = (event as CustomEvent<{ slug: string; liked: boolean }>).detail
      if (detail?.slug === slug) setLikes(detail.liked ? 1 : 0)
    }

    window.addEventListener('senthur-blog-like-change', handleLocalLikeChange)

    if (apiUrl) {
      const visitor = getVisitorId()
      fetch(`${apiUrl}/v1/posts/${encodeURIComponent(slug)}/likes?viewer=${encodeURIComponent(visitor)}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((data: LikeResponse) => setLikes(data.likes))
        .catch(() => setLikes(getLocalLiked(slug) ? 1 : 0))
    }

    return () => window.removeEventListener('senthur-blog-like-change', handleLocalLikeChange)
  }, [apiUrl, slug])

  return (
    <span className="blog-like-count" aria-label={`${likes} likes`}>
      <span aria-hidden="true">{'\u2665'}</span>
      <strong>{likes}</strong>
    </span>
  )
}
