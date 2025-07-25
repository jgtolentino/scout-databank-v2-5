'use client'

import { Calendar, MapPin, Package, Tag, Zap } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface FilterBarProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const handleChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Select
            value={filters.dateRange}
            onValueChange={(value) => handleChange('dateRange', value)}
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </Select>
        </div>

        {/* Geography */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <Select
            value={filters.geography}
            onValueChange={(value) => handleChange('geography', value)}
          >
            <option value="all">All Philippines</option>
            <option value="ncr">NCR</option>
            <option value="luzon">Luzon</option>
            <option value="visayas">Visayas</option>
            <option value="mindanao">Mindanao</option>
          </Select>
        </div>

        {/* Brand */}
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-500" />
          <Select
            value={filters.brand}
            onValueChange={(value) => handleChange('brand', value)}
          >
            <option value="all">All Brands</option>
            <option value="alaska">Alaska</option>
            <option value="oishi">Oishi</option>
            <option value="champion">Champion</option>
            <option value="delmonte">Del Monte</option>
            <option value="winston">Winston</option>
          </Select>
        </div>

        {/* Category */}
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <Select
            value={filters.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <option value="all">All Categories</option>
            <option value="beverages">Beverages</option>
            <option value="snacks">Snacks</option>
            <option value="personal">Personal Care</option>
            <option value="household">Household</option>
            <option value="tobacco">Tobacco</option>
          </Select>
        </div>

        {/* Vibe Context */}
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-gray-500" />
          <Select
            value={filters.vibeContext}
            onValueChange={(value) => handleChange('vibeContext', value)}
          >
            <option value="intent">Intent</option>
            <option value="tension">Tension</option>
            <option value="equity">Equity</option>
          </Select>
        </div>

        {/* Compare Mode */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Compare Mode</label>
          <Switch
            checked={filters.compareMode}
            onCheckedChange={(checked) => handleChange('compareMode', checked)}
          />
        </div>
      </div>
    </div>
  )
}