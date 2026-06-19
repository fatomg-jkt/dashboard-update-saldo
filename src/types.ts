export type Category = 'Bank' | 'Payment Gateway' | 'EDC' | 'Cash' | 'Petty Cash' | 'Setoran Tunai' | 'Lainnya';
export interface BalanceEntry { id: string; brand_name: string; entity_name: string | null; account_name: string; provider: string; account_code: string | null; category: Category; balance: number; notes: string | null; display_order: number; is_active: boolean; created_at?: string; updated_at?: string; }
export interface DeviceStatus { id: string; area: string; status: string | null; number: string | null; device: string | null; notes: string | null; display_order: number; created_at?: string; updated_at?: string; }
export interface DashboardSettings { update_date: string; dashboard_title: string; }
export interface DashboardData { balanceEntries: BalanceEntry[]; deviceStatuses: DeviceStatus[]; dashboardSettings: DashboardSettings; }
export interface FiltersState { search: string; category: 'Semua' | Category; sort: 'desc' | 'asc'; }
export const categories: Category[] = ['Bank','Payment Gateway','EDC','Cash','Petty Cash','Setoran Tunai','Lainnya'];
