export type Category = 'Bank' | 'Payment Gateway' | 'EDC' | 'Cash' | 'Petty Cash' | 'Setoran Tunai' | 'Lainnya';

export interface BalanceEntry { id: string; name: string; provider: string; accountNumber: string; category: Category; balance: number; note: string; }
export interface Brand { id: string; name: string; entityName: string; color: string; entries: BalanceEntry[]; }
export interface DeviceStatus { id: string; area: string; status: string; number: string; device: string; note: string; }
export interface BalanceState { recapDate: string; brands: Brand[]; deviceStatuses: DeviceStatus[]; }
export interface FiltersState { search: string; category: 'Semua' | Category; brandId: 'Semua' | string; }
export const categories: Category[] = ['Bank','Payment Gateway','EDC','Cash','Petty Cash','Setoran Tunai','Lainnya'];
