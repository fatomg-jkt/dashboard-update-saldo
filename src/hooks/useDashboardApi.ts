import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DashboardData, StorageStatus } from '../types';

const REQUEST_TIMEOUT_MS = 10000;
const RESPONSE_PREVIEW_LENGTH = 200;

export type DashboardApiResponse = { success: true; data: DashboardData } | { success: false; error: string; data?: DashboardData };

type ErrorPayload = { message?: unknown; error?: unknown };

function getResponseError(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const errorPayload = payload as ErrorPayload;
    if (typeof errorPayload.error === 'string') return errorPayload.error;
    if (typeof errorPayload.message === 'string') return errorPayload.message;
  }
  return fallback;
}

function parseJson<T>(text: string, contentType: string | null): T {
  const looksJson = contentType?.toLowerCase().includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[');
  if (!looksJson) {
    throw new Error(`API returned non-JSON response: ${text.slice(0, RESPONSE_PREVIEW_LENGTH)}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    throw new Error(`API returned invalid JSON: ${message}. Response preview: ${text.slice(0, RESPONSE_PREVIEW_LENGTH)}`);
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...init, signal: init?.signal ?? controller.signal });
    const text = await response.text();
    const payload = text ? parseJson<T>(text, response.headers.get('content-type')) : ({} as T);

    if (!response.ok) {
      throw new Error(getResponseError(payload, `Request failed with status ${response.status}`));
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
