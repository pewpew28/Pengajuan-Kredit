import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Toaster } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, User, CreditCard, DollarSign, Calendar, StickyNote, TrendingUp } from 'lucide-react';
import StatusBadge from '@/Components/StatusBadge';
import FlashMessage from '@/Components/FlashMessage';
import ConfirmModal from '@/Components/ConfirmModal';

const fmt = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function Show({ pengajuan }) {
    const [confirm, setConfirm] = useState(null); // 'approve' | 'reject'

    const isPending = pengajuan.status === 'Pending';

    const handleConfirm = () => {
        const url = confirm === 'approve'
            ? `/pengajuan/${pengajuan.id}/approve`
            : `/pengajuan/${pengajuan.id}/reject`;
        router.patch(url);
    };

    const ratio = pengajuan.pendapatan > 0
        ? (pengajuan.tagihan_per_bulan / pengajuan.pendapatan) * 100
        : 0;

    const ratioColor = ratio > 50 ? 'bg-red-500' : ratio > 30 ? 'bg-amber-500' : 'bg-emerald-500';
    const ratioText  = ratio > 50 ? 'text-red-600' : ratio > 30 ? 'text-amber-600' : 'text-emerald-600';
    const ratioLabel = ratio > 50 ? 'Rasio melebihi batas aman (>50%)' : ratio > 30 ? 'Rasio perlu diperhatikan (30–50%)' : 'Rasio dalam batas aman (<30%)';

    return (
        <>
            <Head title={`Detail — ${pengajuan.nama}`} />
            <Toaster position="top-right" richColors closeButton />
            <FlashMessage />

            <div className="min-h-screen bg-[#f5f6fa]" style={{ scrollbarWidth: 'none' }}>
                <style>{`body::-webkit-scrollbar { display: none; }`}</style>

                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3">
                        <Link
                            href="/"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-sm font-semibold text-gray-900 truncate">Detail Pengajuan</h1>
                            <p className="text-xs text-gray-400">ID #{pengajuan.id}</p>
                        </div>
                        <StatusBadge status={pengajuan.status} />
                    </div>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-7 space-y-4">

                    {/* Hero Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                    <User size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900">{pengajuan.nama}</p>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                                            {pengajuan.tipe}
                                        </span>
                                        <span className="text-xs text-gray-400">{pengajuan.tanggal_pengajuan}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 mb-1">Nominal Pinjaman</p>
                                <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(pengajuan.nominal)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detail Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: Calendar,    label: 'Tenor',           value: `${pengajuan.tenor} Bulan`,            highlight: false },
                            { icon: DollarSign,  label: 'Pendapatan/Bln',  value: fmt(pengajuan.pendapatan),             highlight: false },
                            { icon: CreditCard,  label: 'Tagihan/Bln',     value: fmt(pengajuan.tagihan_per_bulan),      highlight: true  },
                        ].map(item => (
                            <div key={item.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.highlight ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                                    <item.icon size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">{item.label}</p>
                                    <p className={`text-sm font-bold mt-0.5 ${item.highlight ? 'text-blue-700' : 'text-gray-800'}`}>{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Kalkulasi Tagihan */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={15} className="text-gray-400" />
                            <h2 className="text-sm font-semibold text-gray-700">Kalkulasi Pembayaran</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400">Tagihan per Bulan</p>
                                <p className="text-base font-bold text-gray-900 mt-0.5">{fmt(pengajuan.tagihan_per_bulan)}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{fmt(pengajuan.nominal)} ÷ {pengajuan.tenor} bln</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400">Total Kewajiban</p>
                                <p className="text-base font-bold text-gray-900 mt-0.5">{fmt(pengajuan.nominal)}</p>
                                <p className="text-xs text-gray-400 mt-0.5">selama {pengajuan.tenor} bulan</p>
                            </div>
                        </div>

                        {/* Rasio */}
                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500">Rasio Cicilan / Pendapatan</span>
                                <span className={`text-sm font-bold ${ratioText}`}>{ratio.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${ratioColor}`}
                                    style={{ width: `${Math.min(ratio, 100)}%` }}
                                />
                            </div>
                            <p className={`text-xs mt-2 ${ratioText}`}>{ratioLabel}</p>
                        </div>
                    </div>

                    {/* Catatan */}
                    {pengajuan.catatan && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <StickyNote size={15} className="text-gray-400" />
                                <h2 className="text-sm font-semibold text-gray-700">Catatan</h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{pengajuan.catatan}</p>
                        </div>
                    )}

                    {/* Actions */}
                    {isPending ? (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">Tindakan</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirm('approve')}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-emerald-200"
                                >
                                    <CheckCircle size={15} />
                                    Setujui
                                </button>
                                <button
                                    onClick={() => setConfirm('reject')}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-red-200"
                                >
                                    <XCircle size={15} />
                                    Tolak
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-xs text-gray-400">
                            Pengajuan telah diproses dan tidak dapat diubah.
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Konfirmasi */}
            <ConfirmModal
                show={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={handleConfirm}
                type={confirm}
                nama={pengajuan.nama}
            />
        </>
    );
}
