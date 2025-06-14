import { Redis } from '@upstash/redis'

const UPSTASH_REST_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://arriving-tadpole-30279.upstash.io'
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'AXZHAAIjcDEyZWI5MGE5M2I1Y2Q0NTEwODUxZDcxMzk5YmRjYWZjM3AxMA'

// Initialize Redis client
const redis = new Redis({
  url: UPSTASH_REST_URL,
  token: UPSTASH_TOKEN,
})

export async function getLikes(slug: string): Promise<number> {
  return await redis.get<number>(`likes:${slug}`) || 0
}

export async function incrementLikes(slug: string): Promise<number> {
  return await redis.incr(`likes:${slug}`)
}

// For static generation
export async function getAllLikes() {
  const posts = await redis.keys('likes:*')
  const likes: Record<string, number> = {}
  
  for (const post of posts) {
    const slug = post.replace('likes:', '')
    likes[slug] = await getLikes(slug)
  }
  
  return likes
} 