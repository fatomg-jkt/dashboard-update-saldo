import { list, put } from '@vercel/blob';
import { sampleDashboardData } from '../src/lib/sampleData';
import type { DashboardData } from '../src/types';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } };
type DashboardResponse = { success: true; data: DashboardData } | { success: true } | { success: false; message: string };

const BLOB_FILE = 'dashboard-saldo-data.json';

function sendJson(res: VercelResponse, status: number, body: DashboardResponse) {
  const response = res.status(status);
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(body));
}

function parseBody(body: unknown): unknown {
  if (typeof body === 'string') return JSON.parse(body || '{}');
  return body;
}

function isDashboardData(payload: unknown): payload is DashboardData {
  const data = payload as DashboardData;
  return Boolean(data && Array.isArray(data.balanceEntries) && Array.isArray(data.deviceStatuses) && data.dashboardSettings && typeof data.dashboardSettings.dashboardTitle === 'string');
}

async function readDashboardData(): Promise<DashboardData> {
  const blobs = await list({ prefix: BLOB_FILE, limit: 10 });
  const match = blobs.blobs.find((blob) => blob.pathname === BLOB_FILE);
  if (!match) return sampleDashboardData;

  const response = await fetch(`${match.url}?t=${Date.now()}`);
  if (!response.ok) return sampleDashboardData;

  const payload: unknown = await response.json();
  return isDashboardData(payload) ? payload : sampleDashboardData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const data = process.env.BLOB_READ_WRITE_TOKEN ? await readDashboardData() : sampleDashboardData;
      return sendJson(res, 200, { success: true, data });
    }

    if (req.method === 'PUT') {
      const payload = parseBody(req.body);
      if (!isDashboardData(payload)) return sendJson(res, 400, { success: false, message: 'Invalid dashboard data payload' });
      await put(BLOB_FILE, JSON.stringify(payload, null, 2), { access: 'public', allowOverwrite: true, contentType: 'application/json' });
      return sendJson(res, 200, { success: true });
    }

    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  } catch (error) {
    return sendJson(res, 500, { success: false, message: error instanceof Error ? error.message : 'Dashboard data API failed' });
  }
}
