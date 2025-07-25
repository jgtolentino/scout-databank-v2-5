'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative'
  subtitle?: string
  icon?: ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  subtitle,
  icon,
  className
}: StatsCardProps) {
  return (
    <div className={cn(
      "glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon && (
          <div className="p-2 bg-background/50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground animate-fade-in-up">
          {value}
        </p>
        
        {change !== undefined && (
          <div className={cn(
            "flex items-center space-x-1 text-sm",
            changeType === 'positive' ? 'text-success' : 'text-destructive'
          )}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
        
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}