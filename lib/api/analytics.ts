import { supabase } from '@/lib/supabase'
import { getDateRangeFromFilter } from '@/lib/utils'

export async function fetchTransactionTrends(filters: any) {
  const { start, end } = getDateRangeFromFilter(filters.dateRange)
  
  // Fetch daily metrics
  let query = supabase
    .from('mv_daily_metrics')
    .select('*')
    .gte('date', start.toISOString())
    .lte('date', end.toISOString())
    .order('date', { ascending: true })

  // Apply filters
  if (filters.brand !== 'all') {
    query = query.eq('brand_id', filters.brand)
  }

  const { data, error } = await query

  if (error) throw error

  // Process data for charts
  const trends = data?.reduce((acc: any[], item: any) => {
    const existing = acc.find(d => d.date === item.date)
    if (existing) {
      existing.revenue += item.revenue
      existing.volume += item.transaction_count
      existing.basket += item.avg_basket_size
      existing.duration += item.avg_duration
    } else {
      acc.push({
        date: item.date,
        revenue: item.revenue,
        volume: item.transaction_count,
        basket: item.avg_basket_size,
        duration: item.avg_duration,
      })
    }
    return acc
  }, [])

  // Calculate summary stats
  const current = trends?.slice(-7).reduce((acc, item) => ({
    revenue: acc.revenue + item.revenue,
    volume: acc.volume + item.volume,
    basket: acc.basket + item.basket / 7,
    duration: acc.duration + item.duration / 7,
  }), { revenue: 0, volume: 0, basket: 0, duration: 0 })

  const previous = trends?.slice(-14, -7).reduce((acc, item) => ({
    revenue: acc.revenue + item.revenue,
    volume: acc.volume + item.volume,
    basket: acc.basket + item.basket / 7,
    duration: acc.duration + item.duration / 7,
  }), { revenue: 0, volume: 0, basket: 0, duration: 0 })

  // Add forecast (simple linear projection)
  const lastWeekGrowth = current.revenue / previous.revenue - 1
  const forecast = current.revenue * (1 + lastWeekGrowth)

  return {
    trends,
    summary: {
      current: current.revenue,
      previous: previous.revenue,
      change: lastWeekGrowth,
      forecast,
    },
    comparison: filters.compareMode ? [
      { period: 'Current', ...current },
      { period: 'Previous', ...previous },
    ] : null,
  }
}

export async function fetchProductMix(filters: any) {
  const { start, end } = getDateRangeFromFilter(filters.dateRange)
  
  const { data, error } = await supabase
    .rpc('get_product_mix', {
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      brand_filter: filters.brand === 'all' ? null : filters.brand,
    })

  if (error) throw error
  return data
}

export async function fetchConsumerBehavior(filters: any) {
  const { start, end } = getDateRangeFromFilter(filters.dateRange)
  
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      request_method,
      payment_method,
      consumer_profile:consumer_profiles(*)
    `)
    .gte('transaction_date', start.toISOString())
    .lte('transaction_date', end.toISOString())

  if (error) throw error
  
  // Process behavior data
  const behavior = {
    requestMethods: {},
    paymentMethods: {},
    acceptanceRate: 0,
  }
  
  data?.forEach(transaction => {
    behavior.requestMethods[transaction.request_method] = 
      (behavior.requestMethods[transaction.request_method] || 0) + 1
    behavior.paymentMethods[transaction.payment_method] = 
      (behavior.paymentMethods[transaction.payment_method] || 0) + 1
  })

  return behavior
}

export async function fetchGeographicData(filters: any) {
  const { data, error } = await supabase
    .from('mv_regional_performance')
    .select(`
      region_id,
      region_name,
      revenue,
      transactions,
      unique_consumers,
      avg_basket_size
    `)
    .order('revenue', { ascending: false })

  if (error) throw error
  return data
}