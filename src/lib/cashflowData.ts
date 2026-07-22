export type StatusBudget = 'AMAN' | 'PERLU PERHATIAN' | 'OVER BUDGET' | 'TIDAK DIPROYEKSIKAN';
export type ProyeksiAktual = { departemen: string; jenisBiaya: string; kategori: string; proyeksi: number; aktual: number; catatan: string; minggu: string; tahun: number; bulan: number };
export type RekeningBank = { brand: string; perusahaan: string; bank: string; nomor: string; saldoAwal: number; masuk: number; keluar: number; saldoMinimum: number; updatedAt: string };
export type MutasiBank = { tanggal: string; bank: string; nomorRekening: string; deskripsi: string; referensi: string; debit: number; kredit: number; saldo: number; departemen: string; kategori: string; masukProyeksi: boolean; catatan: string };

export const proyeksiAktual: ProyeksiAktual[] = [
  { departemen: 'Operasional', jenisBiaya: 'Pembelian bahan baku', kategori: 'COGS', proyeksi: 42000000, aktual: 63500000, catatan: 'Harga bahan naik dan pembelian tambahan akhir pekan.', minggu: 'Minggu 1', tahun: 2026, bulan: 1 },
  { departemen: 'Marketing', jenisBiaya: 'Kampanye digital', kategori: 'Iklan', proyeksi: 18000000, aktual: 28450750, catatan: 'Boost ads melebihi rencana launching menu.', minggu: 'Minggu 2', tahun: 2026, bulan: 2 },
  { departemen: 'HR & GA', jenisBiaya: 'Lembur & casual', kategori: 'Payroll', proyeksi: 16000000, aktual: 19250000, catatan: 'Tambahan shift event.', minggu: 'Minggu 2', tahun: 2026, bulan: 2 },
  { departemen: 'Maintenance', jenisBiaya: 'Perbaikan chiller', kategori: 'Perbaikan', proyeksi: 8500000, aktual: 22200000, catatan: 'Penggantian sparepart tidak terproyeksi.', minggu: 'Minggu 3', tahun: 2026, bulan: 3 },
  { departemen: 'Finance', jenisBiaya: 'Admin bank & pajak', kategori: 'Administrasi', proyeksi: 7366000, aktual: 6420000, catatan: 'Masih dalam batas budget.', minggu: 'Minggu 3', tahun: 2026, bulan: 3 },
  { departemen: 'IT', jenisBiaya: 'POS dan software', kategori: 'Langganan', proyeksi: 12500000, aktual: 11800000, catatan: 'Renewal sesuai kontrak.', minggu: 'Minggu 4', tahun: 2026, bulan: 4 },
  { departemen: 'Logistik', jenisBiaya: 'Pengiriman outlet', kategori: 'Distribusi', proyeksi: 22000000, aktual: 34752048, catatan: 'Tambahan rute dan urgent delivery.', minggu: 'Minggu 4', tahun: 2026, bulan: 4 },
  { departemen: 'Outlet', jenisBiaya: 'Petty cash outlet', kategori: 'Operasional Outlet', proyeksi: 20000000, aktual: 20250000, catatan: 'Sedikit di atas proyeksi.', minggu: 'Minggu 1', tahun: 2026, bulan: 1 },
  { departemen: 'Legal', jenisBiaya: 'Perizinan mendadak', kategori: 'Legal', proyeksi: 0, aktual: 0, catatan: 'Belum ada realisasi.', minggu: 'Minggu 4', tahun: 2026, bulan: 4 },
];

export const rekeningBank: RekeningBank[] = [
  { brand: 'FIN_MAKAN', perusahaan: 'PT Makan Sejahtera Utama', bank: 'OCBC', nomor: '731', saldoAwal: 71000000, masuk: 68500000, keluar: 48500000, saldoMinimum: 25000000, updatedAt: '2026-07-22T08:10:00Z' },
  { brand: 'FIN_MAKAN', perusahaan: 'PT Makan Sejahtera Utama', bank: 'BCA', nomor: '822', saldoAwal: 42000000, masuk: 52500000, keluar: 61750000, saldoMinimum: 20000000, updatedAt: '2026-07-22T08:15:00Z' },
  { brand: 'FIN_MAKAN', perusahaan: 'CV Dapur Makan Bersama', bank: 'Mandiri', nomor: '305', saldoAwal: 31500000, masuk: 30000000, keluar: 28900000, saldoMinimum: 15000000, updatedAt: '2026-07-22T08:20:00Z' },
  { brand: 'FIN_MINUM', perusahaan: 'PT Minum Segar Sentosa', bank: 'OCBC', nomor: '242', saldoAwal: 36500000, masuk: 44500000, keluar: 33200000, saldoMinimum: 18000000, updatedAt: '2026-07-22T08:25:00Z' },
  { brand: 'FIN_MINUM', perusahaan: 'PT Minum Segar Sentosa', bank: 'BCA', nomor: '881', saldoAwal: 27000000, masuk: 40200000, keluar: 42500000, saldoMinimum: 17000000, updatedAt: '2026-07-22T08:30:00Z' },
  { brand: 'FIN_MINUM', perusahaan: 'CV Bar Minum Harian', bank: 'Mandiri', nomor: '347', saldoAwal: 18500000, masuk: 29739414, keluar: 24922798, saldoMinimum: 12000000, updatedAt: '2026-07-22T08:35:00Z' },
];

export const mutasiBank: MutasiBank[] = [
  { tanggal: '2026-07-01', bank: 'OCBC', nomorRekening: '731', deskripsi: 'Settlement penjualan harian', referensi: 'OC731-001', debit: 0, kredit: 28500000, saldo: 99500000, departemen: 'Outlet', kategori: 'Cash In', masukProyeksi: true, catatan: 'Valid' },
  { tanggal: '2026-07-03', bank: 'BCA', nomorRekening: '822', deskripsi: 'Pembayaran supplier ayam', referensi: 'BCA822-014', debit: 31500000, kredit: 0, saldo: 50250000, departemen: 'Operasional', kategori: 'COGS', masukProyeksi: true, catatan: 'Valid' },
  { tanggal: '2026-07-08', bank: 'Mandiri', nomorRekening: '305', deskripsi: 'Service chiller outlet', referensi: 'MD305-008', debit: 22200000, kredit: 0, saldo: 39300000, departemen: 'Maintenance', kategori: 'Perbaikan', masukProyeksi: false, catatan: 'Tidak diproyeksikan' },
  { tanggal: '2026-07-12', bank: 'OCBC', nomorRekening: '242', deskripsi: 'Settlement bar', referensi: 'OC242-021', debit: 0, kredit: 44500000, saldo: 80300000, departemen: 'Outlet', kategori: 'Cash In', masukProyeksi: true, catatan: 'Valid' },
];
