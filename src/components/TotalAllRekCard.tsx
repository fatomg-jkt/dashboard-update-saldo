import { formatRupiah } from '../lib/format';
export function TotalAllRekCard({ total }: { total: number }) { return <div className="rounded-xl border-4 border-black bg-yellow-200 p-5 text-center shadow-lg"><p className="text-sm font-black tracking-[0.3em]">TOTAL ALL REK</p><p className="mt-2 text-4xl font-black text-black">{formatRupiah(total)}</p></div> }
