import { NextResponse } from 'next/server'
import { healthCheck } from '@/lib/db'

export async function GET() {
  const isHealthy = await healthCheck()
  
  return NextResponse.json(
    { ok: isHealthy },
    { 
      status: isHealthy ? 200 : 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}