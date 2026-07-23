import { useEffect, useMemo, useState } from 'react';
import { useAuthUnlock, useDashboardData, useStorageStatus, useUpdateDashboardData } from '../hooks/useDashboardApi';
import { sampleDashboardData } from '../lib/sampleData';
import type { BalanceEntry, DashboardData, DeviceStatus } from '../types';
import { categories } from '../types';

const rupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const dateFmt = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(value));
const timeFmt = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const brandTone: Record<string, string> = { pink: 'from-pink-500 to-rose-500', fuchsia: 'from-fuchsia-500 to-purple-500', black: 'from-zinc-800 to-black', orange: 'from-orange-400 to-amber-500', purple: 'from-violet-500 to-purple-700', blue: 'from-blue-500 to-cyan-500', gray: 'from-slate-500 to-slate-700', 'dark-gray': 'from-zinc-600 to-stone-800', green: 'from-emerald-500 to-lime-500', red: 'from-red-500 to-orange-600', 'light-yellow': 'from-yellow-300 to-amber-400', 'dark-green': 'from-green-700 to-emerald-900' };

type GroupedBrand = { name: string; color?: string; total: number; entries: BalanceEntry[]; categories: Record<string, number> };

const getTotal = (entries: BalanceEntry[]) => entries.filter((e) => e.isActive).reduce((sum, entry) => sum + entry.balance, 0);
const emptyEntry = (order: number): BalanceEntry => ({ id: `entry-${Date.now()}`, brandName: 'BRAND BARU', accountName: 'BCA 000', provider: 'BCA', category: 'Bank', balance: 0, displayOrder: order, isActive: true, updatedAt: new Date().toISOString() });

function groupBrands(entries: BalanceEntry[]): GroupedBrand[] {
  const map = new Map<string, GroupedBrand>();
  entries.filter((entry) => entry.isActive).sort((a, b) => a.displayOrder - b.displayOrder).forEach((entry) => {
    const current = map.get(entry.brandName) ?? { name: entry.brandName, color: entry.brandColor, total: 0, entries: [], categories: {} };
    current.total += entry.balance;
    current.entries.push(entry);
    current.categories[entry.category] = (current.categories[entry.category] ?? 0) + entry.balance;
    map.set(entry.brandName, current);
  });
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export function BalanceDashboard() {
  const storageStatus = useStorageStatus();
  const dashboardQuery = useDashboardData();
  const updateDashboard = useUpdateDashboardData();
  const unlock = useAuthUnlock();
  const [data, setData] = useState<DashboardData>(sampleDashboardData);
  const [selectedBrand, setSelectedBrand] = useState('Semua Brand');
  const [category, setCategory] = useState('Semua Kategori');
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(() => sessionStorage.getItem('saldo-edit-mode') === 'true');
  const [toast, setToast] = useState('');

  useEffect(() => { if (dashboardQuery.data?.success) setData(dashboardQuery.data.data); }, [dashboardQuery.data]);
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(''), 2400); };
  const brands = useMemo(() => groupBrands(data.balanceEntries), [data.balanceEntries]);
  const selectedEntries = useMemo(() => data.balanceEntries.filter((entry) => (selectedBrand === 'Semua Brand' || entry.brandName === selectedBrand) && (category === 'Semua Kategori' || entry.category === category) && `${entry.brandName} ${entry.accountName} ${entry.entityName ?? ''}`.toLowerCase().includes(search.toLowerCase())), [data.balanceEntries, selectedBrand, category, search]);
  const total = getTotal(selectedEntries);
  const topBrands = brands.slice(0, 5);
  const categoryTotals = categories.map((cat) => ({ cat, total: getTotal(data.balanceEntries.filter((entry) => entry.category === cat)) })).filter((row) => row.total > 0);
  const save = (next: DashboardData) => { setData(next); updateDashboard.mutate(next, { onSuccess: () => notify('Data berhasil disimpan ke dashboard.'), onError: (error) => notify(error instanceof Error ? error.message : 'Gagal menyimpan data.') }); };
  const unlockEdit = () => unlock.mutate(password, { onSuccess: () => { sessionStorage.setItem('saldo-edit-mode', 'true'); setEditMode(true); setPassword(''); notify('Edit mode aktif.'); }, onError: () => notify('Password salah atau API auth tidak tersedia.') });
  const updateEntry = (id: string, patch: Partial<BalanceEntry>) => save({ ...data, balanceEntries: data.balanceEntries.map((entry) => entry.id === id ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry), dashboardSettings: { ...data.dashboardSettings, lastUpdatedAt: new Date().toISOString() } });
  const updateDevice = (id: string, patch: Partial<DeviceStatus>) => save({ ...data, deviceStatuses: data.deviceStatuses.map((device) => device.id === id ? { ...device, ...patch, updatedAt: new Date().toISOString() } : device), dashboardSettings: { ...data.dashboardSettings, lastUpdatedAt: new Date().toISOString() } });
  const addEntry = () => save({ ...data, balanceEntries: [...data.balanceEntries, emptyEntry(data.balanceEntries.length + 1)] });

  if (storageStatus.data && !storageStatus.data.configured) return <SetupScreen error={storageStatus.data.error} />;

  return <main className="min-h-screen bg-[#f4f7fb] text-slate-900">
    {toast && <div className="fixed right-5 top-5 z-50 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-2xl">{toast}</div>}
    <section className="mx-auto max-w-[1500px] p-4 md:p-8">
      <header className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-2xl md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">Finance Live Dashboard</p><h1 className="mt-3 text-4xl font-black md:text-6xl">{data.dashboardSettings.dashboardTitle}</h1><p className="mt-3 text-slate-300">Update saldo semua brand per {dateFmt(data.dashboardSettings.updateDate)} · terakhir sinkron {timeFmt(data.dashboardSettings.lastUpdatedAt)}</p></div><div className="rounded-3xl bg-white/10 p-5 backdrop-blur"><p className="text-sm text-slate-300">Total All Rekening</p><p className="mt-2 text-3xl font-black text-cyan-200">{rupiah(total)}</p></div></div>
      </header>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_380px]"><section className="space-y-5"><Filters brands={brands.map((b) => b.name)} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} category={category} setCategory={setCategory} search={search} setSearch={setSearch} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Stat label="Rekening Aktif" value={String(selectedEntries.filter((e)=>e.isActive).length)} /><Stat label="Brand" value={String(brands.length)} /><Stat label="Device OK" value={`${data.deviceStatuses.filter((d)=>d.status.toLowerCase().includes('ok')).length}/${data.deviceStatuses.length}`} /><Stat label="Kategori" value={String(categoryTotals.length)} /></div>
        <div className="grid gap-4 xl:grid-cols-2">{(selectedBrand === 'Semua Brand' ? brands : brands.filter((b)=>b.name===selectedBrand)).map((brand) => <BrandCard key={brand.name} brand={brand} editMode={editMode} onUpdate={updateEntry} />)}</div>
      </section><aside className="space-y-5"><EditPanel editMode={editMode} password={password} setPassword={setPassword} unlockEdit={unlockEdit} addEntry={addEntry} saving={updateDashboard.isPending || unlock.isPending} /><SummaryPanel topBrands={topBrands} categoryTotals={categoryTotals} total={getTotal(data.balanceEntries)} /><DevicePanel devices={data.deviceStatuses} editMode={editMode} onUpdate={updateDevice} /></aside></div>
    </section>
  </main>;
}
function SetupScreen({ error }: { error?: string }) { return <div className="grid min-h-screen place-items-center bg-slate-100 p-6"><div className="max-w-xl rounded-[2rem] bg-white p-8 shadow-xl"><h1 className="text-3xl font-black">Vercel Blob belum dikonfigurasi</h1><p className="mt-3 text-slate-600">Tambahkan BLOB_READ_WRITE_TOKEN dan ADMIN_PASSWORD di Vercel Environment Variables, lalu redeploy.</p>{error && <pre className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</pre>}</div></div> }
function Filters(props: { brands: string[]; selectedBrand: string; setSelectedBrand: (v:string)=>void; category: string; setCategory:(v:string)=>void; search:string; setSearch:(v:string)=>void }) { return <div className="grid gap-3 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-3"><select className="input" value={props.selectedBrand} onChange={(e)=>props.setSelectedBrand(e.target.value)}><option>Semua Brand</option>{props.brands.map((brand)=><option key={brand}>{brand}</option>)}</select><select className="input" value={props.category} onChange={(e)=>props.setCategory(e.target.value)}><option>Semua Kategori</option>{categories.map((cat)=><option key={cat}>{cat}</option>)}</select><input className="input" placeholder="Cari rekening, entity, brand..." value={props.search} onChange={(e)=>props.setSearch(e.target.value)} /></div> }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div> }
function BrandCard({ brand, editMode, onUpdate }: { brand: GroupedBrand; editMode: boolean; onUpdate: (id:string, patch:Partial<BalanceEntry>)=>void }) { return <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-200"><div className={`bg-gradient-to-r ${brandTone[brand.color ?? 'blue'] ?? brandTone.blue} p-5 text-white`}><p className="text-sm uppercase tracking-[0.25em] opacity-80">Brand</p><div className="flex items-end justify-between gap-4"><h2 className="text-3xl font-black">{brand.name}</h2><b>{rupiah(brand.total)}</b></div></div><div className="divide-y divide-slate-100">{brand.entries.map((entry)=><div key={entry.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto]"><div><p className="font-bold">{entry.accountName}</p><p className="text-sm text-slate-500">{entry.entityName ?? entry.groupName ?? entry.category} · {entry.provider}</p></div>{editMode ? <input className="input w-44 text-right" type="number" value={entry.balance} onChange={(e)=>onUpdate(entry.id,{ balance: Number(e.target.value) })} /> : <p className="font-black">{rupiah(entry.balance)}</p>}</div>)}</div></article> }
function EditPanel({ editMode, password, setPassword, unlockEdit, addEntry, saving }: { editMode:boolean; password:string; setPassword:(v:string)=>void; unlockEdit:()=>void; addEntry:()=>void; saving:boolean }) { return <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="text-xl font-black">Mode Management</h3>{editMode ? <><p className="mt-2 text-sm text-emerald-700">Edit mode aktif untuk sesi browser ini.</p><button className="btn mt-4 w-full" onClick={addEntry}>Tambah Rekening</button></> : <div className="mt-4 flex gap-2"><input className="input min-w-0 flex-1" type="password" placeholder="Password admin" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="btn" disabled={saving} onClick={unlockEdit}>Unlock</button></div>}</div> }
function SummaryPanel({ topBrands, categoryTotals, total }: { topBrands: GroupedBrand[]; categoryTotals: {cat:string; total:number}[]; total:number }) { return <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="text-xl font-black">Executive Summary</h3><div className="mt-4 space-y-3">{topBrands.map((brand)=><Bar key={brand.name} label={brand.name} value={brand.total} total={total} />)}</div><h4 className="mt-6 font-bold">Breakdown Kategori</h4><div className="mt-3 space-y-2">{categoryTotals.map((row)=><Bar key={row.cat} label={row.cat} value={row.total} total={total} />)}</div></div> }
function Bar({ label, value, total }: { label:string; value:number; total:number }) { const pct = total ? Math.round((value / total) * 100) : 0; return <div><div className="mb-1 flex justify-between text-sm"><span>{label}</span><b>{rupiah(value)}</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.max(4, pct)}%` }} /></div></div> }
function DevicePanel({ devices, editMode, onUpdate }: { devices: DeviceStatus[]; editMode:boolean; onUpdate:(id:string, patch:Partial<DeviceStatus>)=>void }) { return <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="text-xl font-black">Device Status</h3><div className="mt-4 space-y-3">{devices.map((device)=><div key={device.id} className="rounded-2xl bg-slate-50 p-3"><div className="flex items-center justify-between"><b>{device.area}</b><span className={`rounded-full px-3 py-1 text-xs font-bold ${device.status.toLowerCase().includes('ok') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{device.status}</span></div><p className="mt-1 text-sm text-slate-500">{device.device} · {device.number}</p>{editMode && <input className="input mt-3 w-full" value={device.notes ?? ''} onChange={(e)=>onUpdate(device.id,{ notes:e.target.value })} />}</div>)}</div></div> }
