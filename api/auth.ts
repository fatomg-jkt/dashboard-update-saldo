type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } };

type AuthBody = { password?: string };

function sendJson(res: VercelResponse, status: number, body: { ok: boolean; message?: string }) {
  const response = res.status(status);
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(body));
}

function parseBody(body: unknown): AuthBody {
  if (typeof body === 'string') return JSON.parse(body || '{}') as AuthBody;
  if (body && typeof body === 'object') return body as AuthBody;
  return {};
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
    const body = parseBody(req.body);
    const expectedPassword = process.env.ADMIN_PASSWORD || 'fatmanage';
    return sendJson(res, 200, { ok: body.password === expectedPassword });
  } catch (error) {
    return sendJson(res, 500, { ok: false, message: error instanceof Error ? error.message : 'Authentication API failed' });
  }
}
