import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list, put } from '@vercel/blob';

type Category = 'Bank' | 'Payment Gateway' | 'EDC' | 'Cash' | 'Petty Cash' | 'Setoran Tunai' | 'Lainnya';
interface BalanceEntry { id: string; brand_name: string; entity_name: string | null; account_name: string; provider: string; account_code: string | null; category: Category; balance: number; notes: string | null; display_order: number; is_active: boolean; created_at?: string; updated_at?: string; }
interface DeviceStatus { id: string; area: string; status: string | null; number: string | null; device: string | null; notes: string | null; display_order: number; created_at?: string; updated_at?: string; }
interface DashboardData { balanceEntries: BalanceEntry[]; deviceStatuses: DeviceStatus[]; dashboardSettings: { update_date: string; dashboard_title: string; }; }
const pathname = 'dashboard-saldo-data.json';
const now = () => new Date().toISOString();
const id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const entry = (brand_name: string, entity_name: string, account_name: string, provider: string, account_code: string, category: Category, balance: number, display_order: number): BalanceEntry => ({ id: id(), brand_name, entity_name, account_name, provider, account_code, category, balance, notes: 'Saldo sample awal', display_order, is_active: true, created_at: now(), updated_at: now() });
function sampleData(): DashboardData { return { dashboardSettings: { update_date: new Date().toISOString().slice(0, 10), dashboard_title: 'Dashboard Update Saldo All Brand' }, balanceEntries: [entry('1001','CV Sepuluh Januari Sukses','OCBC Operasional 1001','OCBC','675','Bank',90793500,1), entry('1001','CV Sepuluh Januari Sukses','Xendit 1001','Xendit','71001','Payment Gateway',18750000,2), entry('Maison Y','Maison Y','BCA Maison PT','BCA','520','Bank',80125500,3), entry('OMG','OMG Holding','BCA HO Jakarta','BCA','999','Bank',155230000,4), entry('Padel','Padel','Permata Padel','Permata','909','Bank',48900000,5)], deviceStatuses: [{ id: id(), area: 'Online', status: 'OK', number: '0811', device: 'Android POS', notes: 'Aktif', display_order: 1, created_at: now(), updated_at: now() }, { id: id(), area: 'Finance Hunian', status: 'Perlu cek', number: '0812', device: 'iPhone Finance', notes: 'Follow up harian', display_order: 2, created_at: now(), updated_at: now() }] }; }
function hasBlobToken() { return Boolean(process.env.BLOB_READ_WRITE_TOKEN); }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!hasBlobToken()) return res.status(503).json({ code: 'BLOB_NOT_CONFIGURED', message: 'Vercel Blob belum dikonfigurasi' });
  if (req.method === 'GET') {
    const blobs = await list({ prefix: pathname, limit: 1 });
    const blob = blobs.blobs.find((item) => item.pathname === pathname);
    if (!blob) return res.status(200).json(sampleData());
    const response = await fetch(blob.url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Gagal membaca data dari Vercel Blob');
    return res.status(200).json(await response.json());
  }
  if (req.method === 'PUT') {
    const data = req.body as DashboardData;
    await put(pathname, JSON.stringify(data, null, 2), { access: 'public', contentType: 'application/json', allowOverwrite: true });
    return res.status(200).json({ ok: true });
  }
  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ message: 'Method not allowed' });
}
