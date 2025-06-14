import { NextApiRequest, NextApiResponse } from 'next'
import { getLikes, incrementLikes } from '@/lib/likes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' })
  }

  if (req.method === 'GET') {
    try {
      const likes = await getLikes(slug)
      return res.status(200).json({ likes })
    } catch (error) {
      console.error('Error fetching likes:', error)
      return res.status(500).json({ error: 'Failed to fetch likes' })
    }
  }

  if (req.method === 'POST') {
    try {
      const newLikes = await incrementLikes(slug)
      return res.status(200).json({ likes: newLikes })
    } catch (error) {
      console.error('Error processing like:', error)
      return res.status(500).json({ error: 'Failed to process like' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 