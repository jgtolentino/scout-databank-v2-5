'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, RefreshCw, AlertCircle, Brain } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { generateInsight } from '@/lib/api/ai-insights'
import { cn } from '@/lib/utils'

interface AIInsightPanelProps {
  filters: any
  activeModule: string
  vibeContext: string
}

export function AIInsightPanel({ filters, activeModule, vibeContext }: AIInsightPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const { data: insight, isLoading, refetch } = useQuery({
    queryKey: ['ai-insight', filters, activeModule, vibeContext],
    queryFn: () => generateInsight({ filters, activeModule, vibeContext }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  const vibeColors = {
    intent: 'bg-vibe-intent text-vibe-intent border-blue-500/30',
    tension: 'bg-vibe-tension text-vibe-tension border-orange-500/30',
    equity: 'bg-vibe-equity text-vibe-equity border-green-500/30',
  }

  const vibeIcons = {
    intent: '🎯',
    tension: '⚡',
    equity: '💎',
  }

  return (
    <Card variant="glass" className="transition-all duration-300 hover:shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-ai-glow" />
            <CardTitle>AI Insights</CardTitle>
            <Badge className={cn("flex items-center gap-1", vibeColors[vibeContext])}>
              <span className="text-lg">{vibeIcons[vibeContext]}</span>
              <span className="capitalize">{vibeContext}</span>
            </Badge>
          </div>
        
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            variant="ghost"
            size="icon-sm"
          >
            <RefreshCw className={cn(
              "w-4 h-4",
              isRefreshing && "animate-spin"
            )} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200/50 rounded animate-pulse" />
            <div className="h-4 bg-gray-200/50 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200/50 rounded animate-pulse w-1/2" />
          </div>
        ) : insight ? (
          <>
          {/* Main Insight */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {insight.mainInsight}
            </p>
          </div>

          {/* Key Points */}
          {insight.keyPoints && insight.keyPoints.length > 0 && (
            <div className="space-y-2 pt-3 border-t">
              {insight.keyPoints.map((point: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm text-gray-600">{point}</span>
                </div>
              ))}
            </div>
          )}

          {/* Anomaly Detection */}
          {insight.anomaly && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Anomaly Detected
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {insight.anomaly}
                </p>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {insight.recommendations && (
            <div className="pt-3 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Recommendations
              </h4>
              <div className="space-y-1">
                {insight.recommendations.map((rec: string, index: number) => (
                  <p key={index} className="text-sm text-gray-600">
                    → {rec}
                  </p>
                ))}
              </div>
            </div>
          )}

            {/* Metadata */}
            <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
              <span>Powered by {insight.llmProvider}</span>
              <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No insights available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}