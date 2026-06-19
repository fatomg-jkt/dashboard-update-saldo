create extension if not exists pgcrypto;

create table if not exists public.balance_entries (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  entity_name text,
  account_name text not null,
  provider text not null,
  account_code text,
  category text not null,
  balance numeric not null default 0,
  notes text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.device_statuses (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  status text,
  number text,
  device text,
  notes text,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.dashboard_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_balance_entries_updated_at on public.balance_entries;
create trigger set_balance_entries_updated_at before update on public.balance_entries for each row execute function public.set_updated_at();
drop trigger if exists set_device_statuses_updated_at on public.device_statuses;
create trigger set_device_statuses_updated_at before update on public.device_statuses for each row execute function public.set_updated_at();
drop trigger if exists set_dashboard_settings_updated_at on public.dashboard_settings;
create trigger set_dashboard_settings_updated_at before update on public.dashboard_settings for each row execute function public.set_updated_at();

insert into public.dashboard_settings(key, value) values
  ('update_date', to_jsonb(current_date::text)),
  ('dashboard_title', to_jsonb('Dashboard Update Saldo All Brand'::text))
on conflict (key) do nothing;

alter table public.balance_entries enable row level security;
alter table public.device_statuses enable row level security;
alter table public.dashboard_settings enable row level security;

create policy "Public read balance entries" on public.balance_entries for select using (true);
create policy "Public write balance entries prototype" on public.balance_entries for all using (true) with check (true);
create policy "Public read device statuses" on public.device_statuses for select using (true);
create policy "Public write device statuses prototype" on public.device_statuses for all using (true) with check (true);
create policy "Public read dashboard settings" on public.dashboard_settings for select using (true);
create policy "Public write dashboard settings prototype" on public.dashboard_settings for all using (true) with check (true);
