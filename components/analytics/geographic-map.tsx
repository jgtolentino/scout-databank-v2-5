'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Map, { Source, Layer, NavigationControl, Popup } from 'react-map-gl'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Layers, TrendingUp, Map as MapIcon, Filter } from 'lucide-react'
import { fetchGeographicData } from '@/lib/api/analytics'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import 'mapbox-gl/dist/mapbox-gl.css'

interface GeographicMapProps {
  filters: any
}

export function GeographicMap({ filters }: GeographicMapProps) {
  const [viewport, setViewport] = useState({
    latitude: 12.8797,
    longitude: 121.7740,
    zoom: 5.5,
  })
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [mapLayer, setMapLayer] = useState<'revenue' | 'volume' | 'branded'>('revenue')

  const { data: geoData, isLoading } = useQuery({
    queryKey: ['geographic-data', filters],
    queryFn: () => fetchGeographicData(filters),
  })

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  const getLayerPaint = () => {
    switch (mapLayer) {
      case 'revenue':
        return {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'revenue'],
            0, '#FEF3C7',
            50000, '#FDE68A',
            100000, '#FCD34D',
            500000, '#FBBF24',
            1000000, '#F59E0B',
          ],
          'fill-opacity': 0.7,
        }
      case 'volume':
        return {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'transactions'],
            0, '#DBEAFE',
            100, '#BFDBFE',
            500, '#93C5FD',
            1000, '#60A5FA',
            5000, '#3B82F6',
          ],
          'fill-opacity': 0.7,
        }
      case 'branded':
        return {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'branded_preference'],
            0, '#FEE2E2',
            0.25, '#FECACA',
            0.5, '#FCA5A5',
            0.75, '#F87171',
            1, '#EF4444',
          ],
          'fill-opacity': 0.7,
        }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-primary" />
              <CardTitle>Geographic Analysis</CardTitle>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Pro
              </Badge>
            </div>
            
            {/* Layer Selector */}
            <div className="flex items-center gap-2">
              <div className="flex bg-card/50 rounded-lg p-1">
                {[
                  { key: 'revenue', label: 'Revenue' },
                  { key: 'volume', label: 'Volume' },
                  { key: 'branded', label: 'Branded' }
                ].map((mode) => (
                  <Button
                    key={mode.key}
                    variant={mapLayer === mode.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMapLayer(mode.key as any)}
                    className="text-xs"
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" size="icon-sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Map Container */}
          <div className="relative h-[500px] rounded-lg overflow-hidden">
        <Map
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          interactiveLayerIds={['regions-layer']}
          onClick={(event) => {
            const feature = event.features?.[0]
            if (feature) {
              setSelectedRegion(feature.properties)
            }
          }}
        >
          <NavigationControl position="top-right" />
          
          {/* Regions Layer */}
          <Source
            id="regions"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: geoData?.regions?.map((region: any) => ({
                type: 'Feature',
                properties: {
                  ...region,
                  name: region.region_name,
                  revenue: region.revenue,
                  transactions: region.transactions,
                  branded_preference: region.branded_preference || 0.5,
                },
                geometry: region.geometry,
              })) || [],
            }}
          >
            <Layer
              id="regions-layer"
              type="fill"
              paint={getLayerPaint()}
            />
            <Layer
              id="regions-outline"
              type="line"
              paint={{
                'line-color': '#374151',
                'line-width': 1,
              }}
            />
          </Source>

          {/* Popup */}
          {selectedRegion && (
            <Popup
              latitude={selectedRegion.center_lat || viewport.latitude}
              longitude={selectedRegion.center_lng || viewport.longitude}
              onClose={() => setSelectedRegion(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="p-2">
                <h4 className="font-semibold">{selectedRegion.name}</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRegion.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transactions:</span>
                    <span className="font-medium">
                      {formatNumber(selectedRegion.transactions)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Basket:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRegion.avg_basket_size || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Map>
        
        {/* Animated Regional Bubbles Overlay */}
        {geoData?.regions?.map((region: any, index: number) => {
          const size = Math.sqrt(region.revenue / 10000) + 20
          const delay = index * 100
          
          return (
            <div
              key={region.region_id}
              className="absolute animate-pulse-glow"
              style={{
                top: `${20 + (index % 3) * 30}%`,
                left: `${20 + (index % 4) * 20}%`,
                animationDelay: `${delay}ms`,
              }}
            >
              <div
                className={cn(
                  "rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110",
                  mapLayer === 'revenue' ? 'bg-geo-high' : 
                  mapLayer === 'volume' ? 'bg-geo-medium' : 
                  'bg-geo-low'
                )}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.6,
                }}
                onClick={() => setSelectedRegion(region)}
              >
                <div className="text-white text-xs font-semibold">
                  {region.region_name?.slice(0, 3)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      </CardContent>
    </Card>

      {/* Regional Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {geoData?.topRegions?.slice(0, 3).map((region: any, index: number) => (
          <Card key={region.region_id} variant="glass" className="p-4 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{region.region_name}</h4>
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">{formatCurrency(region.revenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium">{formatNumber(region.transactions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Growth</span>
                <span className={cn(
                  "font-medium",
                  region.growth > 0 ? 'text-success' : 'text-destructive'
                )}>
                  {region.growth > 0 ? '+' : ''}{(region.growth * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Drilldown Path */}
      {filters.geography !== 'all' && (
        <div className="mt-4 flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Viewing:</span>
          <span className="font-medium">Philippines</span>
          {filters.region && (
            <>
              <span className="text-gray-400">›</span>
              <span className="font-medium">{filters.region}</span>
            </>
          )}
          {filters.province && (
            <>
              <span className="text-gray-400">›</span>
              <span className="font-medium">{filters.province}</span>
            </>
          )}
          {filters.city && (
            <>
              <span className="text-gray-400">›</span>
              <span className="font-medium">{filters.city}</span>
            </>
          )}
        </div>
      )}
    </Card>
  )
}