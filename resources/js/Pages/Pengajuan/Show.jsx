import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, User, CreditCard, Banknote, Clock,
    Wallet, StickyNote, TrendingUp, CheckCircle2,
    XCircle, CalendarDays, ChevronDown, ChevronUp,
} from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';
import { fmtRupiah } from '@/utils/format';

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Kartu metrik kecil dengan ikon, label, nilai, dan sub-teks opsional.
 */
function MetricCard({ icon: Icon, label, value, sub, accent = false }) {
    return (
        <div className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${
            accent ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200'
        }`}>
            <div className={`p-2 rounded-lg shrink-0 ${
                accent ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-sm font-bold mt-0.5 truncate ${accent ? 'text-blue-700' : 'text-slate-800'}`}>
                    {value}
                </p>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

/**
 * Kartu section dengan header opsional berisi ikon dan judul.
 */
function SectionCard({ title, icon: Icon, children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
            {title && (
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                    {Icon && <Icon size={14} className="text-slate-400" />}
                    <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{title}</h2>
                </div>
            )}
            <div className="p-5">{children}</div>
        </div>
    );
}

// ─── Jadwal Cicilan ───────────────────────────────────────────────────────────

const JADWAL_PREVIEW = 5;

/**
 * Tabel jadwal cicilan bulanan dengan toggle expand/collapse
 * jika tenor lebih dari JADWAL_PREVIEW bulan.
 *
 * @param {{ jadwal: Array }} props
 */
function JadwalCicilan({ jadwal }) {
    const [expanded, setExpanded] = useState(false);
    const shown = expanded ? jadwal : jadwal.slice(0, JADWAL_PREVIEW);

    return (
        <div>
            <div className="overflow-x-auto rounded-xl border border-slate-200" style={{ scrollbarWidth: 'none' }}>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {['Bln', 'Jatuh Tempo', 'Tagihan', 'Sisa Pinjaman'].map(h => (
                                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((row, i) => (
                            <tr
                                key={row.bulan}
                                className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                            >
                                <td className="px-4 py-2.5 text-xs font-semibold text-slate-500 w-12">{row.bulan}</td>
                                <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{row.tanggal}</td>
                                <td className="px-4 py-2.5 text-xs font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                                    {fmtRupiah(row.tagihan)}
                                </td>
                                <td className="px-4 py-2.5 text-xs tabular-nums whitespace-nowrap">
                                    {row.sisa_pinjaman === 0
                                        ? <span className="text-emerald-600 font-semibold">Lunas</span>
                                        : <span className="text-slate-500">{fmtRupiah(row.sisa_pinjaman)}</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {jadwal.length > JADWAL_PREVIEW && (
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition py-1"
                >
                    {expanded
                        ? <><ChevronUp size={13} /> Sembunyikan</>
                        : <><ChevronDown size={13} /> Tampilkan semua {jadwal.length} bulan</>
                    }
                </button>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Halaman detail satu pengajuan kredit.
 * Menampilkan info nasabah, kalkulasi cicilan, jadwal cicilan, dan aksi approve/reject.
 *
 * @param {{ pengajuan: object }} props - data dari Inertia (PengajuanController::show)
 */
export default function Show({ pengajuan }) {
    const [confirm, setConfirm] = useState(null); // 'approve' | 'reject'

    const isPending = pengajuan.status === 'Pending';

    const handleConfirm = () => {
        const action = confirm === 'approve' ? 'approve' : 'reject';
        router.patch(`/pengajuan/${pengajuan.id}/${action}`);
    };

    // Rasio cicilan terhadap pendapatan untuk indikator kesehatan kredit
    const ratio = pengajuan.pendapatan > 0
        ? (pengajuan.tagihan_per_bulan / pengajuan.pendapatan) * 100
        : 0;

    const ratioBarColor  = ratio > 50 ? 'bg-red-500'    : ratio > 30 ? 'bg-amber-500'  : 'bg-emerald-500';
    const ratioTextColor = ratio > 50 ? 'text-red-600'  : ratio > 30 ? 'text-amber-600': 'text-emerald-600';
    const ratioLabel     = ratio > 50 ? 'Melebihi batas aman (>50%)' : ratio > 30 ? 'Perlu diperhatikan (30–50%)' : 'Dalam batas aman (<30%)';

    return (
        <AppLayout>
            <Head title={`Detail — ${pengajuan.nama}`} />

            <div className="max-w-3xl mx-auto space-y-5">

                {/* Back + Status */}
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                    >
                        <ArrowLeft size={15} />
                        Kembali
                    </Link>
                    <StatusBadge status={pengajuan.status} size="lg" />
                </div>

                {/* Hero */}
                <SectionCard>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                                <User size={22} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-slate-900">{pengajuan.nama}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                                        {pengajuan.tipe}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                                        <CreditCard size={11} />
                                        {pengajuan.nik}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <CalendarDays size={11} />
                                        {pengajuan.tanggal_pengajuan}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs text-slate-400 mb-0.5">Nominal Pinjaman</p>
                            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                                {fmtRupiah(pengajuan.nominal)}
                            </p>
                        </div>
                    </div>
                </SectionCard>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <MetricCard icon={Clock}    label="Tenor"          value={`${pengajuan.tenor} Bulan`} />
                    <MetricCard icon={Wallet}   label="Pendapatan/Bln" value={fmtRupiah(pengajuan.pendapatan)} />
                    <MetricCard icon={Banknote} label="Tagihan/Bln"    value={fmtRupiah(pengajuan.tagihan_per_bulan)} accent />
                </div>

                {/* Kalkulasi Pembayaran */}
                <SectionCard title="Kalkulasi Pembayaran" icon={TrendingUp}>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                            <p className="text-xs text-slate-400">Tagihan per Bulan</p>
                            <p className="text-base font-extrabold text-slate-900 mt-1 tabular-nums">
                                {fmtRupiah(pengajuan.tagihan_per_bulan)}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {fmtRupiah(pengajuan.nominal)} ÷ {pengajuan.tenor} bln
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                            <p className="text-xs text-slate-400">Total Kewajiban</p>
                            <p className="text-base font-extrabold text-slate-900 mt-1 tabular-nums">
                                {fmtRupiah(pengajuan.nominal)}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                selama {pengajuan.tenor} bulan
                            </p>
                        </div>
                    </div>

                    {/* Rasio Cicilan / Pendapatan */}
                    <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 font-medium">Rasio Cicilan / Pendapatan</span>
                            <span className={`text-xs font-bold ${ratioTextColor}`}>
                                {ratio.toFixed(1)}% — {ratioLabel}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${ratioBarColor}`}
                                style={{ width: `${Math.min(ratio, 100)}%` }}
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* Jadwal Cicilan */}
                <SectionCard title="Jadwal Cicilan Bulanan" icon={CalendarDays}>
                    <JadwalCicilan jadwal={pengajuan.jadwal_cicilan} />
                </SectionCard>

                {/* Catatan */}
                {pengajuan.catatan && (
                    <SectionCard title="Catatan" icon={StickyNote}>
                        <p className="text-sm text-slate-600 leading-relaxed">{pengajuan.catatan}</p>
                    </SectionCard>
                )}

                {/* Tindakan */}
                {isPending ? (
                    <SectionCard>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Tindakan</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setConfirm('approve')}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-emerald-200"
                            >
                                <CheckCircle2 size={16} />
                                Setujui Pengajuan
                            </button>
                            <button
                                onClick={() => setConfirm('reject')}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-red-200"
                            >
                                <XCircle size={16} />
                                Tolak Pengajuan
                            </button>
                        </div>
                    </SectionCard>
                ) : (
                    <p className="text-center text-xs text-slate-400 pb-2">
                        Pengajuan ini telah diproses dan tidak dapat diubah.
                    </p>
                )}
            </div>

            <ConfirmModal
                show={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={handleConfirm}
                type={confirm}
                nama={pengajuan.nama}
            />
        </AppLayout>
    );
}
