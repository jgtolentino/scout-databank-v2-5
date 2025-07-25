import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // For demo purposes
})

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // For demo purposes
})

interface InsightRequest {
  filters: any
  activeModule: string
  vibeContext: string
}

export async function generateInsight({ filters, activeModule, vibeContext }: InsightRequest) {
  // Check cache first
  const cacheKey = JSON.stringify({ filters, activeModule, vibeContext })
  const { data: cached } = await supabase
    .from('cached_insights')
    .select('*')
    .eq('filter_context', cacheKey)
    .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
    .single()

  if (cached) {
    return JSON.parse(cached.response)
  }

  // Build context based on active module
  const context = await buildContextForModule(activeModule, filters)
  
  // Generate prompt based on vibe context
  const prompt = generatePromptWithVibe(context, vibeContext, activeModule)

  try {
    // Try OpenAI first
    const response = await generateWithOpenAI(prompt)
    
    // Cache the response
    await supabase
      .from('cached_insights')
      .insert({
        insight_type: activeModule,
        filter_context: cacheKey,
        llm_provider: 'openai',
        prompt,
        response: JSON.stringify(response),
        vibe_context: vibeContext,
        tokens_used: response.tokensUsed,
        response_time_ms: response.responseTime,
      })

    return response
  } catch (error) {
    console.error('OpenAI failed, trying Anthropic:', error)
    
    // Fallback to Anthropic
    const response = await generateWithAnthropic(prompt)
    
    // Cache the response
    await supabase
      .from('cached_insights')
      .insert({
        insight_type: activeModule,
        filter_context: cacheKey,
        llm_provider: 'anthropic',
        prompt,
        response: JSON.stringify(response),
        vibe_context: vibeContext,
        tokens_used: response.tokensUsed,
        response_time_ms: response.responseTime,
      })

    return response
  }
}

async function buildContextForModule(module: string, filters: any) {
  // Fetch relevant data based on module
  switch (module) {
    case 'trends':
      return await fetchTrendContext(filters)
    case 'products':
      return await fetchProductContext(filters)
    case 'behavior':
      return await fetchBehaviorContext(filters)
    case 'geographic':
      return await fetchGeographicContext(filters)
    default:
      return { module, filters }
  }
}

function generatePromptWithVibe(context: any, vibeContext: string, module: string) {
  const vibePrompts = {
    intent: "Focus on strategic intentions, goals, and forward-looking opportunities.",
    tension: "Highlight challenges, conflicts, competitive pressures, and areas needing attention.",
    equity: "Emphasize brand value, customer loyalty, market position, and competitive advantages."
  }

  return `You are analyzing Philippine retail data for sari-sari stores. 
Module: ${module}
Vibe Context: ${vibeContext} - ${vibePrompts[vibeContext]}

Data Context:
${JSON.stringify(context, null, 2)}

Generate an insight that:
1. Provides a main insight (2-3 sentences)
2. Lists 2-3 key points
3. Detects any anomalies if present
4. Offers 2 actionable recommendations

Format as JSON with keys: mainInsight, keyPoints[], anomaly (optional), recommendations[]`
}

async function generateWithOpenAI(prompt: string) {
  const start = Date.now()
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a Philippine retail analytics expert specializing in sari-sari store insights."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  })

  const response = JSON.parse(completion.choices[0].message.content || '{}')
  
  return {
    ...response,
    llmProvider: 'OpenAI GPT-4',
    timestamp: new Date().toISOString(),
    tokensUsed: completion.usage?.total_tokens,
    responseTime: Date.now() - start,
  }
}

async function generateWithAnthropic(prompt: string) {
  const start = Date.now()
  
  const message = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
  })

  const response = JSON.parse(message.content[0].text || '{}')
  
  return {
    ...response,
    llmProvider: 'Claude 3 Opus',
    timestamp: new Date().toISOString(),
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    responseTime: Date.now() - start,
  }
}

// Context fetching functions
async function fetchTrendContext(filters: any) {
  const { data } = await supabase
    .from('mv_daily_metrics')
    .select('*')
    .order('date', { ascending: false })
    .limit(30)

  return {
    recentTrends: data,
    filters,
  }
}

async function fetchProductContext(filters: any) {
  const { data } = await supabase
    .rpc('get_top_products', { limit: 20 })

  return {
    topProducts: data,
    filters,
  }
}

async function fetchBehaviorContext(filters: any) {
  const { data } = await supabase
    .from('transactions')
    .select('request_method, payment_method')
    .limit(100)

  return {
    behaviors: data,
    filters,
  }
}

async function fetchGeographicContext(filters: any) {
  const { data } = await supabase
    .from('mv_regional_performance')
    .select('*')
    .order('revenue', { ascending: false })
    .limit(10)

  return {
    regionalPerformance: data,
    filters,
  }
}