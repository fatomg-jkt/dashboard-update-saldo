import { useMemo, useState } from 'react';
import { useBalanceData } from '../hooks/useBalanceData';
import type { FiltersState } from '../types';
import { Header } from './Header';
import { Filters } from './Filters';
import { BrandBalanceCard } from './BrandBalanceCard';
import { BalanceEntryForm } from './BalanceEntryForm';
import { TotalAllRekCard } from './TotalAllRekCard';
import { DeviceStatusTable } from './DeviceStatusTable';
import { ImportExportPanel } from './ImportExportPanel';
import { BalanceEntryTable } from './BalanceEntryTable';

export function BalanceDashboard() {
  const { data, summary, addBrand, deleteBrand, addEntry, updateEntryBalance, deleteEntry, importData, resetSample, updateDate } = useBalanceData();
  const [filters,setFilters]=useState<FiltersState>({search:'',category:'Semua',brandId:'Semua'});
  const filteredBrands = useMemo(()=> data.brands.map(b=>({ ...b, entries: b.entries.filter(e=> {
    const haystack = `${b.name} ${b.entityName} ${e.name} ${e.provider} ${e.accountNumber} ${e.category}`.toLowerCase();
    return (!filters.search || haystack.includes(filters.search.toLowerCase())) && (filters.category==='Semua' || e.category===filters.category) && (filters.brandId==='Semua' || b.id===filters.brandId);
  })})).filter(b=> b.entries.length || (filters.brandId !== 'Semua' && b.id===filters.brandId)), [data.brands, filters]);
  return <main className="min-h-screen p-4 lg:p-6"><div className="mx-auto max-w-[1800px] space-y-4"><Header date={data.recapDate} total={summary.total} brandCount={summary.brandCount} entryCount={summary.entryCount} onDateChange={updateDate}/><ImportExportPanel data={data} onImport={importData} onReset={resetSample}/><BalanceEntryForm brands={data.brands} onAddBrand={addBrand} onAddEntry={addEntry}/><Filters filters={filters} brands={data.brands} onChange={setFilters} onReset={()=>setFilters({search:'',category:'Semua',brandId:'Semua'})}/><div className="grid gap-4 xl:grid-cols-[1fr_420px]"><div className="space-y-4"><TotalAllRekCard total={summary.total}/><div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{filteredBrands.map(brand=><BrandBalanceCard key={brand.id} brand={brand} onBalanceChange={(entryId,balance)=>updateEntryBalance(brand.id,entryId,balance)} onDeleteEntry={entryId=>deleteEntry(brand.id,entryId)} onDeleteBrand={()=>deleteBrand(brand.id)}/>)}</div></div><div className="space-y-4"><DeviceStatusTable rows={data.deviceStatuses}/><BalanceEntryTable brands={filteredBrands}/></div></div></div></main>;
}
