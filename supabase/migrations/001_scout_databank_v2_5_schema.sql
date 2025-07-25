-- Scout Databank v2.5 Complete Schema
-- Includes: transactions, geographic data, AI insights, comparative analytics

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS scout_databank;
CREATE SCHEMA IF NOT EXISTS geo_analytics;
CREATE SCHEMA IF NOT EXISTS ai_insights;

-- Core dimension tables
CREATE TABLE scout_databank.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT UNIQUE NOT NULL,
  company TEXT,
  is_tbwa_client BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout_databank.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT UNIQUE NOT NULL,
  parent_category TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout_databank.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  brand_id UUID REFERENCES scout_databank.brands(id),
  category_id UUID REFERENCES scout_databank.categories(id),
  unit_price DECIMAL(10,2),
  unit_size TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Geographic hierarchy
CREATE TABLE geo_analytics.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_code TEXT UNIQUE NOT NULL,
  region_name TEXT NOT NULL,
  island_group TEXT CHECK (island_group IN ('Luzon', 'Visayas', 'Mindanao')),
  geometry GEOMETRY(MULTIPOLYGON, 4326),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE geo_analytics.provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_code TEXT UNIQUE NOT NULL,
  province_name TEXT NOT NULL,
  region_id UUID REFERENCES geo_analytics.regions(id),
  geometry GEOMETRY(MULTIPOLYGON, 4326),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE geo_analytics.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_code TEXT UNIQUE NOT NULL,
  city_name TEXT NOT NULL,
  province_id UUID REFERENCES geo_analytics.provinces(id),
  city_class TEXT,
  geometry GEOMETRY(MULTIPOLYGON, 4326),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE geo_analytics.barangays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barangay_code TEXT UNIQUE NOT NULL,
  barangay_name TEXT NOT NULL,
  city_id UUID REFERENCES geo_analytics.cities(id),
  urban_rural TEXT CHECK (urban_rural IN ('Urban', 'Rural')),
  population INTEGER,
  geometry GEOMETRY(MULTIPOLYGON, 4326),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store master data
CREATE TABLE scout_databank.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_code TEXT UNIQUE NOT NULL,
  store_name TEXT NOT NULL,
  store_type TEXT NOT NULL,
  barangay_id UUID REFERENCES geo_analytics.barangays(id),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Consumer profiles
CREATE TABLE scout_databank.consumer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_code TEXT UNIQUE NOT NULL,
  age_group TEXT CHECK (age_group IN ('18-24', '25-34', '35-44', '45-54', '55-64', '65+')),
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  income_bracket TEXT,
  lifestyle_segment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Main transaction table
CREATE TABLE scout_databank.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date TIMESTAMP NOT NULL,
  store_id UUID REFERENCES scout_databank.stores(id),
  consumer_profile_id UUID REFERENCES scout_databank.consumer_profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  basket_size INTEGER NOT NULL,
  duration_seconds INTEGER,
  request_method TEXT CHECK (request_method IN ('Self-service', 'Assisted', 'Pre-order')),
  vibe_context TEXT CHECK (vibe_context IN ('Intent', 'Tension', 'Equity')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transaction items
CREATE TABLE scout_databank.transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES scout_databank.transactions(id),
  product_id UUID REFERENCES scout_databank.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  was_suggested BOOLEAN DEFAULT false,
  suggestion_accepted BOOLEAN,
  substituted_from_id UUID REFERENCES scout_databank.products(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Substitution patterns
CREATE TABLE scout_databank.substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_product_id UUID REFERENCES scout_databank.products(id),
  substitute_product_id UUID REFERENCES scout_databank.products(id),
  occurrence_count INTEGER DEFAULT 1,
  acceptance_rate DECIMAL(5,2),
  region_id UUID REFERENCES geo_analytics.regions(id),
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(original_product_id, substitute_product_id, region_id)
);

-- Benchmark pairs for comparative mode
CREATE TABLE scout_databank.benchmark_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT CHECK (entity_type IN ('brand', 'region', 'category')),
  entity_a_id UUID NOT NULL,
  entity_b_id UUID NOT NULL,
  comparison_metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI insights storage
CREATE TABLE ai_insights.cached_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL,
  filter_context JSONB NOT NULL,
  llm_provider TEXT CHECK (llm_provider IN ('openai', 'anthropic', 'groq')),
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  vibe_context TEXT,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat history
CREATE TABLE ai_insights.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL,
  user_id UUID,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  total_messages INTEGER DEFAULT 0
);

CREATE TABLE ai_insights.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_insights.chat_sessions(id),
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insight embeddings for semantic search
CREATE TABLE ai_insights.insight_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id UUID REFERENCES ai_insights.cached_insights(id),
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_transactions_date ON scout_databank.transactions(transaction_date);
CREATE INDEX idx_transactions_store ON scout_databank.transactions(store_id);
CREATE INDEX idx_transaction_items_product ON scout_databank.transaction_items(product_id);
CREATE INDEX idx_stores_location ON scout_databank.stores USING GIST(location);
CREATE INDEX idx_barangays_geometry ON geo_analytics.barangays USING GIST(geometry);
CREATE INDEX idx_embeddings_vector ON ai_insights.insight_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Create materialized views for analytics
CREATE MATERIALIZED VIEW scout_databank.mv_daily_metrics AS
SELECT 
  DATE(transaction_date) as date,
  s.store_id,
  b.brand_id,
  COUNT(DISTINCT t.id) as transaction_count,
  SUM(t.total_amount) as revenue,
  AVG(t.total_amount) as avg_basket_value,
  AVG(t.basket_size) as avg_basket_size,
  AVG(t.duration_seconds) as avg_duration
FROM scout_databank.transactions t
JOIN scout_databank.stores s ON t.store_id = s.id
JOIN scout_databank.transaction_items ti ON t.id = ti.transaction_id
JOIN scout_databank.products p ON ti.product_id = p.id
JOIN scout_databank.brands b ON p.brand_id = b.id
GROUP BY DATE(transaction_date), s.store_id, b.brand_id;

CREATE MATERIALIZED VIEW geo_analytics.mv_regional_performance AS
SELECT 
  r.id as region_id,
  r.region_name,
  DATE(t.transaction_date) as date,
  COUNT(DISTINCT t.id) as transactions,
  SUM(t.total_amount) as revenue,
  COUNT(DISTINCT t.consumer_profile_id) as unique_consumers,
  AVG(t.basket_size) as avg_basket_size
FROM scout_databank.transactions t
JOIN scout_databank.stores s ON t.store_id = s.id
JOIN geo_analytics.barangays b ON s.barangay_id = b.id
JOIN geo_analytics.cities c ON b.city_id = c.id
JOIN geo_analytics.provinces p ON c.province_id = p.id
JOIN geo_analytics.regions r ON p.region_id = r.id
GROUP BY r.id, r.region_name, DATE(t.transaction_date);

-- Create refresh function
CREATE OR REPLACE FUNCTION scout_databank.refresh_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY scout_databank.mv_daily_metrics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY geo_analytics.mv_regional_performance;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE scout_databank.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_databank.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Seed some initial data
INSERT INTO scout_databank.categories (category_name, parent_category) VALUES
  ('Beverages', NULL),
  ('Snacks', NULL),
  ('Personal Care', NULL),
  ('Household', NULL),
  ('Tobacco', NULL);

INSERT INTO scout_databank.brands (brand_name, company, is_tbwa_client, category) VALUES
  ('Alaska', 'Alaska Milk Corporation', true, 'Beverages'),
  ('Oishi', 'Liwayway Marketing', true, 'Snacks'),
  ('Champion', 'Universal Robina Corporation', true, 'Household'),
  ('Del Monte', 'Del Monte Philippines', true, 'Beverages'),
  ('Winston', 'Japan Tobacco International', true, 'Tobacco');