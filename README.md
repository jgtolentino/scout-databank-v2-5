# Scout Databank Dashboard v2.5

AI-powered Philippine retail analytics dashboard with geographic drilldown, comparative analytics, and real-time insights.

![Scout Databank Dashboard](https://img.shields.io/badge/version-2.5.0-gold)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

### 📊 Analytics Modules
- **Transaction Trends**: Revenue, volume, basket size, duration tracking
- **Product Mix**: Category analysis, Pareto charts, substitution patterns
- **Consumer Behavior**: Purchase funnel, payment methods, acceptance rates
- **Consumer Profiling**: Demographics, location analysis, lifestyle segments
- **Comparative Analytics**: Brand vs brand, regional performance
- **Geographic Analysis**: Map-based insights with drill-down to barangay level

### 🤖 AI Integration
- **AI Insight Panels**: Context-aware insights with OpenAI/Claude
- **AI Chat Interface**: Interactive analytics assistant
- **Vibe Context System**: Intent/Tension/Equity analysis modes

### 🎛️ Advanced Features
- Real-time data updates
- Compare mode for dual-brand analysis
- Multi-level geographic drill-down
- Substitution pattern tracking
- Forecast integration

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key
- Anthropic API key (optional)
- Mapbox token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scout-databank-v2.5
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Database Setup

### Apply the schema:
```sql
-- Run the migration file in Supabase SQL editor
-- Path: supabase/migrations/001_scout_databank_v2_5_schema.sql
```

### Enable required extensions:
- PostGIS (for geographic data)
- pgvector (for AI embeddings)
- pg_stat_statements (for performance monitoring)

## Configuration

### AI Providers
Configure in `.env.local`:
```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
```

### Mapbox
```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk_...
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **Charts**: Recharts
- **Maps**: Mapbox GL JS
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4, Anthropic Claude, Groq
- **State**: React Query

### Project Structure
```
scout-databank-v2.5/
├── app/                    # Next.js app directory
├── components/            
│   ├── analytics/         # Analytics modules
│   ├── ai/               # AI components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # UI primitives
├── lib/
│   ├── api/              # API functions
│   ├── supabase.ts       # Database client
│   └── utils.ts          # Utilities
├── supabase/
│   ├── migrations/       # SQL migrations
│   └── functions/        # Edge functions
└── public/               # Static assets
```

## API Endpoints

### Analytics API
- `GET /api/analytics/trends` - Transaction trends
- `GET /api/analytics/products` - Product mix data
- `GET /api/analytics/behavior` - Consumer behavior
- `GET /api/analytics/geographic` - Geographic data

### AI API
- `POST /api/ai/insight` - Generate insights
- `POST /api/ai/chat` - Chat with AI assistant

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t scout-databank .
docker run -p 3000:3000 scout-databank
```

## Performance Optimization

- Materialized views for aggregated data
- React Query for caching
- Lazy loading for charts
- Image optimization
- Edge caching

## Security

- Row Level Security (RLS) enabled
- API rate limiting
- Input validation with Zod
- CORS configuration
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issues page.

---

Built with ❤️ for Philippine retail analytics