export const visitorKey = 'senthur-blog-like-visitor'
const localLikePrefix = 'senthur-blog-like-local:'

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
