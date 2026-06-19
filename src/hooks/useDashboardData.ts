import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BalanceEntry, DashboardData, DashboardSettings, DeviceStatus } from '../types';

export const queryKeys = { dashboardData: ['dashboard-data'] as const };

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message ?? 'Request gagal') as Error & { code?: string };
    error.code = payload?.code;
    throw error;
  }
  return payload as T;
}

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard-data', { cache: 'no-store' });
  return parseResponse<DashboardData>(response);
}

async function saveDashboardData(data: DashboardData): Promise<DashboardData> {
  const response = await fetch('/api/dashboard-data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  await parseResponse<{ ok: boolean }>(response);
  return data;
}

export function useDashboardData() { return useQuery({ queryKey: queryKeys.dashboardData, queryFn: fetchDashboardData }); }
function useSaveDashboardData() { const qc = useQueryClient(); return useMutation({ mutationFn: saveDashboardData, onSuccess: (data) => qc.setQueryData(queryKeys.dashboardData, data) }); }
function withTimestamp<T extends { updated_at?: string }>(value: T): T { return { ...value, updated_at: new Date().toISOString() }; }

export function useCreateBalanceEntry() { const save = useSaveDashboardData(); const qc = useQueryClient(); return useMutation({ mutationFn: async (entry: BalanceEntry) => { const current = qc.getQueryData<DashboardData>(queryKeys.dashboardData); if (!current) throw new Error('Data dashboard belum siap'); await save.mutateAsync({ ...current, balanceEntries: [...current.balanceEntries, entry] }); return entry; } }); }
export function useUpdateBalanceEntry() { const save = useSaveDashboardData(); const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, values }: { id: string; values: Partial<BalanceEntry> }) => { const current = qc.getQueryData<DashboardData>(queryKeys.dashboardData); if (!current) throw new Error('Data dashboard belum siap'); let updated: BalanceEntry | undefined; const balanceEntries = current.balanceEntries.map((entry) => entry.id === id ? (updated = withTimestamp({ ...entry, ...values })) : entry); if (!updated) throw new Error('Rekening tidak ditemukan'); await save.mutateAsync({ ...current, balanceEntries }); return updated; } }); }
export function useDeleteBalanceEntry() { const save = useSaveDashboardData(); const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const current = qc.getQueryData<DashboardData>(queryKeys.dashboardData); if (!current) throw new Error('Data dashboard belum siap'); await save.mutateAsync({ ...current, balanceEntries: current.balanceEntries.filter((entry) => entry.id !== id) }); } }); }

export function useCreateDeviceStatus() { const save = useSaveDashboardData(); const qc = useQueryClient(); return useMutation({ mutationFn: async (row: DeviceStatus) => { const current = qc.getQueryData<DashboardData>(queryKeys.dashboardData); if (!current) throw new Error('Data dashboard belum siap'); await save.mutateAsync({ ...current, deviceStatuses: [...current.deviceStatuses, row] }); return row; } }); }
export function useUpdateDeviceStatus() { const save = useSaveDashboardData(); const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, values }: { id: string; values: Partial<DeviceStatus> }) => { const current = qc.getQueryData<DashboardData>(queryKeys.dashboardData); if (!current) throw new Error('Data dashboard belum siap'); let updated: DeviceStatus | undefined; const deviceStatuses = current.deviceStatuses.map((row) => row.id === id ? (updated = withTimestamp({ ...row, ...values })) : row); if (!updated) throw new Error('Device status tidak ditemukan'); await save.mutateAsync({ ...current, deviceStatuses }); return updated; } }); }
export function useDeleteDeviceStatus() { const save = useSaveDashboardData(); const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const current = qc.getQueryData<DashboardData>(queryKeys.dashboardData); if (!current) throw new Error('Data dashboard belum siap'); await save.mutateAsync({ ...current, deviceStatuses: current.deviceStatuses.filter((row) => row.id !== id) }); } }); }

export function useUpdateDashboardSettings() { const save = useSaveDashboardData(); const qc = useQueryClient(); return useMutation({ mutationFn: async (values: Partial<DashboardSettings>) => { const current = qc.getQueryData<DashboardData>(queryKeys.dashboardData); if (!current) throw new Error('Data dashboard belum siap'); const dashboardSettings = { ...current.dashboardSettings, ...values }; await save.mutateAsync({ ...current, dashboardSettings }); return dashboardSettings; } }); }

export async function verifyAdminPassword(password: string): Promise<void> {
  const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
  await parseResponse<{ ok: true }>(response);
}
