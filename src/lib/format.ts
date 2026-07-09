import type { BalanceEntry, BrandGroup, Category, DashboardData } from '../types';

export const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
export const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
export const today = () => new Date().toISOString().slice(0, 10);
export const stamp = () => new Date().toISOString();
export const totalBalance = (entries: BalanceEntry[]) => entries.filter((entry) => entry.isActive).reduce((sum, entry) => sum + Number(entry.balance || 0), 0);
export const byCategory = (entries: BalanceEntry[]) => entries.reduce<Record<Category, number>>((acc, entry) => ({ ...acc, [entry.category]: (acc[entry.category] || 0) + entry.balance }), {} as Record<Category, number>);

const defaultBrandOrder = ['1001', 'MAISON Y', 'OBSIDIAN', 'PADEL', 'GOSE', 'BAC', 'OMG', 'PT GLOBAL SEHAT BERKARYA', 'TRIPLE EGG', 'WOK', 'HUNIAN', 'PT SEBELUM HINGGA SESUDAH'];
const brandOrderIndex = (brandName: string) => {
  const index = defaultBrandOrder.indexOf(brandName);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

export function groupBrands(entries: BalanceEntry[]): BrandGroup[] {
  const groups = new Map<string, BrandGroup>();
  entries.filter((entry) => entry.isActive).sort((a, b) => a.displayOrder - b.displayOrder).forEach((entry) => {
    const group = groups.get(entry.brandName) || { brandName: entry.brandName, brandColor: entry.brandColor, entries: [], subtotal: 0 };
    group.entries.push(entry);
    group.subtotal += entry.balance;
    groups.set(entry.brandName, group);
  });
  return [...groups.values()].sort((a, b) => brandOrderIndex(a.brandName) - brandOrderIndex(b.brandName));
}
export function withSettings(data: DashboardData): DashboardData {
  return { ...data, dashboardSettings: { ...data.dashboardSettings, updateDate: today(), lastUpdatedAt: stamp() } };
}
