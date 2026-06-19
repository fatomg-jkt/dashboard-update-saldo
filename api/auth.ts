import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'fatmanage';
  if (password === expectedPassword) return res.status(200).json({ ok: true });
  return res.status(401).json({ ok: false, message: 'Password belum sesuai. Silakan coba lagi.' });
}
