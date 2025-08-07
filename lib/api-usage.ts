import { prisma } from '@/lib/prisma'

// Claude API pricing (as of January 2024)
export const CLAUDE_PRICING = {
  'claude-3-5-sonnet-20241022': {
    input: 3.00 / 1_000_000,  // $3 per million input tokens
    output: 15.00 / 1_000_000  // $15 per million output tokens
  },
  'claude-3-haiku-20240307': {
    input: 0.25 / 1_000_000,  // $0.25 per million input tokens
    output: 1.25 / 1_000_000  // $1.25 per million output tokens
  }
} as const

export interface UsageRecord {
  provider: string
  model: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  pageTitle?: string
  projectId?: string
}

export function calculateClaudeCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = CLAUDE_PRICING[model as keyof typeof CLAUDE_PRICING]
  if (!pricing) {
    // Default to Sonnet pricing if model not found
    const defaultPricing = CLAUDE_PRICING['claude-3-5-sonnet-20241022']
    return (inputTokens * defaultPricing.input) + (outputTokens * defaultPricing.output)
  }
  
  return (inputTokens * pricing.input) + (outputTokens * pricing.output)
}

export async function trackApiUsage(usage: UsageRecord): Promise<void> {
  try {
    await prisma.apiUsage.create({
      data: {
        provider: usage.provider,
        model: usage.model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        estimatedCost: usage.estimatedCost,
        pageTitle: usage.pageTitle,
        projectId: usage.projectId
      }
    })
  } catch (error) {
    console.error('Failed to track API usage:', error)
  }
}

export async function getUsageStats(timeframe: 'today' | 'week' | 'month' | 'all' = 'all') {
  const now = new Date()
  let startDate: Date
  
  switch (timeframe) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    default:
      startDate = new Date(0) // Beginning of time
  }
  
  const usage = await prisma.apiUsage.findMany({
    where: {
      createdAt: {
        gte: startDate
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  const totalCost = usage.reduce((sum, record) => sum + record.estimatedCost, 0)
  const totalTokens = usage.reduce((sum, record) => sum + record.totalTokens, 0)
  const totalRequests = usage.length
  
  const byProvider = usage.reduce((acc, record) => {
    if (!acc[record.provider]) {
      acc[record.provider] = { requests: 0, tokens: 0, cost: 0 }
    }
    acc[record.provider].requests++
    acc[record.provider].tokens += record.totalTokens
    acc[record.provider].cost += record.estimatedCost
    return acc
  }, {} as Record<string, { requests: number; tokens: number; cost: number }>)
  
  return {
    totalCost,
    totalTokens,
    totalRequests,
    byProvider,
    records: usage
  }
}

export async function getCurrentMonthUsage() {
  return await getUsageStats('month')
}

// Warning thresholds (configurable via environment variables)
export const USAGE_THRESHOLDS = {
  DAILY_COST_WARNING: parseFloat(process.env.DAILY_COST_WARNING || '1.00'),
  MONTHLY_COST_WARNING: parseFloat(process.env.MONTHLY_COST_WARNING || '20.00'),
  DAILY_TOKEN_WARNING: parseInt(process.env.DAILY_TOKEN_WARNING || '50000'),
  MONTHLY_TOKEN_WARNING: parseInt(process.env.MONTHLY_TOKEN_WARNING || '1000000')
}

export async function checkUsageWarnings() {
  const todayUsage = await getUsageStats('today')
  const monthUsage = await getUsageStats('month')
  
  const warnings = []
  
  if (todayUsage.totalCost > USAGE_THRESHOLDS.DAILY_COST_WARNING) {
    warnings.push(`Daily cost warning: $${todayUsage.totalCost.toFixed(4)} (threshold: $${USAGE_THRESHOLDS.DAILY_COST_WARNING})`)
  }
  
  if (monthUsage.totalCost > USAGE_THRESHOLDS.MONTHLY_COST_WARNING) {
    warnings.push(`Monthly cost warning: $${monthUsage.totalCost.toFixed(2)} (threshold: $${USAGE_THRESHOLDS.MONTHLY_COST_WARNING})`)
  }
  
  if (todayUsage.totalTokens > USAGE_THRESHOLDS.DAILY_TOKEN_WARNING) {
    warnings.push(`Daily token warning: ${todayUsage.totalTokens.toLocaleString()} tokens (threshold: ${USAGE_THRESHOLDS.DAILY_TOKEN_WARNING.toLocaleString()})`)
  }
  
  if (monthUsage.totalTokens > USAGE_THRESHOLDS.MONTHLY_TOKEN_WARNING) {
    warnings.push(`Monthly token warning: ${monthUsage.totalTokens.toLocaleString()} tokens (threshold: ${USAGE_THRESHOLDS.MONTHLY_TOKEN_WARNING.toLocaleString()})`)
  }
  
  return {
    hasWarnings: warnings.length > 0,
    warnings,
    todayUsage,
    monthUsage
  }
}

// Optimize content generation by using the most cost-effective model
export function getOptimalClaudeModel(contentLength: 'short' | 'medium' | 'long'): string {
  // For shorter content, use Haiku (cheaper)
  // For longer, more complex content, use Sonnet (better quality)
  switch (contentLength) {
    case 'short':
      return 'claude-3-haiku-20240307'  // Much cheaper for simple content
    case 'medium':
    case 'long':
    default:
      return 'claude-3-5-sonnet-20241022'  // Better quality for complex content
  }
}

export function estimateContentLength(pageData: { contentType?: string; metaDescription?: string; keywords?: string }): 'short' | 'medium' | 'long' {
  const { metaDescription, keywords, contentType } = pageData
  
  // Estimate based on content type and metadata
  if (contentType === 'product' && metaDescription && metaDescription.length > 100) {
    return 'long'
  }
  
  if (contentType === 'post' || (keywords && keywords.split(',').length > 5)) {
    return 'medium'
  }
  
  return 'short'
}