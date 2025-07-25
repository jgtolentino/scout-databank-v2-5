'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, DollarSign, ShoppingCart, Clock } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchTransactionTrends } from '@/lib/api/analytics'
import { cn } from '@/lib/utils'

interface TransactionTrendsProps {
  filters: any
}

export function TransactionTrends({ filters }: TransactionTrendsProps) {
  const [metric, setMetric] = useState<'revenue' | 'volume' | 'basket' | 'duration'>('revenue')
  
  const { data, isLoading } = useQuery({
    queryKey: ['transaction-trends', filters],
    queryFn: () => fetchTransactionTrends(filters),
  })

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  const metricConfig = {
    revenue: {
      label: 'Revenue',
      icon: DollarSign,
      color: '#FFD700',
      bgColor: 'bg-yellow-500/20',
      formatter: formatCurrency,
    },
    volume: {
      label: 'Transaction Volume',
      icon: Activity,
      color: '#10B981',
      bgColor: 'bg-green-500/20',
      formatter: formatNumber,
    },
    basket: {
      label: 'Average Basket Size',
      icon: ShoppingCart,
      color: '#3B82F6',
      bgColor: 'bg-blue-500/20',
      formatter: (v: number) => formatNumber(v) + ' items',
    },
    duration: {
      label: 'Average Duration',
      icon: Clock,
      color: '#8B5CF6',
      bgColor: 'bg-purple-500/20',
      formatter: (v: number) => Math.round(v) + ' sec',
    },
  }

  const config = metricConfig[metric]
  const Icon = config.icon

  return (
    <Card variant="glass" className="animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Transaction Trends</CardTitle>
            <Badge variant="outline" className="text-xs">Live</Badge>
          </div>
          
          {/* Metric Selector */}
          <div className="flex bg-card/50 rounded-lg p-1">
            {Object.entries(metricConfig).map(([key, cfg]) => {
              const MetricIcon = cfg.icon
              return (
                <Button
                  key={key}
                  variant={metric === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMetric(key as any)}
                  className={cn(
                    "text-xs",
                    metric === key && "shadow-lg"
                  )}
                >
                  <MetricIcon className="w-4 h-4 mr-1" />
                  {cfg.label}
                </Button>
              )
            })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cn(
            "glass-card p-4 hover:scale-[1.02] transition-all duration-300",
            config.bgColor
          )}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current</span>
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold mt-1 animate-fade-in-up">
              {config.formatter(data?.summary?.current || 0)}
            </p>
          </div>
          
          <div className="glass-card p-4 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous</span>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-1">
              {config.formatter(data?.summary?.previous || 0)}
            </p>
          </div>
          
          <div className="glass-card p-4 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Change</span>
              {data?.summary?.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
            </div>
            <p className={cn(
              "text-2xl font-bold mt-1",
              data?.summary?.change > 0 ? 'text-success' : 'text-destructive'
            )}>
              {formatPercent(data?.summary?.change || 0)}
            </p>
          </div>
          
          <div className="glass-card p-4 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Forecast</span>
              <Activity className="w-4 h-4 text-ai-glow" />
            </div>
            <p className="text-2xl font-bold mt-1 text-ai-glow">
              {config.formatter(data?.summary?.forecast || 0)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card p-4 rounded-lg">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trends || []}>
                <defs>
                  <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-PH', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <YAxis 
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (metric === 'revenue') return '₱' + (value / 1000) + 'k'
                    if (metric === 'volume') return value
                    return value
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => config.formatter(value)}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-PH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke={config.color}
                  strokeWidth={2}
                  fill={`url(#gradient-${metric})`}
                />
                {data?.trends?.[0]?.forecast && (
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke={config.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compare Mode Additional Chart */}
        {filters.compareMode && data?.comparison && (
          <div className="glass-card p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Compare</Badge>
              Period Comparison
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.comparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.5} />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => {
                    if (metric === 'revenue') return '₱' + (value / 1000) + 'k'
                    return value
                  }} />
                  <Tooltip 
                    formatter={(value: number) => config.formatter(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="current" fill={config.color} name="Current Period" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previous" fill="#E5E7EB" name="Previous Period" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}