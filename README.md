# Dashboard Update Saldo All Brand

Dashboard finance internal berbasis Vite + React + TypeScript + TanStack Router + TanStack Query + Tailwind. Data utama disimpan online sebagai satu file JSON di **Vercel Blob** melalui API route serverless, bukan `localStorage` browser.

## Setup Vercel Blob

1. Buka project di Vercel.
2. Masuk ke menu **Storage**.
3. Klik **Create Database / Create Blob** dan pilih **Blob**.
4. Hubungkan Blob store ke project dashboard ini.
5. Pastikan Environment Variable `BLOB_READ_WRITE_TOKEN` otomatis tersedia di project.
6. Tambahkan Environment Variable admin:

```bash
ADMIN_PASSWORD=fatmanage
```

7. Redeploy project setelah Blob dan env dibuat.

Jika dashboard menampilkan **“Vercel Blob belum dikonfigurasi”**, artinya serverless API belum menerima `BLOB_READ_WRITE_TOKEN`. Periksa kembali Storage/Environment Variables di Vercel lalu redeploy.

## Cara kerja storage

- Frontend tidak akses Blob langsung.
- Frontend call API route `/api/dashboard-data`.
- API route membaca/menulis file Blob: `dashboard-saldo-data.json`.
- Struktur file JSON:
  - `balanceEntries`
  - `deviceStatuses`
  - `dashboardSettings`
- Jika file belum ada, API mengembalikan sample data awal.
- Saat ada perubahan saldo/device/settings, API overwrite file Blob dengan `allowOverwrite: true`.

## Edit Mode

- Default dashboard adalah View Mode/read-only untuk management.
- Klik **Unlock Edit Mode** untuk membuka fitur finance admin.
- Password dicek lewat `/api/auth` memakai `ADMIN_PASSWORD`.
- Untuk development, default password adalah `fatmanage` jika `ADMIN_PASSWORD` belum diset.
- Status Edit Mode disimpan di `sessionStorage` saja.

## Run local

```bash
npm install
npm run dev
```

Untuk local yang benar-benar memakai Blob, jalankan lewat Vercel CLI atau set `BLOB_READ_WRITE_TOKEN` di environment lokal.

## Build

```bash
npm run build
```

## Deploy ke Vercel

- Framework Preset: **Vite**
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Required env:
  - `BLOB_READ_WRITE_TOKEN`
  - `ADMIN_PASSWORD=fatmanage`

## Fitur utama

- Overview executive dengan hero metric Total All Rekening.
- Tab `Overview`, `Brand Details`, dan `Device Status`.
- Inline update saldo dan notes di Brand Details saat Edit Mode aktif.
- Quick Update Saldo Hari Ini untuk update banyak rekening sekaligus.
- Tambah/hapus rekening dan edit device status hanya saat Edit Mode aktif.
- Tidak ada Import JSON, Export JSON, atau halaman Data Management terpisah.
