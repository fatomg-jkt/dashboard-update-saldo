export type Category = 'Bank' | 'Payment Gateway' | 'EDC' | 'Cash' | 'Petty Cash' | 'Setoran Tunai' | 'Lainnya';

export interface BalanceEntry {
  id: string;
  brandName: string;
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
}

export interface DeviceStatus {
  id: string;
  area: string;
  status: string;
  number?: string;
  device?: string;
  notes?: string;
  displayOrder: number;
  updatedAt: string;
}

export interface DashboardSettings {
  dashboardTitle: string;
  updateDate: string;
  lastUpdatedAt: string;
}

export interface DashboardData {
  balanceEntries: BalanceEntry[];
  deviceStatuses: DeviceStatus[];
  dashboardSettings: DashboardSettings;
}

export interface StorageStatus { configured: boolean; message?: string }
export interface BrandGroup { brandName: string; entityName?: string; entries: BalanceEntry[]; subtotal: number }
export const categories: Category[] = ['Bank', 'Payment Gateway', 'EDC', 'Cash', 'Petty Cash', 'Setoran Tunai', 'Lainnya'];
