const translate = (language: 'id' | 'en', id: string, en: string) => language === 'id' ? id : en;

const downloadCsv = (filename: string, headers: string[], rows: string[][]) => {
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadMutasiTemplate = (notify: (msg: string) => void, language: 'id' | 'en') => {
  downloadCsv(
    'contoh-upload-mutasi-bank.csv',
    ['Tanggal', 'Bank', 'Nomor Rekening', 'Deskripsi Transaksi', 'Nomor Referensi', 'Debit', 'Kredit', 'Saldo', 'Departemen', 'Kategori', 'Masuk Proyeksi', 'Catatan'],
    [
      ['2026-07-01', 'OCBC', '731', 'Settlement penjualan harian', 'OC731-001', '0', '28500000', '99500000', 'Outlet', 'Cash In', 'Ya', 'Valid'],
      ['2026-07-03', 'BCA', '822', 'Pembayaran supplier ayam', 'BCA822-014', '31500000', '0', '50250000', 'Operasional', 'COGS', 'Ya', 'Debit dan kredit tidak boleh terisi bersamaan'],
      ['2026-07-08', 'Mandiri', '305', 'Service chiller outlet', 'MD305-008', '22200000', '0', '39300000', 'Maintenance', 'Perbaikan', 'Tidak', 'Tidak diproyeksikan'],
    ],
  );
  notify(translate(language, 'Contoh file upload mutasi bank berhasil diunduh.', 'Bank transaction upload template downloaded.'));
};
