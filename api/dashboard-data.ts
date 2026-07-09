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
let order = 1;

const brandColors: Record<string, string> = {
  '1001': 'pink',
  'MAISON Y': 'fuchsia',
  OBSIDIAN: 'black',
  PADEL: 'orange',
  GOSE: 'purple',
  BAC: 'blue',
  OMG: 'gray',
  'PT GLOBAL SEHAT BERKARYA': 'dark-gray',
  'TRIPLE EGG': 'green',
  WOK: 'red',
  HUNIAN: 'light-yellow',
  'PT SEBELUM HINGGA SESUDAH': 'dark-green',
};

function inferProvider(accountName: string): string {
  return accountName.split(' ')[0];
}

function inferCategory(accountName: string): Category {
  const lower = accountName.toLowerCase();
  if (lower.includes('xendit')) return 'Payment Gateway';
  if (lower.includes('edc')) return 'EDC';
  if (lower.includes('cash')) return 'Petty Cash';
  if (lower.includes('setor') || lower.includes('setoran')) return 'Setoran Tunai';
  return 'Bank';
}

function account(id: string, brandName: string, accountName: string, groupName?: string, entityName?: string, balance = 0): BalanceEntry {
  return {
    id,
    brandName,
    brandColor: brandColors[brandName],
    groupName,
    entityName,
    accountName,
    provider: inferProvider(accountName),
    accountCode: accountName.match(/(\d+)(?!.*\d)/)?.[1] ?? '',
    category: inferCategory(accountName),
    balance,
    notes: '',
    displayOrder: order++,
    isActive: true,
    updatedAt: now,
  };
}

const sampleDashboardData: DashboardData = {
  balanceEntries: [
    account('e-1001-online-ocbc-675', '1001', 'OCBC 675', 'Online', 'CV Sepuluh Januari Sukses'),
    account('e-1001-online-bca-71001', '1001', 'BCA 71001', 'Online', 'CV Sepuluh Januari Sukses'),
    account('e-1001-online-xendit', '1001', 'Xendit', 'Online', 'CV Sepuluh Januari Sukses'),
    account('e-1001-event-bca-81001', '1001', 'BCA 81001', 'Event', 'CV Event Seribu Satu'),
    account('e-1001-event-bri-563', '1001', 'BRI 563', 'Event', 'CV Event Seribu Satu'),
    account('e-1001-store-ocbc-697', '1001', 'OCBC 697', 'Store', 'PT Mimama Laku Selalu'),
    account('e-1001-store-bca-edc-61001', '1001', 'BCA EDC 61001', 'Store', 'PT Mimama Laku Selalu'),
    account('e-1001-prive-bca-1000', '1001', 'BCA 1000', 'Prive', 'CV Seribu Toko Sukses'),
    account('e-1001-prive-xendit', '1001', 'Xendit', 'Prive', 'CV Seribu Toko Sukses'),
    account('e-maison-y-bca-001', 'MAISON Y', 'BCA MAISON Y 001'),
    account('e-maison-y-xendit', 'MAISON Y', 'Xendit'),
    account('e-obsidian-pgo-bca-100', 'OBSIDIAN', 'BCA 100', undefined, 'PT Prima Global Obsidian'),
    account('e-obsidian-pgo-ocbc-210', 'OBSIDIAN', 'OCBC 210', undefined, 'PT Prima Global Obsidian'),
    account('e-obsidian-pgo-permata-690', 'OBSIDIAN', 'Permata 690', undefined, 'PT Prima Global Obsidian'),
    account('e-obsidian-pgo-mandiri-541', 'OBSIDIAN', 'Mandiri 541', undefined, 'PT Prima Global Obsidian'),
    account('e-obsidian-stb-bca-295', 'OBSIDIAN', 'BCA 295', undefined, 'PT Sejuta Toko Bersama'),
    account('e-obsidian-stb-mandiri-130', 'OBSIDIAN', 'Mandiri 130', undefined, 'PT Sejuta Toko Bersama'),
    account('e-obsidian-daily-cash', 'OBSIDIAN', 'Daily Cash (Setor Tunai)'),
    account('e-obsidian-cash-merchandise', 'OBSIDIAN', 'Cash Merchandise'),
    account('e-obsidian-cash-fitness', 'OBSIDIAN', 'Cash Fitness Studio'),
    account('e-obsidian-titip-ocbc-arthur', 'OBSIDIAN', 'OCBC Pak Arthur', 'Titip'),
    account('e-obsidian-titip-bca-arthur-889', 'OBSIDIAN', 'BCA Pak Arthur 889', 'Titip'),
    account('e-padel-ocbc-pt-padel-184', 'PADEL', 'OCBC PT Padel 184'),
    account('e-padel-ocbc-uma-connor-252', 'PADEL', 'OCBC Uma-Connor 252'),
    account('e-gose-bca-uma-503', 'GOSE', 'BCA Uma 503 Non PKP'),
    account('e-gose-bca-cv-pantes-009', 'GOSE', 'BCA CV Pantes 009 PKP'),
    account('e-gose-bca-uma-347', 'GOSE', 'BCA Uma 347 Petty Cash'),
    account('e-bac-bca-672', 'BAC', 'BCA CV BEFORE AFTER 672'),
    account('e-bac-ocbc-135', 'BAC', 'OCBC CV BEFORE AFTER 135'),
    account('e-bac-xendit', 'BAC', 'Xendit'),
    account('e-omg-ocbc-283', 'OMG', 'OCBC CV OMG 283'),
    account('e-omg-bca-666', 'OMG', 'BCA CV OMG 666'),
    account('e-gsb-bca-442', 'PT GLOBAL SEHAT BERKARYA', 'BCA GSB 442'),
    account('e-gsb-ocbc-964', 'PT GLOBAL SEHAT BERKARYA', 'OCBC GSB 964'),
    account('e-triple-egg-resto-bca-822', 'TRIPLE EGG', 'BCA 822', 'Resto', 'PT Makan Setiap Hari'),
    account('e-triple-egg-resto-ocbc-731', 'TRIPLE EGG', 'OCBC 731', 'Resto', 'PT Makan Setiap Hari'),
    account('e-triple-egg-resto-mandiri', 'TRIPLE EGG', 'Mandiri', 'Resto', 'PT Makan Setiap Hari'),
    account('e-triple-egg-bar-bca-811', 'TRIPLE EGG', 'BCA 811', 'Bar', 'PT Minum Setiap Hari'),
    account('e-triple-egg-bar-ocbc-242', 'TRIPLE EGG', 'OCBC 242', 'Bar', 'PT Minum Setiap Hari'),
    account('e-triple-egg-bar-mandiri', 'TRIPLE EGG', 'Mandiri', 'Bar', 'PT Minum Setiap Hari'),
    account('e-triple-egg-consignment-bca-921', 'TRIPLE EGG', 'BCA 921', 'Consignment', 'PT Jajan Setiap Hari'),
    account('e-triple-egg-setoran-tunai-bca-882', 'TRIPLE EGG', 'BCA 882', 'Setoran Tunai'),
    account('e-triple-egg-petty-cash-bca-4000', 'TRIPLE EGG', 'BCA 4000', 'Petty Cash'),
    account('e-wok-bca-edc', 'WOK', 'PT Wok This Way BCA EDC'),
    account('e-wok-grab-gojek-bca-932', 'WOK', 'Rek Grab Gojek BCA 932'),
    account('e-wok-setoran-bca-001', 'WOK', 'Rek Setoran BCA 001'),
    account('e-wok-ocbc-060', 'WOK', 'OCBC Wok This Way 060'),
    account('e-wok-mandiri-667', 'WOK', 'Mandiri 667'),
    account('e-wok-petty-cash-uma-bca-999', 'WOK', 'Petty Cash Uma BCA 999'),
    account('e-wok-petty-cash-uma-bca-331-new', 'WOK', 'Petty Cash Uma BCA 331 (New)'),
    account('e-hunian-bca-ohs-088', 'HUNIAN', 'BCA OHS 088'),
    account('e-hunian-permata-ohs-534', 'HUNIAN', 'PERMATA OHS 534'),
    account('e-shs-bca-889', 'PT SEBELUM HINGGA SESUDAH', 'BCA SHS 889'),
  ],
  deviceStatuses: ['Online', 'Gym', 'Store', 'Finance Hunian', 'Jajan', 'Maison PT', 'Maison CV', 'Tax HO Jakarta', 'HRD HO Jakarta', 'CS Maison'].map((area, index) => ({
    id: `d-${index}`,
    area,
    status: index % 3 === 0 ? 'Perlu cek' : 'OK',
    number: `08${index + 11}`,
    device: index % 2 ? 'iPhone Finance' : 'Android POS',
    notes: index % 3 === 0 ? 'Follow up harian' : 'Aktif',
    displayOrder: index,
    updatedAt: now,
  })),
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
