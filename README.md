# Dashboard Update Saldo All Brand

Dashboard finance internal berbasis Vite + React + TypeScript + TanStack Router + TanStack Query + Tailwind. Data utama sekarang disimpan di Supabase, bukan lagi `localStorage` browser.

## Setup Supabase

1. Buat project Supabase baru.
2. Buka SQL Editor di Supabase.
3. Jalankan isi file `docs/supabase-schema.sql` untuk membuat tabel:
   - `balance_entries`
   - `device_statuses`
   - `dashboard_settings`
4. Opsional untuk demo/prototype: jalankan `docs/seed-sample-data.sql`.

Schema sudah menyertakan trigger `updated_at`, seed setting awal untuk `update_date` dan `dashboard_title`, serta RLS policy prototype: public read dan public write. Write tetap hanya ditampilkan di app setelah Edit Mode di-unlock, namun ini bukan security production.

## Environment variables lokal

Buat file `.env`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Ambil nilainya dari Supabase Project Settings > API.

## Environment variables di Vercel

Di Vercel Project Settings > Environment Variables, tambahkan:

```bash
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Redeploy setelah variable disimpan.

## Install dan run

```bash
npm install
npm run dev
npm run build
```

## Fitur utama

- Executive Overview dengan hero metric Total All Rekening.
- Tab `Overview`, `Brand Details`, dan `Device Status`.
- Read-only View Mode default untuk management.
- Edit Mode untuk finance admin dengan tombol `Unlock Edit Mode`.
- Password Edit Mode: `fatmanage`.
- Status Edit Mode disimpan di `sessionStorage`, sehingga tidak permanen lintas sesi browser.
- Inline update saldo dan notes di Brand Details.
- Modal `Update Saldo Hari Ini` untuk update cepat seluruh rekening.
- CRUD rekening dan device status hanya muncul saat Edit Mode aktif.
- Banner migrasi `localStorage` lama ke Supabase hanya muncul saat Edit Mode aktif.
- Import JSON, Export JSON, dan tombol reset sample data dihapus dari UI utama.

## Catatan keamanan

Password frontend `fatmanage` hanya proteksi ringan untuk prototype internal. Karena anon key dan policy prototype masih mengizinkan write, gunakan Supabase Auth, server-side API, atau policy berbasis role sebelum dipakai sebagai sistem production.
