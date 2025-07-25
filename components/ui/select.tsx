'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

export function Select({ 
  className, 
  children, 
  value, 
  onChange,
  onValueChange,
  ...props 
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e)
    onValueChange?.(e.target.value)
  }

  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
          className
        )}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-3 h-4 w-4 pointer-events-none text-gray-500" />
    </div>
  )
}