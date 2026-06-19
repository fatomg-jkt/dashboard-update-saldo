import { sendJson } from './_shared';
export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const expected = process.env.ADMIN_PASSWORD || 'fatmanage';
  return sendJson(res, 200, { ok: body?.password === expected });
}
