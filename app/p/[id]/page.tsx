import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getPaste, incrementViews } from '@/lib/db'
import { now } from '@/lib/utils'

export default async function PastePage({ params }: { params: { id: string } }) {
  const { id } = params
  const headersList = headers()
  
  // Create a mock request for the now() function
  const mockReq = {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as any
  
  const currentTime = now(mockReq)
  
  // Get paste
  const paste = await getPaste(id)
  
  // Check if paste exists
  if (!paste) {
    notFound()
  }
  
  // Check time expiry before incrementing views
  if (paste.expires_at !== null && currentTime > paste.expires_at) {
    notFound()
  }
  
  // Check if already at view limit before incrementing
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    notFound()
  }
  
  // Atomic view increment
  const newViews = await incrementViews(id)
  
  // Check if this view increment caused us to exceed the limit
  if (paste.max_views !== null && newViews > paste.max_views) {
    notFound()
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Paste</h1>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {paste.content}
      </pre>
    </div>
  )
}