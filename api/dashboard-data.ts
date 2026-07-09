type Category = 'Bank' | 'Payment Gateway' | 'EDC' | 'Cash' | 'Petty Cash' | 'Setoran Tunai' | 'Lainnya';

type BalanceEntry = {
  id: string;
  brandName: string;
  brandColor?: string;
  groupName?: string;
  entityName?: string;
  accountName: string;
  provider: string;
  accountCode?: string;
  category: Category;
  balance: number;
  notes?: string;
  displayOrder: number;
  isActive: boolean;
  updatedAt: string;
};

type DeviceStatus = {
  id: string;
  area: string;
  status: string;
  number?: string;
  device?: string;
  notes?: string;
  displayOrder: number;
  updatedAt: string;
};

type DashboardData = {
  balanceEntries: BalanceEntry[];
  deviceStatuses: DeviceStatus[];
  dashboardSettings: {
    dashboardTitle: string;
    updateDate: string;
    lastUpdatedAt: string;
  };
};

type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = { status: (code: number) => { setHeader: (name: string, value: string) => void; end: (body: string) => void } };
type DashboardResponse = { success: true; data: DashboardData } | { success: false; error: string; data?: DashboardData };

const BLOB_FILE = 'dashboard-saldo-data.json';
const BLOB_TIMEOUT_MS = 8000;
const now = '2026-06-15T09:00:00.000Z';

const sampleDashboardData: DashboardData = {
  balanceEntries: [
    { id: 'sample-1001-bca', brandName: '1001', brandColor: 'pink', groupName: 'Online', entityName: 'CV Sepuluh Januari Sukses', accountName: 'BCA 71001', provider: 'BCA', accountCode: '71001', category: 'Bank', balance: 0, notes: 'Sample data otomatis', displayOrder: 1, isActive: true, updatedAt: now },
    { id: 'sample-1001-xendit', brandName: '1001', brandColor: 'pink', groupName: 'Online', entityName: 'CV Sepuluh Januari Sukses', accountName: 'Xendit', provider: 'Xendit', accountCode: '', category: 'Payment Gateway', balance: 0, notes: 'Sample data otomatis', displayOrder: 2, isActive: true, updatedAt: now },
    { id: 'sample-obsidian-cash', brandName: 'OBSIDIAN', brandColor: 'black', accountName: 'Daily Cash (Setor Tunai)', provider: 'Daily', accountCode: '', category: 'Setoran Tunai', balance: 0, notes: 'Sample data otomatis', displayOrder: 3, isActive: true, updatedAt: now },
  ],
  deviceStatuses: [
    { id: 'sample-device-online', area: 'Online', status: 'OK', number: '0811', device: 'Sample Device', notes: 'Sample data otomatis', displayOrder: 1, updatedAt: now },
    { id: 'sample-device-store', area: 'Store', status: 'Perlu cek', number: '0812', device: 'Sample POS', notes: 'Sample data otomatis', displayOrder: 2, updatedAt: now },
  ],
  dashboardSettings: { dashboardTitle: 'Dashboard Update Saldo All Brand', updateDate: '2026-06-15', lastUpdatedAt: now },
};

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

async function readDashboardData(): Promise<{ data: DashboardData; error?: string }> {
  try {
    const { list } = await import('@vercel/blob');
    const blobs = await withTimeout(list({ prefix: BLOB_FILE, limit: 10 }), 'Vercel Blob list timed out');
    const match = blobs.blobs.find((blob) => blob.pathname === BLOB_FILE);
    if (!match) return { data: sampleDashboardData };

    const response = await withTimeout(fetch(`${match.url}?t=${Date.now()}`), 'Dashboard Blob fetch timed out');
    if (!response.ok) return { data: sampleDashboardData, error: `Dashboard Blob fetch failed with status ${response.status}` };

    const text = await withTimeout(response.text(), 'Dashboard Blob response read timed out');
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      return { data: sampleDashboardData, error: 'Dashboard Blob returned invalid JSON' };
    }

    return isDashboardData(payload) ? { data: payload } : { data: sampleDashboardData, error: 'Dashboard Blob JSON has invalid dashboard shape' };
  } catch (error) {
    return { data: sampleDashboardData, error: error instanceof Error ? error.message : 'Vercel Blob read failed' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return sendJson(res, 200, { success: false, error: 'BLOB_READ_WRITE_TOKEN missing', data: sampleDashboardData });
      }

      const result = await readDashboardData();
      if (result.error) return sendJson(res, 200, { success: false, error: result.error, data: result.data });
      return sendJson(res, 200, { success: true, data: result.data });
    }

    if (req.method === 'PUT') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return sendJson(res, 200, { success: false, error: 'BLOB_READ_WRITE_TOKEN missing. Data was not saved.', data: sampleDashboardData });
      }

      const payload = parseBody(req.body);
      if (!isDashboardData(payload)) return sendJson(res, 400, { success: false, error: 'Invalid dashboard data payload', data: sampleDashboardData });

      const { put } = await import('@vercel/blob');
      await withTimeout(put(BLOB_FILE, JSON.stringify(payload, null, 2), { access: 'public', allowOverwrite: true, contentType: 'application/json' }), 'Vercel Blob save timed out');
      return sendJson(res, 200, { success: true, data: payload });
    }

    return sendJson(res, 405, { success: false, error: 'Method not allowed', data: sampleDashboardData });
  } catch (error) {
    return sendJson(res, 200, { success: false, error: error instanceof Error ? error.message : 'Dashboard data API failed', data: sampleDashboardData });
  }
}
