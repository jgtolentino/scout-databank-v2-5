'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { FilterBar } from '@/components/dashboard/filter-bar'
import { TransactionTrends } from '@/components/analytics/transaction-trends'
import { ProductMix } from '@/components/analytics/product-mix'
import { ConsumerBehavior } from '@/components/analytics/consumer-behavior'
import { ConsumerProfiling } from '@/components/analytics/consumer-profiling'
import { ComparativeAnalytics } from '@/components/analytics/comparative-analytics'
import { GeographicMap } from '@/components/analytics/geographic-map'
import { AIInsightPanel } from '@/components/ai/insight-panel'
import { AIChat } from '@/components/ai/chat-interface'
import { ToggleGroup } from '@/components/ui/toggle-group'

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    geography: 'all',
    brand: 'all',
    category: 'all',
    compareMode: false,
    vibeContext: 'intent',
  })
  
  const [showAIChat, setShowAIChat] = useState(false)
  const [activeModule, setActiveModule] = useState('trends')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />
        
        {/* Module Toggles */}
        <div className="mb-6">
          <ToggleGroup
            value={activeModule}
            onValueChange={setActiveModule}
            options={[
              { value: 'trends', label: 'Transaction Trends' },
              { value: 'products', label: 'Product Mix' },
              { value: 'behavior', label: 'Consumer Behavior' },
              { value: 'profiling', label: 'Consumer Profiling' },
              { value: 'comparative', label: 'Comparative' },
              { value: 'geographic', label: 'Geographic' },
            ]}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analytics Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeModule === 'trends' && (
              <TransactionTrends filters={filters} />
            )}
            
            {activeModule === 'products' && (
              <ProductMix filters={filters} />
            )}
            
            {activeModule === 'behavior' && (
              <ConsumerBehavior filters={filters} />
            )}
            
            {activeModule === 'profiling' && (
              <ConsumerProfiling filters={filters} />
            )}
            
            {activeModule === 'comparative' && (
              <ComparativeAnalytics filters={filters} />
            )}
            
            {activeModule === 'geographic' && (
              <GeographicMap filters={filters} />
            )}
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            <AIInsightPanel 
              filters={filters} 
              activeModule={activeModule}
              vibeContext={filters.vibeContext}
            />
            
            {/* AI Chat Toggle */}
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {showAIChat ? 'Hide AI Chat' : 'Open AI Chat'}
            </button>
          </div>
        </div>

        {/* AI Chat Overlay */}
        {showAIChat && (
          <AIChat 
            isOpen={showAIChat}
            onClose={() => setShowAIChat(false)}
            filters={filters}
          />
        )}
      </main>
    </div>
  )
}