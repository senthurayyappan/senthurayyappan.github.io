import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { getBlogPosts } from '@/app/blog/utils'

const UPSTASH_REST_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://arriving-tadpole-30279.upstash.io'
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'AXZHAAIjcDEyZWI5MGE5M2I1Y2Q0NTEwODUxZDcxMzk5YmRjYWZjM3AxMA'

// Initialize Redis client
const redis = new Redis({
  url: UPSTASH_REST_URL,
  token: UPSTASH_TOKEN,
})

// Create a new ratelimiter that allows 2 requests per 24 hours
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '24 h'),
  analytics: true,
})

// Helper function to get client IP
function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]
  }
  return 'unknown'
}

// Helper function to handle errors
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const cookieStore = cookies()
    const hasLiked = cookieStore.get(`liked_${params.slug}`)?.value === 'true'
    
    // Get likes from Redis
    const likes = await redis.get<number>(`likes:${params.slug}`) || 0
    console.log('GET - Redis likes:', likes)
    
    return NextResponse.json({
      likes,
      hasLiked,
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return errorResponse('Failed to fetch likes', 500)
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Get client IP for rate limiting
    const ip = getClientIp(request)
    console.log('Client IP:', ip)
    
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `${ip}:${params.slug}`
    )
    console.log('Rate limit check:', { success, limit, reset, remaining })

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          limit,
          reset,
          remaining,
        },
        { status: 429 }
      )
    }

    const cookieStore = cookies()
    const hasLiked = cookieStore.get(`liked_${params.slug}`)?.value === 'true'
    console.log('Has liked:', hasLiked)

    if (hasLiked) {
      const currentLikes = await redis.get<number>(`likes:${params.slug}`) || 0
      console.log('Already liked, current likes:', currentLikes)
      return NextResponse.json({
        likes: currentLikes,
        hasLiked: true,
      })
    }

    // Get current likes first
    const currentLikes = await redis.get<number>(`likes:${params.slug}`) || 0
    console.log('Current likes before increment:', currentLikes)

    // Increment likes using Redis
    const newLikes = await redis.incr(`likes:${params.slug}`)
    console.log('New likes after increment:', newLikes)
    
    // Set cookie to prevent multiple likes
    cookieStore.set(`liked_${params.slug}`, 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return NextResponse.json({
      likes: newLikes,
      hasLiked: true,
    })
  } catch (error) {
    console.error('Error processing like:', error)
    return errorResponse('Failed to process like', 500)
  }
} 