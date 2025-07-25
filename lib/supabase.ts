import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Types for our database schema
export interface Transaction {
  id: string
  transaction_date: string
  store_id: string
  consumer_profile_id: string
  total_amount: number
  payment_method: string
  basket_size: number
  duration_seconds: number
  request_method: string
  vibe_context: string
  created_at: string
}

export interface Product {
  id: string
  sku: string
  product_name: string
  brand_id: string
  category_id: string
  unit_price: number
  unit_size: string
  is_active: boolean
}

export interface Brand {
  id: string
  brand_name: string
  company: string
  is_tbwa_client: boolean
  category: string
}

export interface Store {
  id: string
  store_code: string
  store_name: string
  store_type: string
  barangay_id: string
  latitude: number
  longitude: number
}

export interface ConsumerProfile {
  id: string
  profile_code: string
  age_group: string
  gender: string
  income_bracket: string
  lifestyle_segment: string
}