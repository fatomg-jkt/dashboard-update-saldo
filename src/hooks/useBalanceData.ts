import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getSampleData } from '../lib/sampleData';
import { calculateGrandTotal, createId } from '../lib/format';
import type { BalanceEntry, BalanceState, Brand } from '../types';

export function useBalanceData() {
  const [data, setData] = useLocalStorage<BalanceState>('dashboard-update-saldo-data', getSampleData());
  const addBrand = (name: string, entityName: string) => setData(d => ({ ...d, brands: [...d.brands, { id: createId('brand'), name, entityName, color: 'from-blue-500 to-slate-700', entries: [] }] }));
  const deleteBrand = (brandId: string) => setData(d => ({ ...d, brands: d.brands.filter(b => b.id !== brandId || b.entries.length > 0) }));
  const addEntry = (brandId: string, entry: Omit<BalanceEntry, 'id'>) => setData(d => ({ ...d, brands: d.brands.map(b => b.id === brandId ? { ...b, entries: [...b.entries, { ...entry, id: createId('entry') }] } : b) }));
  const updateEntryBalance = (brandId: string, entryId: string, balance: number) => setData(d => ({ ...d, brands: d.brands.map(b => b.id === brandId ? { ...b, entries: b.entries.map(e => e.id === entryId ? { ...e, balance } : e) } : b) }));
  const deleteEntry = (brandId: string, entryId: string) => setData(d => ({ ...d, brands: d.brands.map(b => b.id === brandId ? { ...b, entries: b.entries.filter(e => e.id !== entryId) } : b) }));
  const importData = (incoming: BalanceState) => setData(incoming);
  const resetSample = () => setData(getSampleData());
  const updateDate = (recapDate: string) => setData(d => ({ ...d, recapDate }));
  const summary = useMemo(() => ({ total: calculateGrandTotal(data.brands), brandCount: data.brands.length, entryCount: data.brands.reduce((s, b) => s + b.entries.length, 0) }), [data.brands]);
  return { data, setData, summary, addBrand, deleteBrand, addEntry, updateEntryBalance, deleteEntry, importData, resetSample, updateDate };
}
