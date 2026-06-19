type JsonResponse = { configured: true } | { configured: false; message: string } | { configured: false; message: string; error: string };

function sendJson(res: { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } }, status: number, body: JsonResponse) {
  const response = res.status(status);
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(body));
}

export default function handler(_req: unknown, res: { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } }) {
  try {
    return sendJson(res, 200, process.env.BLOB_READ_WRITE_TOKEN ? { configured: true } : { configured: false, message: 'BLOB_READ_WRITE_TOKEN missing' });
  } catch (error) {
    return sendJson(res, 200, { configured: false, message: 'Unable to check storage status', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
