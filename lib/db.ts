import { kv } from '@vercel/kv'
import { Paste } from './utils'

// In-memory fallback for local development
const memoryStore = new Map<string, any>()

const useKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN

export async function storePaste(id: string, paste: Paste): Promise<void> {
  console.log('Storing paste:', id, 'useKV:', useKV)
  
  if (useKV) {
    try {
      await kv.set(`paste:${id}`, paste)
      console.log('Successfully stored in KV:', id)
    } catch (error) {
      console.error('KV storage failed:', error)
      throw error
    }
  } else {
    console.log('Using memory storage for:', id)
    memoryStore.set(`paste:${id}`, paste)
  }
}

export async function getPaste(id: string): Promise<Paste | null> {
  console.log('Getting paste:', id, 'useKV:', useKV)
  
  if (useKV) {
    try {
      const result: Paste | null = await kv.get(`paste:${id}`)
      console.log('KV get result:', result ? 'found' : 'not found')
      return result
    } catch (error) {
      console.error('KV get failed:', error)
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
  if (useKV) {
    try {
      await kv.ping()
      return true
    } catch (error) {
      console.error('KV health check failed:', error)
      return false
    }
  } else {
    return true
  }
}