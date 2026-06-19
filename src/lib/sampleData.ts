import type { Category, DashboardData } from '../types';

const now = '2026-06-15T09:00:00.000Z';
const makeEntry = (id: string, brandName: string, entityName: string, accountName: string, provider: string, accountCode: string, category: Category, balance: number, displayOrder: number) => ({
  id, brandName, entityName, accountName, provider, accountCode, category, balance, notes: 'Dummy operasional untuk template management', displayOrder, isActive: true, updatedAt: now,
});

export const sampleDashboardData: DashboardData = {
  balanceEntries: [
    makeEntry('e-1001-ocbc', '1001', 'CV Sepuluh Januari Sukses', 'OCBC Operasional 1001', 'OCBC', '675', 'Bank', 90793500, 1),
    makeEntry('e-1001-bca', '1001', 'CV Sepuluh Januari Sukses', 'BCA Marketplace', 'BCA', '503', 'Bank', 42500000, 2),
    makeEntry('e-1001-xendit', '1001', 'CV Sepuluh Januari Sukses', 'Xendit 1001', 'Xendit', '71001', 'Payment Gateway', 18750000, 3),
    makeEntry('e-1001-pc', '1001', 'CV Sepuluh Januari Sukses', 'Petty Cash Store', 'Petty Cash', 'PC-01', 'Petty Cash', 3500000, 4),
    makeEntry('e-event-mandiri', 'Event 1001', 'CV Event Seribu Satu', 'Mandiri Event', 'Mandiri', '088', 'Bank', 28650000, 5),
    makeEntry('e-event-edc', 'Event 1001', 'CV Event Seribu Satu', 'EDC Event', 'EDC', 'EDC-17', 'EDC', 7750000, 6),
    makeEntry('e-mimama-bca', 'Mimama', 'PT Mimama Laku Selalu', 'BCA Mimama', 'BCA', '221', 'Bank', 53680000, 7),
    makeEntry('e-mimama-cash', 'Mimama', 'PT Mimama Laku Selalu', 'Cash Mimama', 'Cash', 'CASH-MM', 'Cash', 6150000, 8),
    makeEntry('e-seribu-permata', 'Titip', 'CV Seribu Toko Sukses', 'Permata Titip', 'Permata', '443', 'Bank', 30440000, 9),
    makeEntry('e-seribu-setoran', 'Titip', 'CV Seribu Toko Sukses', 'Setoran Tunai Titip', 'Setoran Tunai', 'ST-09', 'Setoran Tunai', 9900000, 10),
    makeEntry('e-maison-bca', 'Maison Y', 'Maison Y', 'BCA Maison PT', 'BCA', '520', 'Bank', 80125500, 11),
    makeEntry('e-maison-ocbc', 'Maison Y', 'Maison Y', 'OCBC Maison CV', 'OCBC', '521', 'Bank', 38750000, 12),
    makeEntry('e-omg-bca', 'OMG', 'OMG', 'BCA HO Jakarta', 'BCA', '999', 'Bank', 155230000, 13),
    makeEntry('e-obsidian-bri', 'Obsidian', 'PT Prima Global Obsidian', 'BRI Obsidian', 'BRI', '778', 'Bank', 64400000, 14),
    makeEntry('e-merch-bca', 'Merchandise', 'PT Sejuta Toko Bersama', 'BCA Merchandise', 'BCA', '610', 'Bank', 41320000, 15),
    makeEntry('e-consign-xendit', 'Consignment', 'PT Jajan Setiap Hari', 'Jajan Settlement', 'Xendit', 'JJN', 'Payment Gateway', 11200000, 16),
    makeEntry('e-wok-bca', 'Wok This Way', 'PT Wok This Way', 'BCA Wok', 'BCA', '340', 'Bank', 57330000, 17),
    makeEntry('e-hunian-bca', 'Hunian', 'Hunian', 'Finance Hunian', 'BCA', '230', 'Bank', 36990000, 18),
    makeEntry('e-gym-ocbc', 'Gym', 'PT Global Sehat Berkarya', 'OCBC Gym', 'OCBC', '411', 'Bank', 72760000, 19),
    makeEntry('e-shs-mandiri', 'SHS', 'PT Sebelum Hingga Sesudah', 'Mandiri SHS', 'Mandiri', '312', 'Bank', 33550000, 20),
    makeEntry('e-triple-bca', 'Triple Egg', 'Triple Egg', 'BCA Triple Egg', 'BCA', '777', 'Bank', 19770000, 21),
    makeEntry('e-padel-permata', 'Padel', 'Padel', 'Permata Padel', 'Permata', '909', 'Bank', 48900000, 22),
  ],
  deviceStatuses: ['Online', 'Gym', 'Store', 'Finance Hunian', 'Jajan', 'Maison PT', 'Maison CV', 'Tax HO Jakarta', 'HRD HO Jakarta', 'CS Maison'].map((area, index) => ({
    id: `d-${index}`, area, status: index % 3 === 0 ? 'Perlu cek' : 'OK', number: `08${index + 11}`, device: index % 2 ? 'iPhone Finance' : 'Android POS', notes: index % 3 === 0 ? 'Follow up harian' : 'Aktif', displayOrder: index, updatedAt: now,
  })),
  dashboardSettings: { dashboardTitle: 'Dashboard Update Saldo All Brand', updateDate: '2026-06-15', lastUpdatedAt: now },
};
