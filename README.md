# Dashboard Update Saldo All Brand

Dashboard finance executive-friendly untuk monitoring saldo seluruh brand/entity. Aplikasi berjalan dengan Vite + React + TypeScript + TanStack Router + TanStack Query + Tailwind CSS, dan menyimpan data online melalui **Vercel Blob** via serverless API routes.

## Arsitektur Storage

- Data utama disimpan sebagai satu file JSON di Vercel Blob: `dashboard-saldo-data.json`.
- Frontend **tidak pernah** membaca `BLOB_READ_WRITE_TOKEN`.
- Semua read/write Blob dilakukan melalui API routes di folder `api/`:
  - `GET /api/storage-status`
  - `GET /api/dashboard-data`
  - `PUT /api/dashboard-data`
  - `POST /api/auth`
- Jika file Blob belum ada, API mengembalikan sample data realistis agar dashboard tetap tampil normal.
- Setup screen hanya muncul jika `/api/storage-status` mengembalikan `configured: false`.

## Environment Variables Vercel

Set di Vercel Project Settings → Environment Variables:

```bash
BLOB_READ_WRITE_TOKEN=<token dari Vercel Blob>
ADMIN_PASSWORD=fatmanage
```

> Penting: `BLOB_READ_WRITE_TOKEN` adalah server-side secret. Jangan gunakan nama `VITE_BLOB_READ_WRITE_TOKEN`, jangan expose token ke client, dan jangan cek token Blob dari `import.meta.env`.

## Fitur Utama

- Default read-only untuk management/direktur.
- Unlock edit mode dengan password `fatmanage` melalui `/api/auth`.
- Status edit mode disimpan di `sessionStorage` hanya selama sesi browser.
- Update saldo inline langsung di Brand Details.
- Quick Update Saldo Hari Ini untuk update banyak rekening cepat.
- Device Status dapat ditambah/edit/hapus hanya saat edit mode aktif.
- Overview executive dengan Total All Rekening, Top 5 brand, breakdown kategori, dan summary device.

## Run Local

```bash
npm install
npm run dev
```

Untuk menguji Vercel Blob secara lokal, buat `.env.local` berisi:

```bash
BLOB_READ_WRITE_TOKEN=<token dari Vercel Blob>
ADMIN_PASSWORD=fatmanage
```

Tanpa token, `/api/storage-status` akan menampilkan setup screen. Build frontend tetap tidak membutuhkan token karena token hanya dibaca di server API.

## Build

```bash
npm run build
```

## Deploy ke Vercel

1. Pastikan project terhubung ke Vercel.
2. Buat/attach Vercel Blob store ke project.
3. Set env `BLOB_READ_WRITE_TOKEN` dan `ADMIN_PASSWORD` untuk Production.
4. Deploy branch `main`.
5. Buka dashboard; jika Blob file belum ada, sample data akan tampil otomatis.

## Troubleshooting

Jika masih muncul screen **"Vercel Blob belum dikonfigurasi"**:

1. Buka `/api/storage-status` di production.
2. Jika response `{ "configured": false }`, cek env `BLOB_READ_WRITE_TOKEN` di Vercel Production environment.
3. Redeploy setelah env ditambahkan/diubah.
4. Pastikan token tidak dinamai `VITE_BLOB_READ_WRITE_TOKEN`.
5. Cek Vercel Function logs untuk error `/api/dashboard-data` jika status configured sudah true tetapi data gagal dimuat.

## Catatan Keamanan

- Jangan commit token Blob atau password production ke repository.
- Jangan memakai Supabase, Neon/Postgres, Google Sheets, atau localStorage sebagai storage utama data saldo.
- `sessionStorage` hanya dipakai untuk status UI edit mode pada sesi browser aktif.
