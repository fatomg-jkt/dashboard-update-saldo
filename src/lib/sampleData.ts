import type { BalanceState, Brand, DeviceStatus } from '../types';

const entry = (name: string, provider: string, accountNumber: string, category: Brand['entries'][number]['category'], balance: number, note = 'Saldo dummy operasional') => ({ id: crypto.randomUUID(), name, provider, accountNumber, category, balance, note });

export const sampleBrands: Brand[] = [
  { id: 'b-1001', name: '1001', entityName: 'CV Sepuluh Januari Sukses', color: 'from-rose-500 to-pink-600', entries: [entry('OCBC Operasional 1001','OCBC','675','Bank',90793500),entry('BCA Marketplace','BCA','503','Bank',42500000),entry('Xendit 1001','Xendit','71001','Payment Gateway',18750000),entry('Petty Cash Store','Petty Cash','PC-01','Petty Cash',3500000)] },
  { id: 'b-event-1001', name: 'Event', entityName: 'CV Event Seribu Satu', color: 'from-orange-500 to-amber-600', entries: [entry('Mandiri Event','Mandiri','088','Bank',28650000),entry('EDC Event','EDC','EDC-17','EDC',7750000)] },
  { id: 'b-mimama', name: 'Mimama', entityName: 'PT Mimama Laku Selalu', color: 'from-fuchsia-500 to-purple-600', entries: [entry('BCA Mimama','BCA','221','Bank',53680000),entry('Cash Mimama','Cash','CASH-MM','Cash',6150000)] },
  { id: 'b-seribu-toko', name: 'Titip', entityName: 'CV Seribu Toko Sukses', color: 'from-sky-500 to-blue-600', entries: [entry('Permata Titip','Permata','443','Bank',30440000),entry('Setoran Tunai Titip','Setoran Tunai','ST-09','Setoran Tunai',9900000)] },
  { id: 'b-maison', name: 'Maison Y', entityName: 'Maison Y', color: 'from-pink-600 to-fuchsia-700', entries: [entry('BCA Maison PT','BCA','520','Bank',80125500),entry('OCBC Maison CV','OCBC','521','Bank',38750000),entry('EDC Maison','EDC','MY-EDC','EDC',12600000)] },
  { id: 'b-omg', name: 'OMG', entityName: 'OMG Holding', color: 'from-zinc-700 to-black', entries: [entry('BCA HO Jakarta','BCA','999','Bank',155230000),entry('Petty Cash HO','Petty Cash','HO-PC','Petty Cash',8750000)] },
  { id: 'b-obsidian', name: 'Obsidian', entityName: 'PT Prima Global Obsidian', color: 'from-slate-600 to-slate-900', entries: [entry('BRI Obsidian','BRI','778','Bank',64400000),entry('Xendit Obsidian','Xendit','71008','Payment Gateway',21340000)] },
  { id: 'b-merch', name: 'Merchandise', entityName: 'PT Sejuta Toko Bersama', color: 'from-emerald-500 to-green-700', entries: [entry('BCA Merchandise','BCA','610','Bank',41320000),entry('Cash Merch Booth','Cash','BOOTH','Cash',4550000)] },
  { id: 'b-consign', name: 'Consignment', entityName: 'PT Jajan Setiap Hari', color: 'from-lime-500 to-teal-600', entries: [entry('Mandiri Consignment','Mandiri','119','Bank',29650000),entry('Jajan Settlement','Xendit','JJN','Payment Gateway',11200000)] },
  { id: 'b-wok', name: 'Wok', entityName: 'PT Wok This Way', color: 'from-red-600 to-red-800', entries: [entry('BCA Wok','BCA','340','Bank',57330000),entry('EDC Wok Store','EDC','WOK-3','EDC',8400000)] },
  { id: 'b-hunian', name: 'Hunian', entityName: 'Hunian', color: 'from-yellow-400 to-orange-500', entries: [entry('Finance Hunian','BCA','230','Bank',36990000),entry('Setoran Hunian','Setoran Tunai','H-ST','Setoran Tunai',5200000)] },
  { id: 'b-gym', name: 'GSB / Gym', entityName: 'PT Global Sehat Berkarya', color: 'from-cyan-500 to-blue-700', entries: [entry('OCBC Gym','OCBC','411','Bank',72760000),entry('EDC Gym','EDC','GYM-2','EDC',14900000)] },
  { id: 'b-shs', name: 'SHS', entityName: 'PT Sebelum Hingga Sesudah', color: 'from-indigo-500 to-violet-700', entries: [entry('Mandiri SHS','Mandiri','312','Bank',33550000)] },
  { id: 'b-triple', name: 'Triple Egg', entityName: 'Triple Egg', color: 'from-amber-400 to-yellow-600', entries: [entry('BCA Triple Egg','BCA','777','Bank',19770000)] },
  { id: 'b-padel', name: 'Padel', entityName: 'Padel', color: 'from-teal-500 to-emerald-700', entries: [entry('Permata Padel','Permata','909','Bank',48900000),entry('Cash Court','Cash','COURT','Cash',2700000)] },
];

export const sampleDeviceStatuses: DeviceStatus[] = ['Online','Gym','Store','Finance Hunian','Jajan','Maison PT','Maison CV','Tax HO Jakarta','HRD HO Jakarta','CS Maison'].map((area, index) => ({ id: `d-${index}`, area, status: index % 3 === 0 ? 'Perlu cek' : 'OK', number: `08${index + 11}`, device: index % 2 ? 'iPhone Finance' : 'Android POS', note: index % 3 === 0 ? 'Follow up harian' : 'Aktif' }));

export const getSampleData = (): BalanceState => ({ recapDate: '2026-06-15', brands: sampleBrands, deviceStatuses: sampleDeviceStatuses });
