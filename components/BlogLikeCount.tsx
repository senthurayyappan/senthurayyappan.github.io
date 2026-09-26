'use client'

import { useEffect, useState } from 'react'
import { EyeIcon } from './EyeIcon'
import { engagementApiUrl, getLocalLiked, getVisitorId, postEngagementUrl } from './likeStorage'

type LikeResponse = {
  likes: number
  views?: number
}

export function BlogLikeCount({ slug }: { slug: string }) {
  const apiUrl = engagementApiUrl()
  const [likes, setLikes] = useState(0)
  const [views, setViews] = useState(0)

  useEffect(() => {
    setLikes(getLocalLiked(slug) ? 1 : 0)

    function handleLocalLikeChange(event: Event) {
      const detail = (event as CustomEvent<{ slug: string; liked: boolean }>).detail
      if (detail?.slug === slug) setLikes(detail.liked ? 1 : 0)
    }

    window.addEventListener('senthur-blog-like-change', handleLocalLikeChange)

    if (apiUrl) {
      const visitor = getVisitorId()
      fetch(`${postEngagementUrl(apiUrl, slug, 'likes')}?viewer=${encodeURIComponent(visitor)}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((data: LikeResponse) => {
          setLikes(data.likes)
          setViews(data.views ?? 0)
        })
        .catch(() => setLikes(getLocalLiked(slug) ? 1 : 0))
    }

    return () => window.removeEventListener('senthur-blog-like-change', handleLocalLikeChange)
  }, [apiUrl, slug])

  return (
    <span className="blog-engagement-counts">
      <span className="blog-view-count" aria-label={`${views} views`}>
        <EyeIcon className="engagement-eye-icon" />
        <strong>{views}</strong>
      </span>
      <span className="blog-like-count" aria-label={`${likes} likes`}>
        <span aria-hidden="true">{'\u2665'}</span>
        <strong>{likes}</strong>
      </span>
    </span>
  )
}
