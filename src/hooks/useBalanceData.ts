import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getSampleData } from '../lib/sampleData';
import { calculateGrandTotal, createId } from '../lib/format';
import type { BalanceEntry, BalanceState, Brand } from '../types';

interface BalanceSummary {
  total: number;
  brandCount: number;
  entryCount: number;
}

export function useBalanceData() {
  const [data, setData] = useLocalStorage<BalanceState>('dashboard-update-saldo-data', getSampleData());

  const addBrand = (name: string, entityName: string) => {
    setData((currentData: BalanceState): BalanceState => ({
      ...currentData,
      brands: [
        ...currentData.brands,
        { id: createId('brand'), name, entityName, color: 'from-blue-500 to-slate-700', entries: [] },
      ],
    }));
  };

  const deleteBrand = (brandId: string) => {
    setData((currentData: BalanceState): BalanceState => ({
      ...currentData,
      brands: currentData.brands.filter((brand: Brand) => brand.id !== brandId || brand.entries.length > 0),
    }));
  };

  const addEntry = (brandId: string, entry: Omit<BalanceEntry, 'id'>) => {
    setData((currentData: BalanceState): BalanceState => ({
      ...currentData,
      brands: currentData.brands.map((brand: Brand) =>
        brand.id === brandId
          ? { ...brand, entries: [...brand.entries, { ...entry, id: createId('entry') }] }
          : brand,
      ),
    }));
  };

  const updateEntryBalance = (brandId: string, entryId: string, balance: number) => {
    setData((currentData: BalanceState): BalanceState => ({
      ...currentData,
      brands: currentData.brands.map((brand: Brand) =>
        brand.id === brandId
          ? {
              ...brand,
              entries: brand.entries.map((entry: BalanceEntry) =>
                entry.id === entryId ? { ...entry, balance } : entry,
              ),
            }
          : brand,
      ),
    }));
  };

  const deleteEntry = (brandId: string, entryId: string) => {
    setData((currentData: BalanceState): BalanceState => ({
      ...currentData,
      brands: currentData.brands.map((brand: Brand) =>
        brand.id === brandId
          ? { ...brand, entries: brand.entries.filter((entry: BalanceEntry) => entry.id !== entryId) }
          : brand,
      ),
    }));
  };

  const importData = (incoming: BalanceState) => setData(incoming);
  const resetSample = () => setData(getSampleData());
  const updateDate = (recapDate: string) => {
    setData((currentData: BalanceState): BalanceState => ({ ...currentData, recapDate }));
  };

  const summary = useMemo<BalanceSummary>(
    () => ({
      total: calculateGrandTotal(data.brands),
      brandCount: data.brands.length,
      entryCount: data.brands.reduce((sum: number, brand: Brand) => sum + brand.entries.length, 0),
    }),
    [data.brands],
  );

  return { data, setData, summary, addBrand, deleteBrand, addEntry, updateEntryBalance, deleteEntry, importData, resetSample, updateDate };
}
