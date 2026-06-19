const envExample = `VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`;

export function SupabaseSetupScreen() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <section className="mx-auto max-w-5xl rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
          Setup dibutuhkan sebelum data dashboard muncul
        </span>
        <h1 className="mt-6 text-3xl font-black text-slate-950 md:text-5xl">Supabase belum dikonfigurasi</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Deploy Vercel-nya sudah jalan. Sekarang dashboard perlu dua Environment Variables Supabase agar bisa membaca dan menyimpan data dari database, bukan dari browser.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Step number="1" title="Buka Supabase">
            Project Settings → API, lalu copy Project URL dan anon public key.
          </Step>
          <Step number="2" title="Isi Vercel Env">
            Vercel Project → Settings → Environment Variables, tambahkan dua variable di bawah.
          </Step>
          <Step number="3" title="Redeploy">
            Setelah env tersimpan, klik Redeploy agar variable masuk ke build Vite.
          </Step>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-bold text-slate-700">Environment Variables yang wajib diisi:</p>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-emerald-300 md:text-base">{envExample}</pre>
        </div>

        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          <p className="font-black">Checklist cepat setelah env masuk:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Jalankan SQL schema dari <code>docs/supabase-schema.sql</code> di Supabase SQL Editor.</li>
            <li>Pastikan nama env persis: <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            <li>Redeploy Vercel. Refresh halaman setelah deploy selesai.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 font-black text-white">{number}</div>
      <h2 className="mt-4 text-lg font-black text-slate-950">{title}</h2>
      <p className="mt-2 leading-7 text-slate-600">{children}</p>
    </div>
  );
}
