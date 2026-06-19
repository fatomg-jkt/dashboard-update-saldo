import { list, put } from '@vercel/blob';
import { sampleDashboardData } from '../src/lib/sampleData';
import type { DashboardData } from '../src/types';

export const BLOB_FILE = 'dashboard-saldo-data.json';
export { sampleDashboardData };

export function hasBlobToken() { return Boolean(process.env.BLOB_READ_WRITE_TOKEN); }
export function sendJson(res: any, status: number, body: unknown) { res.status(status).setHeader('content-type', 'application/json'); res.end(JSON.stringify(body)); }
export function isDashboardData(payload: unknown): payload is DashboardData {
  const data = payload as DashboardData;
  return Boolean(data && Array.isArray(data.balanceEntries) && Array.isArray(data.deviceStatuses) && data.dashboardSettings?.dashboardTitle);
}
export async function readDashboardData(): Promise<DashboardData> {
  if (!hasBlobToken()) return sampleDashboardData;
  const blobs = await list({ prefix: BLOB_FILE, limit: 1 });
  const match = blobs.blobs.find((blob) => blob.pathname === BLOB_FILE);
  if (!match) return sampleDashboardData;
  const response = await fetch(`${match.url}?t=${Date.now()}`);
  if (!response.ok) return sampleDashboardData;
  const data: unknown = await response.json();
  return isDashboardData(data) ? data : sampleDashboardData;
}
export async function writeDashboardData(data: DashboardData) {
  return put(BLOB_FILE, JSON.stringify(data, null, 2), { access: 'public', allowOverwrite: true, contentType: 'application/json' });
}
