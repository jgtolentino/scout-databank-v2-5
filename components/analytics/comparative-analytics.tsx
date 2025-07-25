'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { GitCompare, TrendingUp, Award, Target, Swords, BarChart3, MapPin } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ComparativeAnalyticsProps {
  filters: any
}

export function ComparativeAnalytics({ filters }: ComparativeAnalyticsProps) {
  const [brandA, setBrandA] = useState('alaska')
  const [brandB, setBrandB] = useState('bear-brand')
  const [metric, setMetric] = useState<'revenue' | 'volume' | 'share'>('revenue')

  const { data, isLoading } = useQuery({
    queryKey: ['comparative-analytics', brandA, brandB, filters],
    queryFn: async () => {
      // Mock data for demo
      return {
        comparison: {
          trends: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
            [brandA]: Math.random() * 100000 + 50000,
            [brandB]: Math.random() * 80000 + 40000,
          })),
          summary: {
            [brandA]: {
              revenue: 2850000,
              volume: 45000,
              marketShare: 0.32,
              growth: 0.15,
            },
            [brandB]: {
              revenue: 2100000,
              volume: 38000,
              marketShare: 0.24,
              growth: 0.08,
            },
          },
          headToHead: {
            winningSKUs: 8,
            losingSKUs: 5,
            substitutionRate: 0.23,
            customerOverlap: 0.45,
          },
        },
        regionalPerformance: [
          { region: 'NCR', [brandA]: 450000, [brandB]: 380000 },
          { region: 'Region IV-A', [brandA]: 320000, [brandB]: 290000 },
          { region: 'Region III', [brandA]: 280000, [brandB]: 250000 },
          { region: 'Region VII', [brandA]: 260000, [brandB]: 300000 },
          { region: 'Region VI', [brandA]: 240000, [brandB]: 220000 },
        ],
      }
    },
  })

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  const brandOptions = [
    { value: 'alaska', label: 'Alaska' },
    { value: 'bear-brand', label: 'Bear Brand' },
    { value: 'oishi', label: 'Oishi' },
    { value: 'piattos', label: 'Piattos' },
    { value: 'champion', label: 'Champion' },
    { value: 'joy', label: 'Joy' },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Brand Selector */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              <CardTitle>Brand Comparison</CardTitle>
              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                VS Mode
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <label className="text-sm font-medium mb-2 block">Brand A</label>
              <Select value={brandA} onValueChange={setBrandA}>
                {brandOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative">
                <Swords className="w-8 h-8 text-primary animate-pulse-glow" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">VS</span>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <label className="text-sm font-medium mb-2 block">Brand B</label>
              <Select value={brandB} onValueChange={setBrandB}>
                {brandOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" className="hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Revenue</span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">{brandOptions.find(b => b.value === brandA)?.label}</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(data?.comparison.summary[brandA].revenue)}</p>
              </div>
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">{brandOptions.find(b => b.value === brandB)?.label}</p>
                <p className="text-lg font-bold">{formatCurrency(data?.comparison.summary[brandB].revenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Market Share</span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">{brandOptions.find(b => b.value === brandA)?.label}</p>
                <p className="text-lg font-bold text-primary">{formatPercent(data?.comparison.summary[brandA].marketShare)}</p>
              </div>
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">{brandOptions.find(b => b.value === brandB)?.label}</p>
                <p className="text-lg font-bold">{formatPercent(data?.comparison.summary[brandB].marketShare)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Growth Rate</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">{brandOptions.find(b => b.value === brandA)?.label}</p>
                <p className={cn(
                  "text-lg font-bold",
                  data?.comparison.summary[brandA].growth > 0 ? 'text-success' : 'text-destructive'
                )}>
                  {data?.comparison.summary[brandA].growth > 0 ? '+' : ''}{formatPercent(data?.comparison.summary[brandA].growth)}
                </p>
              </div>
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">{brandOptions.find(b => b.value === brandB)?.label}</p>
                <p className={cn(
                  "text-lg font-bold",
                  data?.comparison.summary[brandB].growth > 0 ? 'text-success' : 'text-destructive'
                )}>
                  {data?.comparison.summary[brandB].growth > 0 ? '+' : ''}{formatPercent(data?.comparison.summary[brandB].growth)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Head-to-Head</span>
              <Badge variant="secondary" className="text-xs">AI</Badge>
            </div>
            <div className="space-y-2">
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">Substitution Rate</p>
                <p className="text-lg font-bold text-yellow-600">{formatPercent(data?.comparison.headToHead.substitutionRate)}</p>
              </div>
              <div className="glass-card p-2 rounded">
                <p className="text-xs text-muted-foreground">Customer Overlap</p>
                <p className="text-lg font-bold text-blue-600">{formatPercent(data?.comparison.headToHead.customerOverlap)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Comparison */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle>Performance Trends</CardTitle>
            </div>
            <div className="flex bg-card/50 rounded-lg p-1">
              <Button
                variant={metric === 'revenue' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMetric('revenue')}
                className="text-xs"
              >
                Revenue
              </Button>
              <Button
                variant={metric === 'volume' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMetric('volume')}
                className="text-xs"
              >
                Volume
              </Button>
              <Button
                variant={metric === 'share' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMetric('share')}
                className="text-xs"
              >
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="glass-card p-4 rounded-lg">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.comparison.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-PH', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  />
                  <YAxis tickFormatter={(value) => {
                    if (metric === 'revenue') return '₱' + (value / 1000) + 'k'
                    return value
                  }} />
                  <Tooltip 
                    formatter={(value: number) => {
                      if (metric === 'revenue') return formatCurrency(value)
                      return formatNumber(value)
                    }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={brandA} 
                    stroke="#FFD700" 
                    strokeWidth={3}
                    name={brandOptions.find(b => b.value === brandA)?.label}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={brandB} 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name={brandOptions.find(b => b.value === brandB)?.label}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle>Regional Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="glass-card p-4 rounded-lg">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.regionalPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="region" />
                  <YAxis tickFormatter={(value) => '₱' + (value / 1000) + 'k'} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey={brandA} 
                    fill="#FFD700"
                    name={brandOptions.find(b => b.value === brandA)?.label}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey={brandB} 
                    fill="#3B82F6"
                    name={brandOptions.find(b => b.value === brandB)?.label}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}