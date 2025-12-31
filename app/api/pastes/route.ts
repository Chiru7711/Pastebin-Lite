import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { storePaste } from '@/lib/db'
import { calculateExpiresAt, now } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate content
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Validate ttl_seconds
    if (body.ttl_seconds !== undefined) {
      if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
        return NextResponse.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
    
    // Validate max_views
    if (body.max_views !== undefined) {
      if (!Number.isInteger(body.max_views) || body.max_views < 1) {
        return NextResponse.json(
          { error: 'max_views must be an integer >= 1' },
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
    
    const id = nanoid(8)
    const currentTime = now(req)
    
    const paste = {
      content: body.content,
      expires_at: calculateExpiresAt(body.ttl_seconds, currentTime),
      max_views: body.max_views || null,
      views: 0
    }
    
    try {
      await storePaste(id, paste)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const url = `${req.nextUrl.origin}/p/${id}`
    
    return NextResponse.json(
      { id, url },
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Invalid JSON or server error' },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}