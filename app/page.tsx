'use client'

import { useState } from 'react'

export default function Home() {
  const [content, setContent] = useState('')
  const [ttlSeconds, setTtlSeconds] = useState('')
  const [maxViews, setMaxViews] = useState('')
  const [result, setResult] = useState<{ id: string; url: string } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const body: any = { content }
      
      if (ttlSeconds) {
        body.ttl_seconds = parseInt(ttlSeconds)
      }
      
      if (maxViews) {
        body.max_views = parseInt(maxViews)
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create paste')
        return
      }

      setResult(data)
      setContent('')
      setTtlSeconds('')
      setMaxViews('')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Pastebin Lite</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontFamily: 'monospace',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="Enter your text here..."
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="ttl" style={{ display: 'block', marginBottom: '5px' }}>
              TTL (seconds)
            </label>
            <input
              id="ttl"
              type="number"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              min="1"
              style={{ 
                width: '100%', 
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="Optional"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="maxViews" style={{ display: 'block', marginBottom: '5px' }}>
              Max Views
            </label>
            <input
              id="maxViews"
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              min="1"
              style={{ 
                width: '100%', 
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="Optional"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: loading || !content.trim() ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !content.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>

      {error && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#d4edda', 
          color: '#155724',
          borderRadius: '4px'
        }}>
          <h3>Paste Created!</h3>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
        </div>
      )}
    </div>
  )
}