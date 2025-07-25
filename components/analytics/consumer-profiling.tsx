'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, MapPin, Briefcase, Heart, UserCheck, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPercent, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ConsumerProfilingProps {
  filters: any
}

const GENDER_COLORS = ['#3B82F6', '#EC4899', '#9CA3AF']
const AGE_COLORS = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#6366F1']

export function ConsumerProfiling({ filters }: ConsumerProfilingProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['consumer-profiling', filters],
    queryFn: async () => {
      // Mock data for demo
      return {
        demographics: {
          gender: [
            { name: 'Male', value: 45 },
            { name: 'Female', value: 52 },
            { name: 'Other', value: 3 },
          ],
          ageGroups: [
            { name: '18-24', value: 18 },
            { name: '25-34', value: 28 },
            { name: '35-44', value: 25 },
            { name: '45-54', value: 17 },
            { name: '55-64', value: 8 },
            { name: '65+', value: 4 },
          ],
        },
        location: {
          urbanRural: [
            { name: 'Urban', value: 68 },
            { name: 'Rural', value: 32 },
          ],
          topBarangays: [
            { name: 'Brgy. Poblacion', customers: 1250 },
            { name: 'Brgy. San Antonio', customers: 980 },
            { name: 'Brgy. Sta. Cruz', customers: 875 },
            { name: 'Brgy. Bagong Silang', customers: 750 },
            { name: 'Brgy. Maligaya', customers: 620 },
          ],
        },
        segments: [
          { name: 'Budget Conscious', percentage: 35, avgBasket: 125 },
          { name: 'Brand Loyalists', percentage: 25, avgBasket: 275 },
          { name: 'Convenience Seekers', percentage: 20, avgBasket: 180 },
          { name: 'Health Conscious', percentage: 12, avgBasket: 320 },
          { name: 'Impulse Buyers', percentage: 8, avgBasket: 150 },
        ],
        lifestyles: {
          'Working Professional': 28,
          'Housewife/Househusband': 32,
          'Student': 15,
          'Retiree': 8,
          'Business Owner': 12,
          'Others': 5,
        },
      }
    },
  })

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle>Gender Distribution</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          
            <div className="glass-card p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.demographics.gender || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {data?.demographics.gender.map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={GENDER_COLORS[index]}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <CardTitle>Age Groups</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          
            <div className="glass-card p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.demographics.ageGroups || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis dataKey="name" />
                    <YAxis />
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {data?.demographics.ageGroups.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={AGE_COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle>Location Analysis</CardTitle>
              <Badge variant="outline" className="text-xs">Geographic</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Urban vs Rural</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.location.urbanRural || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      <Cell fill="#10B981" className="hover:opacity-80 transition-opacity" />
                      <Cell fill="#F59E0B" className="hover:opacity-80 transition-opacity" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Top Barangays</h4>
              <div className="space-y-2">
                {data?.location.topBarangays.map((brgy: any, index: number) => (
                  <div 
                    key={brgy.name} 
                    className="glass-card p-3 rounded-lg hover:scale-[1.01] transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{brgy.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {formatNumber(brgy.customers)} customers
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <CardTitle>Customer Segments</CardTitle>
              <Badge variant="secondary" className="text-xs bg-ai-glow/20 text-ai-glow">
                AI-Segmented
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="space-y-3">
            {data?.segments.map((segment: any, index: number) => (
              <div 
                key={segment.name} 
                className="glass-card p-4 rounded-lg hover:scale-[1.01] transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {segment.name}
                  </h4>
                  <span className="text-lg font-bold text-primary animate-fade-in-up">
                    {segment.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200/30 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${segment.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Avg. basket: <span className="font-bold text-primary">₱{segment.avgBasket}</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Distribution */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <CardTitle>Lifestyle Categories</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data?.lifestyles || {}).map(([lifestyle, percentage], index) => (
              <div 
                key={lifestyle} 
                className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className="text-sm text-muted-foreground">{lifestyle}</p>
                <p className="text-2xl font-bold mt-1 text-primary animate-fade-in-up">
                  {percentage}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}