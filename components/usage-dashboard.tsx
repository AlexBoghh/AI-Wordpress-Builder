'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BarChart3, AlertTriangle, DollarSign, Activity } from 'lucide-react'

interface UsageStats {
  totalCost: number
  totalTokens: number
  totalRequests: number
  byProvider: Record<string, { requests: number; tokens: number; cost: number }>
  records: Array<{
    id: string
    provider: string
    model: string
    inputTokens: number
    outputTokens: number
    totalTokens: number
    estimatedCost: number
    pageTitle?: string
    createdAt: string
  }>
  warnings: string[]
  hasWarnings: boolean
}

interface UsageDashboardProps {
  trigger?: React.ReactNode
}

export function UsageDashboard({ trigger }: UsageDashboardProps) {
  const [open, setOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('today')
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/usage?timeframe=${timeframe}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchStats()
    }
  }, [open, timeframe])

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <BarChart3 className="h-3 w-3 mr-1.5" />
      Usage
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            API Usage Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {['today', 'week', 'month', 'all'].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(period as any)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {stats && !loading && (
            <>
              {/* Warnings */}
              {stats.hasWarnings && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h3 className="font-medium text-amber-800 dark:text-amber-200">Usage Warnings</h3>
                  </div>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    {stats.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium">Total Cost</h3>
                  </div>
                  <p className="text-2xl font-bold">${stats.totalCost.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">
                    {timeframe === 'today' ? 'Today' : `This ${timeframe}`}
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium">Total Tokens</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Across {stats.totalRequests} requests
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <h3 className="font-medium">Avg Cost/Request</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    ${stats.totalRequests > 0 ? (stats.totalCost / stats.totalRequests).toFixed(4) : '0.0000'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Per content generation
                  </p>
                </div>
              </div>

              {/* By Provider */}
              {Object.keys(stats.byProvider).length > 0 && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Usage by Provider</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.byProvider).map(([provider, data]) => (
                      <div key={provider} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="capitalize font-medium">{provider}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${data.cost.toFixed(4)} • {data.tokens.toLocaleString()} tokens • {data.requests} requests
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Requests */}
              {stats.records.length > 0 && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Recent Requests</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {stats.records.slice(0, 10).map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{record.pageTitle || 'Untitled'}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.model} • {new Date(record.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${record.estimatedCost.toFixed(4)}</p>
                          <p className="text-xs text-muted-foreground">{record.totalTokens.toLocaleString()} tokens</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {stats.records.length > 10 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Showing 10 of {stats.records.length} requests
                    </p>
                  )}
                </div>
              )}

              {/* Cost Optimization Tips */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Cost Optimization Tips</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Simple pages automatically use Claude Haiku (cheaper model)</li>
                  <li>• Complex content uses Claude Sonnet (better quality)</li>
                  <li>• Review generated content before regenerating to avoid duplicates</li>
                  <li>• Use custom prompts to get exactly what you need in fewer attempts</li>
                </ul>
              </div>
            </>
          )}

          {stats && !loading && stats.totalRequests === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No API usage data for this timeframe</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}