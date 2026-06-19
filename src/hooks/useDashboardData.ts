import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { BalanceEntry, DeviceStatus, DashboardSetting } from '../types';

type BalanceInput = Omit<Partial<BalanceEntry>, 'id' | 'created_at' | 'updated_at'>;
type DeviceInput = Omit<Partial<DeviceStatus>, 'id' | 'created_at' | 'updated_at'>;
const requireDb = () => { if (!supabase) throw new Error('Supabase belum dikonfigurasi'); return supabase; };
const throwIf = (error: { message: string } | null) => { if (error) throw new Error(error.message); };

export const queryKeys = { balances: ['balance_entries'] as const, devices: ['device_statuses'] as const, settings: ['dashboard_settings'] as const };

export function useBalanceEntries() { return useQuery({ queryKey: queryKeys.balances, queryFn: async () => { const { data, error } = await requireDb().from('balance_entries').select('*').eq('is_active', true).order('display_order').order('brand_name'); throwIf(error); return (data ?? []) as BalanceEntry[]; }, enabled: Boolean(supabase) }); }
export function useCreateBalanceEntry() { const qc = useQueryClient(); return useMutation({ mutationFn: async (values: BalanceInput) => { const { data, error } = await requireDb().from('balance_entries').insert(values).select('*').single(); throwIf(error); return data as BalanceEntry; }, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.balances }) }); }
export function useUpdateBalanceEntry() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, values }: { id: string; values: BalanceInput }) => { const { data, error } = await requireDb().from('balance_entries').update(values).eq('id', id).select('*').single(); throwIf(error); return data as BalanceEntry; }, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.balances }) }); }
export function useDeleteBalanceEntry() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await requireDb().from('balance_entries').delete().eq('id', id); throwIf(error); }, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.balances }) }); }

export function useDeviceStatuses() { return useQuery({ queryKey: queryKeys.devices, queryFn: async () => { const { data, error } = await requireDb().from('device_statuses').select('*').order('display_order').order('area'); throwIf(error); return (data ?? []) as DeviceStatus[]; }, enabled: Boolean(supabase) }); }
export function useCreateDeviceStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: async (values: DeviceInput) => { const { data, error } = await requireDb().from('device_statuses').insert(values).select('*').single(); throwIf(error); return data as DeviceStatus; }, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.devices }) }); }
export function useUpdateDeviceStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, values }: { id: string; values: DeviceInput }) => { const { data, error } = await requireDb().from('device_statuses').update(values).eq('id', id).select('*').single(); throwIf(error); return data as DeviceStatus; }, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.devices }) }); }
export function useDeleteDeviceStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await requireDb().from('device_statuses').delete().eq('id', id); throwIf(error); }, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.devices }) }); }

export function useDashboardSettings() { return useQuery({ queryKey: queryKeys.settings, queryFn: async () => { const { data, error } = await requireDb().from('dashboard_settings').select('*'); throwIf(error); return (data ?? []) as DashboardSetting[]; }, enabled: Boolean(supabase) }); }
export function useUpdateDashboardSetting() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ key, value }: { key: string; value: unknown }) => { const { data, error } = await requireDb().from('dashboard_settings').upsert({ key, value, updated_at: new Date().toISOString() }).select('*').single(); throwIf(error); return data as DashboardSetting; }, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.settings }) }); }
