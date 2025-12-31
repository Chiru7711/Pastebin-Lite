import { kv } from '@vercel/kv'
import { Paste } from './utils'

// In-memory fallback for local development
const memoryStore = new Map<string, any>()

const useKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN

export async function storePaste(id: string, paste: Paste): Promise<void> {
  if (useKV) {
    await kv.set(`paste:${id}`, paste)
  } else {
    memoryStore.set(`paste:${id}`, paste)
  }
}

export async function getPaste(id: string): Promise<Paste | null> {
  if (useKV) {
    return await kv.get(`paste:${id}`)
  } else {
    return memoryStore.get(`paste:${id}`) || null
  }
}

export async function incrementViews(id: string): Promise<number> {
  const paste = await getPaste(id)
  if (!paste) return 0
  
  paste.views = paste.views + 1
  await storePaste(id, paste)
  return paste.views
}

export async function healthCheck(): Promise<boolean> {
  if (useKV) {
    try {
      await kv.ping()
      return true
    } catch {
      return false
    }
  } else {
    return true
  }
}