'use client'

import { cn } from '@/lib/utils'

interface ToggleOption {
  value: string
  label: string
}

interface ToggleGroupProps {
  value: string
  onValueChange: (value: string) => void
  options: ToggleOption[]
  className?: string
}

export function ToggleGroup({ value, onValueChange, options, className }: ToggleGroupProps) {
  return (
    <div className={cn("inline-flex rounded-lg bg-gray-100 p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            value === option.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}