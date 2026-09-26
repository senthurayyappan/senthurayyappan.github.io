export const visitorKey = 'senthur-blog-like-visitor'
const localLikePrefix = 'senthur-blog-like-local:'

export function engagementApiUrl() {
  const url = process.env.NEXT_PUBLIC_LIKES_API_URL
  return url ? url.replace(/\/$/, '') : undefined
}

export function postEngagementUrl(apiUrl: string, slug: string, resource: 'likes' | 'views') {
  return `${apiUrl}/v1/posts/${encodeURIComponent(slug)}/${resource}`
}

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
  const response = await fetch(postEngagementUrl(apiUrl, slug, 'views'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitor: getVisitorId() }),
  })
  if (!response.ok) throw new Error('Unable to record view')
  return response.json()
}
