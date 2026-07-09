import type { DashboardData } from '../src/types';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } };
type DashboardResponse = { success: true; data: DashboardData } | { success: false; error: string; data?: DashboardData };

const BLOB_FILE = 'dashboard-saldo-data.json';
const BLOB_TIMEOUT_MS = 8000;

function sendJson(res: VercelResponse, status: number, body: DashboardResponse) {
  const response = res.status(status);
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

async function getSampleDashboardData(): Promise<DashboardData> {
  const module = await import('../src/lib/sampleData');
  return module.sampleDashboardData;
}

function parseBody(body: unknown): unknown {
  if (typeof body === 'string') return JSON.parse(body || '{}');
  return body;
}

function isDashboardData(payload: unknown): payload is DashboardData {
  const data = payload as DashboardData;
  return Boolean(data && Array.isArray(data.balanceEntries) && Array.isArray(data.deviceStatuses) && data.dashboardSettings && typeof data.dashboardSettings === 'object');
}

async function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), BLOB_TIMEOUT_MS);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function readDashboardData(sampleData: DashboardData): Promise<DashboardData> {
  try {
    const { list } = await import('@vercel/blob');
    const blobs = await withTimeout(list({ prefix: BLOB_FILE, limit: 10 }), 'Vercel Blob list timed out');
    const match = blobs.blobs.find((blob) => blob.pathname === BLOB_FILE);
    if (!match) return sampleData;

    const response = await withTimeout(fetch(`${match.url}?t=${Date.now()}`), 'Dashboard Blob fetch timed out');
    if (!response.ok) return sampleData;

    const text = await withTimeout(response.text(), 'Dashboard Blob response read timed out');
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      return sampleData;
    }

    return isDashboardData(payload) ? payload : sampleData;
  } catch {
    return sampleData;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sampleData = await getSampleDashboardData();

    if (req.method === 'GET') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return sendJson(res, 200, { success: false, error: 'BLOB_READ_WRITE_TOKEN missing', data: sampleData });
      }

      const data = await readDashboardData(sampleData);
      return sendJson(res, 200, { success: true, data });
    }

    if (req.method === 'PUT') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return sendJson(res, 200, { success: false, error: 'BLOB_READ_WRITE_TOKEN missing. Data was not saved.', data: sampleData });
      }

      const payload = parseBody(req.body);
      if (!isDashboardData(payload)) return sendJson(res, 400, { success: false, error: 'Invalid dashboard data payload', data: sampleData });

      const { put } = await import('@vercel/blob');
      await withTimeout(put(BLOB_FILE, JSON.stringify(payload, null, 2), { access: 'public', allowOverwrite: true, contentType: 'application/json' }), 'Vercel Blob save timed out');
      return sendJson(res, 200, { success: true, data: payload });
    }

    return sendJson(res, 405, { success: false, error: 'Method not allowed', data: sampleData });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dashboard data API failed';
    const emptyData: DashboardData = { balanceEntries: [], deviceStatuses: [], dashboardSettings: { dashboardTitle: 'Dashboard Update Saldo All Brand', updateDate: new Date().toISOString().slice(0, 10), lastUpdatedAt: new Date().toISOString() } };
    return sendJson(res, 200, { success: false, error: message, data: emptyData });
  }
}
