import type { Brand } from '../types';

export const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
export const formatTanggalIndonesia = (isoDate: string) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${isoDate}T00:00:00`));
export const calculateBrandSubtotal = (brand: Brand) => brand.entries.reduce((sum, entry) => sum + entry.balance, 0);
export const calculateGrandTotal = (brands: Brand[]) => brands.reduce((sum, brand) => sum + calculateBrandSubtotal(brand), 0);
export const createId = (prefix = 'id') => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`;
