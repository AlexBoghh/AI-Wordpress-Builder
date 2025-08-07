import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const checks = {
      gemini_api_configured: !!process.env.GEMINI_API_KEY,
      database_url_configured: !!process.env.DATABASE_URL,
      node_env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      status: 'ok',
      checks
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}