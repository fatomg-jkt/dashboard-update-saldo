import { list, put } from '@vercel/blob';
import { sampleDashboardData } from '../src/lib/sampleData';
import type { DashboardData } from '../src/types';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } };
type DashboardResponse = { success: boolean; data: DashboardData; message?: string };

const BLOB_FILE = 'dashboard-saldo-data.json';
const BLOB_TIMEOUT_MS = 8000;

function sendJson(res: VercelResponse, status: number, body: DashboardResponse) {
  const response = res.status(status);
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
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

async function readDashboardData(): Promise<DashboardData> {
  const blobs = await withTimeout(list({ prefix: BLOB_FILE, limit: 10 }), 'Vercel Blob list timed out');
  const match = blobs.blobs.find((blob) => blob.pathname === BLOB_FILE);
  if (!match) return sampleDashboardData;

  const response = await withTimeout(fetch(`${match.url}?t=${Date.now()}`), 'Dashboard Blob fetch timed out');
  if (!response.ok) return sampleDashboardData;

  const payload: unknown = await withTimeout(response.json() as Promise<unknown>, 'Dashboard Blob JSON parse timed out');
  return isDashboardData(payload) ? payload : sampleDashboardData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return sendJson(res, 200, { success: false, message: 'BLOB_READ_WRITE_TOKEN missing. Configure Vercel Blob token or enable sample-data mode.', data: sampleDashboardData });
      }

      const data = await readDashboardData();
      return sendJson(res, 200, { success: true, data });
    }

    if (req.method === 'PUT') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return sendJson(res, 200, { success: false, message: 'BLOB_READ_WRITE_TOKEN missing. Data was not saved.', data: sampleDashboardData });
      }

      const payload = parseBody(req.body);
      if (!isDashboardData(payload)) return sendJson(res, 400, { success: false, message: 'Invalid dashboard data payload', data: sampleDashboardData });
      await withTimeout(put(BLOB_FILE, JSON.stringify(payload, null, 2), { access: 'public', allowOverwrite: true, contentType: 'application/json' }), 'Vercel Blob save timed out');
      return sendJson(res, 200, { success: true, data: payload });
    }

    return sendJson(res, 405, { success: false, message: 'Method not allowed', data: sampleDashboardData });
  } catch (error) {
    return sendJson(res, 200, { success: false, message: error instanceof Error ? error.message : 'Dashboard data API failed', data: sampleDashboardData });
  }
}
