import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DashboardData, StorageStatus } from '../types';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

export function useStorageStatus() {
  return useQuery({ queryKey: ['storage-status'], queryFn: () => fetchJson<StorageStatus>('/api/storage-status') });
}

export function useDashboardData(enabled: boolean) {
  return useQuery({ queryKey: ['dashboard-data'], queryFn: () => fetchJson<DashboardData>('/api/dashboard-data'), enabled });
}

export function useUpdateDashboardData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DashboardData) => fetchJson<{ success: boolean }>('/api/dashboard-data', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard-data'] }),
  });
}

export function useAuthUnlock() {
  return useMutation({
    mutationFn: (password: string) => fetchJson<{ ok: boolean }>('/api/auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) }),
  });
}
