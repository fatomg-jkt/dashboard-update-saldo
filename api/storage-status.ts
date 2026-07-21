type JsonResponse = { configured: true } | { configured: false; error: string };
type VercelResponse = { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } };

function sendJson(res: VercelResponse, status: number, body: JsonResponse) {
  const response = res.status(status);
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

export default function handler(_req: unknown, res: VercelResponse) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return sendJson(res, 200, { configured: false, error: 'BLOB_READ_WRITE_TOKEN missing' });
    if (process.env.BLOB_ACCESS !== 'private') return sendJson(res, 200, { configured: false, error: 'BLOB_ACCESS must be private' });
    return sendJson(res, 200, { configured: true });
  } catch (error) {
    return sendJson(res, 200, { configured: false, error: error instanceof Error ? error.message : 'Unable to check storage status' });
  }
}
