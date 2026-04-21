import { Head, Link } from '@inertiajs/react';
import { FileText, Clock, CheckCircle2, XCircle, Banknote, ArrowRight } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import { fmtRupiah } from '@/utils/format';

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className={`bg-white rounded-2xl border p-5 flex items-center gap-4 ${color.border}`}>
            <div className={`p-3 rounded-xl ${color.iconBg}`}>
                <Icon size={20} className={color.iconText} />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">{value}</p>
            </div>
        </div>
    );
}

export default function Index({ stats, recentPengajuans }) {
    const cards = [
        { label: 'Total Pengajuan',  value: stats.total,     icon: FileText,     color: { border: 'border-slate-200',   iconBg: 'bg-slate-100',   iconText: 'text-slate-600'   } },
        { label: 'Pending',          value: stats.pending,   icon: Clock,        color: { border: 'border-amber-200',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600'   } },
        { label: 'Disetujui',        value: stats.disetujui, icon: CheckCircle2, color: { border: 'border-emerald-200', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' } },
        { label: 'Ditolak',          value: stats.ditolak,   icon: XCircle,      color: { border: 'border-red-200',     iconBg: 'bg-red-100',     iconText: 'text-red-500'     } },
    ];

    return (
        <AppLayout title="Dashboard" subtitle="Ringkasan pengajuan kredit nasabah">
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {cards.map(c => (
                        <StatCard key={c.label} {...c} />
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-emerald-200 p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100">
                        <Banknote size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Nominal Disetujui</p>
                        <p className="text-2xl font-extrabold text-emerald-700 mt-0.5 tabular-nums">
                            {fmtRupiah(stats.total_nominal_disetujui)}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-700">Pengajuan Terbaru</h2>
                        <Link
                            href="/pengajuan"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                        >
                            Lihat semua <ArrowRight size={12} />
                        </Link>
                    </div>

                    {recentPengajuans.length === 0 ? (
                        <div className="py-12 text-center">
                            <FileText size={32} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-sm text-slate-400">Belum ada pengajuan</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        {['NIK', 'Nama', 'Tipe', 'Nominal', 'Tanggal', 'Status'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPengajuans.map(p => (
                                        <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-3 text-xs text-slate-500 font-mono">{p.nik}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{p.nama}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                                                    {p.tipe}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 tabular-nums whitespace-nowrap">{fmtRupiah(p.nominal)}</td>
                                            <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{p.tanggal_pengajuan}</td>
                                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
