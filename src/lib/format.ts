import type { BalanceEntry, BrandGroup, Category, DashboardData } from '../types';

export const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
export const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
export const today = () => new Date().toISOString().slice(0, 10);
export const stamp = () => new Date().toISOString();
export const totalBalance = (entries: BalanceEntry[]) => entries.filter((entry) => entry.isActive).reduce((sum, entry) => sum + Number(entry.balance || 0), 0);
export const byCategory = (entries: BalanceEntry[]) => entries.reduce<Record<Category, number>>((acc, entry) => ({ ...acc, [entry.category]: (acc[entry.category] || 0) + entry.balance }), {} as Record<Category, number>);
export function groupBrands(entries: BalanceEntry[]): BrandGroup[] {
  const groups = new Map<string, BrandGroup>();
  entries.filter((entry) => entry.isActive).sort((a, b) => a.displayOrder - b.displayOrder).forEach((entry) => {
    const key = `${entry.brandName}__${entry.entityName || ''}`;
    const group = groups.get(key) || { brandName: entry.brandName, entityName: entry.entityName, entries: [], subtotal: 0 };
    group.entries.push(entry); group.subtotal += entry.balance; groups.set(key, group);
  });
  return [...groups.values()];
}
export function withSettings(data: DashboardData): DashboardData {
  return { ...data, dashboardSettings: { ...data.dashboardSettings, updateDate: today(), lastUpdatedAt: stamp() } };
}
