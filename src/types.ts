export type Category = 'Bank' | 'Payment Gateway' | 'EDC' | 'Cash' | 'Petty Cash' | 'Setoran Tunai' | 'Lainnya';
export interface BalanceEntry { id: string; brand_name: string; entity_name: string | null; account_name: string; provider: string; account_code: string | null; category: Category; balance: number; notes: string | null; display_order: number; is_active: boolean; created_at?: string; updated_at?: string; }
export interface DeviceStatus { id: string; area: string; status: string | null; number: string | null; device: string | null; notes: string | null; display_order: number; created_at?: string; updated_at?: string; }
export interface DashboardSetting { key: 'update_date' | 'dashboard_title' | string; value: unknown; updated_at?: string; }
export interface BrandGroup { name: string; entityName: string; entries: BalanceEntry[]; subtotal: number; }
export interface FiltersState { search: string; category: 'Semua' | Category; sort: 'desc' | 'asc'; }
export const categories: Category[] = ['Bank','Payment Gateway','EDC','Cash','Petty Cash','Setoran Tunai','Lainnya'];

// Legacy localStorage shapes retained only for one-time migration helpers and unused older components.
export interface LegacyBalanceEntry { id: string; name: string; provider: string; accountNumber: string; category: Category; balance: number; note: string; }
export interface Brand { id: string; name: string; entityName: string; color: string; entries: LegacyBalanceEntry[]; }
export interface BalanceState { recapDate: string; brands: Brand[]; deviceStatuses: { id: string; area: string; status: string; number: string; device: string; note: string; }[]; }
