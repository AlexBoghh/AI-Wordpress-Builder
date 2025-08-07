import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    keyLength: process.env.GEMINI_API_KEY?.length || 0,
    keyPrefix: process.env.GEMINI_API_KEY?.substring(0, 10) + '...' || 'Not found',
    nodeEnv: process.env.NODE_ENV
  })
}