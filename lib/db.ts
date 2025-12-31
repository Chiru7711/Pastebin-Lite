import Redis from 'ioredis'
import { Paste } from './utils'

// In-memory fallback for local development
const memoryStore = new Map<string, any>()

const redisUrl = process.env.REDIS_URL
let redis: Redis | null = null

if (redisUrl) {
  redis = new Redis(redisUrl)
}

export async function storePaste(id: string, paste: Paste): Promise<void> {
  console.log('Storing paste:', id, 'useRedis:', !!redis)
  
  if (redis) {
    try {
      await redis.set(`paste:${id}`, JSON.stringify(paste))
      console.log('Successfully stored in Redis:', id)
    } catch (error) {
      console.error('Redis storage failed:', error)
      throw error
    }
  } else {
    console.log('Using memory storage for:', id)
    memoryStore.set(`paste:${id}`, paste)
  }
}

export async function getPaste(id: string): Promise<Paste | null> {
  console.log('Getting paste:', id, 'useRedis:', !!redis)
  
  if (redis) {
    try {
      const result = await redis.get(`paste:${id}`)
      if (result) {
        const paste = JSON.parse(result) as Paste
        console.log('Redis get result: found')
        return paste
      }
      console.log('Redis get result: not found')
      return null
    } catch (error) {
      console.error('Redis get failed:', error)
      return null
    }
  } else {
    const paste = memoryStore.get(`paste:${id}`)
    console.log('Memory get result:', paste ? 'found' : 'not found')
    return paste || null
  }
}

export async function incrementViews(id: string): Promise<number> {
  const paste = await getPaste(id)
  if (!paste) {
    console.log(`Paste ${id} not found for view increment`)
    return 0
  }
  
  paste.views = paste.views + 1
  await storePaste(id, paste)
  console.log(`Incremented views for ${id} to ${paste.views}`)
  return paste.views
}

export async function healthCheck(): Promise<boolean> {
  if (redis) {
    try {
      await redis.ping()
      return true
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  } else {
    return true
  }
}