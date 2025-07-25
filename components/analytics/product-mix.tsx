'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Package, TrendingUp, AlertTriangle, ShoppingBasket, Filter, Shuffle } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchProductMix } from '@/lib/api/analytics'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductMixProps {
  filters: any
}

const COLORS = ['#FFD700', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#6366F1', '#EC4899']

interface CategoryData {
  name: string
  value: number
  percent?: number
}

interface ProductData {
  name: string
  revenue: number
  growth?: number
}

export function ProductMix({ filters }: ProductMixProps) {
  const [activeView, setActiveView] = useState<'categories' | 'products'>('categories')
  
  const { data, isLoading } = useQuery({
    queryKey: ['product-mix', filters],
    queryFn: () => fetchProductMix(filters),
  })

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Category Mix */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <CardTitle>Product Mix Analysis</CardTitle>
              <Badge variant="secondary" className="text-xs">AI-Enhanced</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-card/50 rounded-lg p-1">
                <Button
                  variant={activeView === 'categories' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('categories')}
                  className="text-xs"
                >
                  Categories
                </Button>
                <Button
                  variant={activeView === 'products' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('products')}
                  className="text-xs"
                >
                  Products
                </Button>
              </div>
              <Button variant="ghost" size="icon-sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.categoryMix || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${formatPercent(percent)}`}
                    >
                      {data?.categoryMix?.map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-2">
              {data?.categoryMix?.slice(0, 5).map((category: CategoryData, index: number) => (
                <div 
                  key={category.name} 
                  className="glass-card p-3 rounded-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full animate-pulse-glow" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">
                        {formatCurrency(category.value)}
                      </span>
                      {category.percent && (
                        <span className="text-xs text-muted-foreground block">
                          {formatPercent(category.percent)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pareto Analysis */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle>Top Products</CardTitle>
              <Badge variant="outline" className="text-xs">Pareto Analysis</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="glass-card p-4 rounded-lg">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topProducts || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
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
                  <Bar 
                    dataKey="revenue" 
                    fill="#FFD700"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Substitution Patterns */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-primary" />
              <CardTitle>Substitution Patterns</CardTitle>
              <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-700">
                AI Insights
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="space-y-3">
            {data?.substitutions?.map((sub: any, index: number) => (
              <div 
                key={sub.id} 
                className="glass-card p-4 rounded-lg hover:scale-[1.01] transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{sub.original}</span>
                      <span className="mx-3 text-primary animate-pulse">→</span>
                      <span className="font-medium text-sm">{sub.substitute}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-bold",
                      sub.acceptanceRate > 0.7 ? 'text-success' : 
                      sub.acceptanceRate > 0.4 ? 'text-yellow-600' : 
                      'text-destructive'
                    )}>
                      {formatPercent(sub.acceptanceRate)} acceptance
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sub.occurrences} occurrences
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basket Analysis */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingBasket className="w-5 h-5 text-primary" />
            <CardTitle>Basket Composition</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
        
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300">
              <p className="text-sm text-muted-foreground">Avg Items/Basket</p>
              <p className="text-2xl font-bold mt-1 text-primary animate-fade-in-up">
                {data?.basketStats?.avgItems || 0}
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300">
              <p className="text-sm text-muted-foreground">Most Common Size</p>
              <p className="text-2xl font-bold mt-1 animate-fade-in-up">
                {data?.basketStats?.modeItems || 0} items
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300">
              <p className="text-sm text-muted-foreground">Single Item %</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600 animate-fade-in-up">
                {formatPercent(data?.basketStats?.singleItemRate || 0)}
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all duration-300">
              <p className="text-sm text-muted-foreground">Multi-Category %</p>
              <p className="text-2xl font-bold mt-1 text-success animate-fade-in-up">
                {formatPercent(data?.basketStats?.multiCategoryRate || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}