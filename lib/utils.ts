import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-PH').format(num)
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function getDateRangeFromFilter(filter: string) {
  const now = new Date()
  const start = new Date()
  
  switch (filter) {
    case 'last7days':
      start.setDate(now.getDate() - 7)
      break
    case 'last30days':
      start.setDate(now.getDate() - 30)
      break
    case 'last90days':
      start.setDate(now.getDate() - 90)
      break
    default:
      start.setDate(now.getDate() - 30)
  }
  
  return { start, end: now }
}