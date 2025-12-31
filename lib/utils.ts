import { NextRequest } from 'next/server'

export interface Paste {
  content: string
  expires_at: number | null
  max_views: number | null
  views: number
}

export function now(req?: NextRequest): number {
  if (process.env.TEST_MODE === "1" && req) {
    const testTime = req.headers.get("x-test-now-ms")
    if (testTime) {
      return Number(testTime)
    }
  }
  return Date.now()
}

export function calculateExpiresAt(ttlSeconds?: number, currentTime?: number): number | null {
  if (!ttlSeconds) return null
  const baseTime = currentTime || Date.now()
  return baseTime + (ttlSeconds * 1000)
}