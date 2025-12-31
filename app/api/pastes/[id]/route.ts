import { NextRequest, NextResponse } from 'next/server'
import { getPaste, incrementViews } from '@/lib/db'
import { now } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const currentTime = now(req)
  
  // Get paste
  const paste = await getPaste(id)
  
  // Check if paste exists
  if (!paste) {
    return NextResponse.json(
      { error: 'Paste not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Check time expiry before incrementing views
  if (paste.expires_at !== null && currentTime > paste.expires_at) {
    return NextResponse.json(
      { error: 'Paste not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Check if already at view limit before incrementing
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json(
      { error: 'Paste not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Atomic view increment
  const newViews = await incrementViews(id)
  
  // Check if this view increment caused us to exceed the limit
  if (paste.max_views !== null && newViews > paste.max_views) {
    return NextResponse.json(
      { error: 'Paste not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Calculate remaining views
  const remainingViews = paste.max_views !== null 
    ? Math.max(0, paste.max_views - newViews)
    : null
  
  // Format expires_at
  const expiresAt = paste.expires_at 
    ? new Date(paste.expires_at).toISOString()
    : null
  
  return NextResponse.json(
    {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: expiresAt
    },
    { headers: { 'Content-Type': 'application/json' } }
  )
}