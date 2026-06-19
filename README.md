# Dashboard Update Saldo All Brand

Aplikasi dashboard finance internal untuk rekap saldo harian semua brand/entity OMG. UI dibuat seperti spreadsheet finance: block per brand, tabel rekening, subtotal, total besar **TOTAL ALL REK**, checklist device, filter, serta import/export JSON.

## Install

```bash
npm install
```

## Run local

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy ke Vercel

- Framework Preset: **Vite**
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

## Struktur fitur

- Dashboard rekap saldo dengan tanggal update format Indonesia.
- Card/block compact per brand/entity dengan warna header berbeda.
- Tambah brand, tambah rekening, edit saldo, hapus rekening, hapus brand jika kosong.
- Subtotal per brand dan grand total **TOTAL ALL REK**.
- Search berdasarkan brand, rekening, bank/provider, nomor/kode, dan kategori.
- Filter kategori dan brand/entity.
- Checklist / Device Monitoring di sisi kanan.
- Reset ke sample data, Export JSON, dan Import JSON.

## Catatan storage

Versi awal menyimpan seluruh data di `localStorage`, sehingga data tetap tersedia setelah browser refresh pada perangkat/browser yang sama. Data sample adalah dummy realistis dan tidak memakai data sensitif asli.
