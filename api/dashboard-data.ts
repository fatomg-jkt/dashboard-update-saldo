import { list, put } from '@vercel/blob';
import type { DashboardData } from '../src/types';

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } };
type DashboardResponse = { success: true; data: DashboardData } | { success: true } | { success: false; message: string };

const BLOB_FILE = 'dashboard-saldo-data.json';

const now = '2026-06-15T09:00:00.000Z';
const entry = (id: string, brandName: string, entityName: string, accountName: string, provider: string, accountCode: string, category: DashboardData['balanceEntries'][number]['category'], balance: number, displayOrder: number): DashboardData['balanceEntries'][number] => ({
  id, brandName, entityName, accountName, provider, accountCode, category, balance, notes: 'Dummy operasional untuk template management', displayOrder, isActive: true, updatedAt: now,
});
const sampleDashboardData: DashboardData = {
  balanceEntries: [
    entry('e-1001-ocbc', '1001', 'CV Sepuluh Januari Sukses', 'OCBC Operasional 1001', 'OCBC', '675', 'Bank', 90793500, 1),
    entry('e-event-mandiri', 'Event 1001', 'CV Event Seribu Satu', 'Mandiri Event', 'Mandiri', '088', 'Bank', 28650000, 2),
    entry('e-mimama-bca', 'Mimama', 'PT Mimama Laku Selalu', 'BCA Mimama', 'BCA', '221', 'Bank', 53680000, 3),
    entry('e-seribu-permata', 'Titip', 'CV Seribu Toko Sukses', 'Permata Titip', 'Permata', '443', 'Bank', 30440000, 4),
    entry('e-maison-bca', 'Maison Y', 'Maison Y', 'BCA Maison PT', 'BCA', '520', 'Bank', 80125500, 5),
    entry('e-omg-bca', 'OMG', 'OMG', 'BCA HO Jakarta', 'BCA', '999', 'Bank', 155230000, 6),
    entry('e-obsidian-bri', 'Obsidian', 'PT Prima Global Obsidian', 'BRI Obsidian', 'BRI', '778', 'Bank', 64400000, 7),
    entry('e-merch-bca', 'Merchandise', 'PT Sejuta Toko Bersama', 'BCA Merchandise', 'BCA', '610', 'Bank', 41320000, 8),
    entry('e-consign-xendit', 'Consignment', 'PT Jajan Setiap Hari', 'Jajan Settlement', 'Xendit', 'JJN', 'Payment Gateway', 11200000, 9),
    entry('e-wok-bca', 'Wok This Way', 'PT Wok This Way', 'BCA Wok', 'BCA', '340', 'Bank', 57330000, 10),
    entry('e-hunian-bca', 'Hunian', 'Hunian', 'Finance Hunian', 'BCA', '230', 'Bank', 36990000, 11),
    entry('e-gym-ocbc', 'Gym', 'PT Global Sehat Berkarya', 'OCBC Gym', 'OCBC', '411', 'Bank', 72760000, 12),
    entry('e-shs-mandiri', 'SHS', 'PT Sebelum Hingga Sesudah', 'Mandiri SHS', 'Mandiri', '312', 'Bank', 33550000, 13),
    entry('e-triple-bca', 'Triple Egg', 'Triple Egg', 'BCA Triple Egg', 'BCA', '777', 'Bank', 19770000, 14),
    entry('e-padel-permata', 'Padel', 'Padel', 'Permata Padel', 'Permata', '909', 'Bank', 48900000, 15),
  ],
  deviceStatuses: ['Online', 'Gym', 'Store', 'Finance Hunian', 'Jajan', 'Maison PT'].map((area, index) => ({
    id: `d-${index}`, area, status: index % 3 === 0 ? 'Perlu cek' : 'OK', number: `08${index + 11}`, device: index % 2 ? 'iPhone Finance' : 'Android POS', notes: index % 3 === 0 ? 'Follow up harian' : 'Aktif', displayOrder: index, updatedAt: now,
  })),
  dashboardSettings: { dashboardTitle: 'Dashboard Update Saldo All Brand', updateDate: '2026-06-15', lastUpdatedAt: now },
};

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
