# Meal Plan Organizer — Supabase + Vercel

## Deployment
1. Push this folder to a GitHub repository.
2. Import the repository in Vercel. Framework preset: Other; build command: leave blank; output directory: `.`.
3. Add these Vercel environment variables (Production, Preview, Development as needed):
   - `SUPABASE_URL` = `https://vgnvwvfpnwcchcbbmebq.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = the project's `sb_publishable_...` key
   - `ANTHROPIC_API_KEY` = your Anthropic API key (copy it directly from Anthropic Console; never paste it into chat or frontend code)
4. Deploy. The app requires an authenticated Supabase user with email `cynthiasari88@gmail.com`.

## Security
- Browser uses only the Supabase publishable key; database access is restricted by RLS.
- The AI analyzer is proxied through `/api/analyze`, which validates the Supabase session and owner email before calling Anthropic.
- Never put a Supabase secret/service-role key or Anthropic API key in `index.html`.
