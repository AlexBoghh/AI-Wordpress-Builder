import { NextRequest, NextResponse } from 'next/server'
import { getUsageStats, checkUsageWarnings } from '@/lib/api-usage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') as 'today' | 'week' | 'month' | 'all' || 'all'
    
    const stats = await getUsageStats(timeframe)
    const warnings = await checkUsageWarnings()
    
    return NextResponse.json({
      ...stats,
      warnings: warnings.hasWarnings ? warnings.warnings : [],
      hasWarnings: warnings.hasWarnings
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    )
  }
}