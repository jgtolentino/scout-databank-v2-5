'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Users, ShoppingBag, CreditCard, TrendingUp, Brain, MessageSquare, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchConsumerBehavior } from '@/lib/api/analytics'
import { formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ConsumerBehaviorProps {
  filters: any
}

export function ConsumerBehavior({ filters }: ConsumerBehaviorProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['consumer-behavior', filters],
    queryFn: () => fetchConsumerBehavior(filters),
  })

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  const radarData = [
    { trait: 'Brand Loyalty', value: data?.traits?.brandLoyalty || 0 },
    { trait: 'Price Sensitivity', value: data?.traits?.priceSensitivity || 0 },
    { trait: 'Sustainability', value: data?.traits?.sustainability || 0 },
    { trait: 'Digital Adoption', value: data?.traits?.digitalAdoption || 0 },
    { trait: 'Impulse Buying', value: data?.traits?.impulseBuying || 0 },
    { trait: 'Quality Focus', value: data?.traits?.qualityFocus || 0 },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Purchase Funnel */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <CardTitle>Purchase Decision Funnel</CardTitle>
              <Badge variant="outline" className="text-xs">Behavioral</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="space-y-4">
            <div className="glass-card p-4 rounded-lg hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium">Self-Service</div>
                <div className="flex-1 bg-gray-200/30 rounded-full h-10 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                    style={{ width: `${data?.funnel?.selfService || 0}%` }}
                  >
                    <span className="text-sm text-white font-bold">
                      {data?.funnel?.selfService || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium">Assisted</div>
                <div className="flex-1 bg-gray-200/30 rounded-full h-10 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                    style={{ width: `${data?.funnel?.assisted || 0}%` }}
                  >
                    <span className="text-sm text-white font-bold">
                      {data?.funnel?.assisted || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium">Pre-ordered</div>
                <div className="flex-1 bg-gray-200/30 rounded-full h-10 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                    style={{ width: `${data?.funnel?.preOrdered || 0}%` }}
                  >
                    <span className="text-sm text-white font-bold">
                      {data?.funnel?.preOrdered || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Behavior Traits Radar */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <CardTitle>Consumer Behavior Traits</CardTitle>
              <Badge variant="secondary" className="text-xs bg-ai-glow/20 text-ai-glow">
                AI Analysis
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="glass-card p-4 rounded-lg">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" opacity={0.5} />
                  <PolarAngleAxis dataKey="trait" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10 }}
                  />
                  <Radar 
                    name="Current Period" 
                    dataKey="value" 
                    stroke="#FFD700" 
                    fill="#FFD700" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <CardTitle>Payment Method Distribution</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="glass-card p-4 rounded-lg">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.paymentMethods || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatPercent(value / 100)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acceptance Rates */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle>Suggestion Acceptance Rates</CardTitle>
              <Badge variant="secondary" className="text-xs bg-success/20 text-success">
                Trending
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
        
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300 bg-success/10">
              <p className="text-sm text-muted-foreground">Overall Rate</p>
              <p className="text-2xl font-bold mt-1 text-success animate-fade-in-up">
                {formatPercent(data?.acceptanceRates?.overall || 0)}
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300 bg-blue-500/10">
              <p className="text-sm text-muted-foreground">Brand Switch</p>
              <p className="text-2xl font-bold mt-1 text-blue-600 animate-fade-in-up">
                {formatPercent(data?.acceptanceRates?.brandSwitch || 0)}
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300 bg-purple-500/10">
              <p className="text-sm text-muted-foreground">Size Upgrade</p>
              <p className="text-2xl font-bold mt-1 text-purple-600 animate-fade-in-up">
                {formatPercent(data?.acceptanceRates?.sizeUpgrade || 0)}
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300 bg-orange-500/10">
              <p className="text-sm text-muted-foreground">Bundle Offer</p>
              <p className="text-2xl font-bold mt-1 text-orange-600 animate-fade-in-up">
                {formatPercent(data?.acceptanceRates?.bundleOffer || 0)}
              </p>
            </div>
          </div>
        
          {/* Request Methods */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Common Request Phrases
            </h4>
            <div className="space-y-2">
              {data?.commonPhrases?.map((phrase: any, index: number) => (
                <div 
                  key={phrase.text} 
                  className="glass-card p-3 rounded-lg hover:scale-[1.01] transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{phrase.text}</span>
                    <Badge variant="outline" className="text-xs">
                      {phrase.count} times
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}