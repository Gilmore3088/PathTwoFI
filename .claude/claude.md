Use pnpm exclusively (not npm or yarn)
The server is always running on port 3000
Use available MCP servers for knowledgebase and understanding
Place components in the app directory /components and combine by usecase in subdirectories
Always use /components/ui to build new components
Fetch logs from the console
Suggest performance improvements
Point out potential security issues and suggest solutions
Don't install packages unless asked
Prefer iteration and modularization over code duplication.

## Project: PathTwoFI
A personal financial wellness tracker for a couple pursuing FIRE (Financial Independence, Retire Early).

### Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Supabase (Auth, PostgreSQL, Storage)
- Tailwind CSS v4 + shadcn/ui + Radix UI
- TipTap rich text editor (blog)
- Recharts (financial charts)
- Deployed via Vercel (no Replit)

### FIRE Configuration
- Today's Goal: $3,500,000
- Stretch Goal: $4,000,000
- Target Date: January 30, 2040
- Inflation Rate: 3%
- Current Net Worth: $816,457 (excluding home equity)
- Categories: His / Her / Combined

### Key Directories
- `app/dashboard/wealthboard/` - Financial tracking dashboard + server actions
- `app/dashboard/blogs/` - Blog management + server actions
- `components/wealthboard/` - Wealth tracking UI components
- `components/ui/` - shadcn/ui base components
- `lib/fire-constants.ts` - FIRE calculation logic
- `types/wealth.types.ts` - Financial data TypeScript types
- `supabase/migrations/` - Database migrations with RLS policies

### Database Tables
- profiles, blogs (from v2)
- wealth_data, financial_goals, goal_milestones, wealth_reports (ported from v1)

### Conventions
- Server components fetch data; client components handle interactivity
- Server actions for all mutations (no API routes)
- RLS policies on every table for security
- His/Her/Combined category system for all financial data
