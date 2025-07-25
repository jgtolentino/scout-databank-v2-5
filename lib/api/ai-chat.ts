import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function sendChatMessage(
  message: string, 
  filters: any, 
  conversationHistory: any[]
) {
  // Build context from current dashboard state
  const context = await buildDashboardContext(filters)
  
  // Create system prompt
  const systemPrompt = `You are an AI assistant for Scout Databank Dashboard v2.5, analyzing Philippine retail data from sari-sari stores.

Current Context:
- Date Range: ${filters.dateRange}
- Geography: ${filters.geography}
- Brand Filter: ${filters.brand}
- Category: ${filters.category}
- Vibe Context: ${filters.vibeContext}

Available Data:
${JSON.stringify(context, null, 2)}

You can help with:
1. Comparing brand performance across regions
2. Analyzing substitution patterns
3. Identifying consumer behavior trends
4. Geographic insights and regional differences
5. Product mix optimization
6. Forecasting and predictions

Be specific, data-driven, and provide actionable insights.`

  try {
    // Try Claude first
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message }
      ],
    })

    // Log chat interaction
    await logChatInteraction(message, response.content[0].text, 'anthropic')

    return {
      content: response.content[0].text,
      provider: 'Claude',
    }
  } catch (error) {
    console.error('Claude failed, trying OpenAI:', error)
    
    // Fallback to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
    })

    const responseContent = completion.choices[0].message.content || ''
    
    // Log chat interaction
    await logChatInteraction(message, responseContent, 'openai')

    return {
      content: responseContent,
      provider: 'OpenAI',
    }
  }
}

async function buildDashboardContext(filters: any) {
  // Fetch key metrics based on current filters
  const [trends, regional, products] = await Promise.all([
    fetchKeyTrends(filters),
    fetchRegionalSummary(filters),
    fetchTopProducts(filters),
  ])

  return {
    trends,
    regional,
    products,
  }
}

async function fetchKeyTrends(filters: any) {
  const { data } = await supabase
    .from('mv_daily_metrics')
    .select('date, revenue, transaction_count')
    .order('date', { ascending: false })
    .limit(7)

  return data
}

async function fetchRegionalSummary(filters: any) {
  const { data } = await supabase
    .from('mv_regional_performance')
    .select('region_name, revenue, transactions')
    .order('revenue', { ascending: false })
    .limit(5)

  return data
}

async function fetchTopProducts(filters: any) {
  const { data } = await supabase
    .rpc('get_top_products_by_revenue', { limit: 10 })

  return data
}

async function logChatInteraction(
  userMessage: string, 
  assistantResponse: string, 
  provider: string
) {
  try {
    await supabase
      .from('chat_messages')
      .insert([
        {
          role: 'user',
          content: userMessage,
          metadata: { timestamp: new Date().toISOString() }
        },
        {
          role: 'assistant',
          content: assistantResponse,
          metadata: { 
            provider,
            timestamp: new Date().toISOString()
          }
        }
      ])
  } catch (error) {
    console.error('Failed to log chat interaction:', error)
  }
}