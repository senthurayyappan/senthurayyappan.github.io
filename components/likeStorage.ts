export const visitorKey = 'senthur-blog-like-visitor'
const localLikePrefix = 'senthur-blog-like-local:'

export type PostEngagementResponse = {
  likes: number
  liked: boolean
  views?: number
}

export function getVisitorId() {
  let visitorId = window.localStorage.getItem(visitorKey)
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    window.localStorage.setItem(visitorKey, visitorId)
  }
  return visitorId
}

export function getLocalLiked(slug: string) {
  return window.localStorage.getItem(`${localLikePrefix}${slug}`) === 'true'
}

export function setLocalLiked(slug: string, liked: boolean) {
  window.localStorage.setItem(`${localLikePrefix}${slug}`, String(liked))
  window.dispatchEvent(new CustomEvent('senthur-blog-like-change', { detail: { slug, liked } }))
}

export async function recordPostView(apiUrl: string, slug: string): Promise<PostEngagementResponse> {
  const response = await fetch(`${apiUrl}/v1/posts/${encodeURIComponent(slug)}/views`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitor: getVisitorId() }),
  })
  if (!response.ok) throw new Error('Unable to record view')
  return response.json()
}
