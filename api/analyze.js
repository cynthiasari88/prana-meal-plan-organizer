export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Sign-in required' });
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, ANTHROPIC_API_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || !ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server environment is not configured' });
  }
  try {
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}` }
    });
    if (!authResponse.ok) return res.status(401).json({ error: 'Invalid or expired session' });
    const user = await authResponse.json();
    if ((user.email || '').toLowerCase() !== 'cynthiasari88@gmail.com') {
      return res.status(403).json({ error: 'This workspace is private' });
    }
    const { content } = req.body || {};
    if (!Array.isArray(content) || content.length === 0) return res.status(400).json({ error: 'Analyzer content is required' });
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content }] })
    });
    const result = await anthropicResponse.json();
    return res.status(anthropicResponse.status).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Analyzer request failed' });
  }
}
