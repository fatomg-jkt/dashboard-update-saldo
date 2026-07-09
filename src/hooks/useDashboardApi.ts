import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DashboardData, StorageStatus } from '../types';

const REQUEST_TIMEOUT_MS = 10000;

export type DashboardApiResponse = { success: boolean; data: DashboardData; message?: string };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...init, signal: init?.signal ?? controller.signal });
    const text = await response.text();
    const payload = text ? JSON.parse(text) as T : ({} as T);

    if (!response.ok) {
      const message = typeof payload === 'object' && payload && 'message' in payload ? String(payload.message) : text;
      throw new Error(message || `Request failed with status ${response.status}`);
    }

    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out after 10 seconds.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function useStorageStatus() {
  return useQuery({ queryKey: ['storage-status'], queryFn: () => fetchJson<StorageStatus>('/api/storage-status'), retry: 1 });
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => fetchJson<DashboardApiResponse>('/api/dashboard-data'),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useUpdateDashboardData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DashboardData) => fetchJson<DashboardApiResponse>('/api/dashboard-data', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard-data'] }),
  });
}

export function useAuthUnlock() {
  return useMutation({
    mutationFn: (password: string) => fetchJson<{ ok: boolean }>('/api/auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) }),
  });
}
