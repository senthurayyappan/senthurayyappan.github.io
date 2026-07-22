'use client'

import { useEffect, useState } from 'react'
import { getLocalLiked, getVisitorId, setLocalLiked } from './likeStorage'

type LikeResponse = {
  likes: number
  liked: boolean
}

export function ArticleLikeButton({ slug }: { slug: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_LIKES_API_URL?.replace(/\/$/, '')
  const [likes, setLikes] = useState<number | null>(null)
  const [liked, setLiked] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasRemoteState, setHasRemoteState] = useState(false)

  useEffect(() => {
    if (!apiUrl) return

    const visitor = getVisitorId()
    const localLiked = getLocalLiked(slug)
    setLiked(localLiked)
    setLikes(localLiked ? 1 : 0)

    fetch(`${apiUrl}/v1/posts/${encodeURIComponent(slug)}/likes?viewer=${encodeURIComponent(visitor)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: LikeResponse) => {
        setHasRemoteState(true)
        setLikes(data.likes)
        setLiked(data.liked)
      })
      .catch(() => setHasRemoteState(false))
  }, [apiUrl, slug])

  if (!apiUrl) return null

  async function toggleLike() {
    if (isSaving) return

    setIsSaving(true)
    const nextLiked = !liked
    const priorLikes = likes
    setLiked(nextLiked)
    setLikes((count) => Math.max(0, (count ?? 0) + (nextLiked ? 1 : -1)))
    setLocalLiked(slug, nextLiked)

    try {
      const response = await fetch(`${apiUrl}/v1/posts/${encodeURIComponent(slug)}/likes`, {
        method: nextLiked ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor: getVisitorId() }),
      })
      if (!response.ok) throw new Error('Unable to save like')
      const data: LikeResponse = await response.json()
      setLikes(data.likes)
      setLiked(data.liked)
      setHasRemoteState(true)
    } catch {
      if (hasRemoteState) {
        setLiked(!nextLiked)
        setLikes(priorLikes)
        setLocalLiked(slug, !nextLiked)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <span className="article-like-cell">
      <button
        className={`article-like-button${liked ? ' is-liked' : ''}`}
        type="button"
        aria-pressed={liked}
        aria-label={liked ? 'Remove your like' : 'Like this post'}
        onClick={toggleLike}
        disabled={isSaving}
      >
        <span className="article-like-button__face" aria-hidden="true" />
        <span className="article-like-button__icon" aria-hidden="true">{liked ? '\u2665' : '\u2661'}</span>
        <span>{liked ? 'Liked' : 'Like this post'}</span>
        {likes !== null && <strong>{likes}</strong>}
      </button>
    </span>
  )
}
