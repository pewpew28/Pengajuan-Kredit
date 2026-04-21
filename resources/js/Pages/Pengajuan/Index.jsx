import { useState, useMemo, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, FileText, Clock, CheckCircle2, XCircle,
    Search, ChevronUp, ChevronDown as ChevronDownIcon, Filter,
    MoreHorizontal, Eye, CheckCircle, XCircle as XCircleIcon,
} from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import Modal from '@/Components/Modal';
import ConfirmModal from '@/Components/ConfirmModal';
import PengajuanForm from '@/Components/PengajuanForm';
import { fmtRupiah } from '@/utils/format';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ['Semua', 'Pending', 'Disetujui', 'Ditolak'];

/** Warna aktif untuk setiap kartu statistik berdasarkan status filter. */
const STAT_COLORS = {
    Semua:     { activeBg: 'bg-slate-50',   activeBorder: 'border-slate-300',   ring: 'ring-slate-300',   iconBg: 'bg-slate-200',   iconText: 'text-slate-700',   labelText: 'text-slate-700'   },
    Pending:   { activeBg: 'bg-amber-50',   activeBorder: 'border-amber-300',   ring: 'ring-amber-200',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600',   labelText: 'text-amber-700'   },
    Disetujui: { activeBg: 'bg-emerald-50', activeBorder: 'border-emerald-300', ring: 'ring-emerald-200', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', labelText: 'text-emerald-700' },
    Ditolak:   { activeBg: 'bg-red-50',     activeBorder: 'border-red-300',     ring: 'ring-red-200',     iconBg: 'bg-red-100',     iconText: 'text-red-500',     labelText: 'text-red-600'     },
};

/** Definisi kolom tabel beserta flag sortable. */
const TABLE_COLS = [
    { key: 'nik',               label: 'NIK',         sortable: false },
    { key: 'nama',              label: 'Nama',        sortable: true  },
    { key: 'tipe',              label: 'Tipe',        sortable: true  },
    { key: 'nominal',           label: 'Nominal',     sortable: true  },
    { key: 'tenor',             label: 'Tenor',       sortable: false },
    { key: 'tagihan_per_bulan', label: 'Tagihan/Bln', sortable: true  },
    { key: 'tanggal_pengajuan', label: 'Tanggal',     sortable: false },
    { key: 'status',            label: 'Status',      sortable: true  },
    { key: 'aksi',              label: 'Aksi',        sortable: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Kartu statistik yang berfungsi sebagai tombol filter tabel.
 */
function StatCard({ label, value, icon: Icon, color, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-xl border p-4 flex items-center gap-3 transition hover:shadow-md ${
                active
                    ? `${color.activeBorder} ${color.activeBg} ring-2 ${color.ring}`
                    : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
        >
            <div className={`p-2.5 rounded-xl ${active ? color.iconBg : 'bg-slate-100'}`}>
                <Icon size={17} className={active ? color.iconText : 'text-slate-500'} />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
                <p className={`text-xs font-medium mt-0.5 ${active ? color.labelText : 'text-slate-500'}`}>
                    {label}
                </p>
            </div>
        </button>
    );
}

/**
 * Ikon panah untuk indikator kolom yang sedang diurutkan.
 */
function SortIndicator({ col, sortBy, sortDir }) {
    if (sortBy !== col) {
        return <ChevronDownIcon size={12} className="text-slate-300 ml-1" />;
    }
    return sortDir === 'asc'
        ? <ChevronUp size={12} className="text-blue-600 ml-1" />
        : <ChevronDownIcon size={12} className="text-blue-600 ml-1" />;
}

function ActionMenu({ pengajuan, onApprove, onReject }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
                <MoreHorizontal size={16} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                    <Link
                        href={`/pengajuan/${pengajuan.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                        <Eye size={13} className="text-blue-500" />
                        Detail
                    </Link>
                    {pengajuan.status === 'Pending' && (
                        <>
                            <button
                                onClick={() => { setOpen(false); onApprove(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition"
                            >
                                <CheckCircle size={13} className="text-emerald-500" />
                                Setujui
                            </button>
                            <button
                                onClick={() => { setOpen(false); onReject(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                            >
                                <XCircleIcon size={13} className="text-red-400" />
                                Tolak
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Halaman utama daftar pengajuan kredit.
 * Fitur: filter status, pencarian, sorting kolom, approve/reject inline.
 *
 * @param {{ pengajuans: Array }} props - data dari Inertia (PengajuanController::index)
 */
export default function Index({ pengajuans }) {
    const [showForm, setShowForm] = useState(false);
    const [filter,   setFilter]   = useState('Semua');
    const [search,   setSearch]   = useState('');
    const [sortBy,   setSortBy]   = useState('tanggal_pengajuan');
    const [sortDir,  setSortDir]  = useState('desc');
    const [confirm,  setConfirm]  = useState(null); // { type: 'approve'|'reject', id, nama }

    // ── Computed counts per status ────────────────────────────────────────────
    const counts = useMemo(() => ({
        Semua:     pengajuans.length,
        Pending:   pengajuans.filter(p => p.status === 'Pending').length,
        Disetujui: pengajuans.filter(p => p.status === 'Disetujui').length,
        Ditolak:   pengajuans.filter(p => p.status === 'Ditolak').length,
    }), [pengajuans]);

    // ── Filter → search → sort pipeline ──────────────────────────────────────
    const rows = useMemo(() => {
        let list = filter !== 'Semua'
            ? pengajuans.filter(p => p.status === filter)
            : [...pengajuans];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.nama.toLowerCase().includes(q) ||
                p.tipe.toLowerCase().includes(q) ||
                p.nik.includes(q),
            );
        }

        return list.sort((a, b) => {
            let va = a[sortBy];
            let vb = b[sortBy];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ?  1 : -1;
            return 0;
        });
    }, [pengajuans, filter, search, sortBy, sortDir]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSort = (col) => {
        setSortBy(col);
        setSortDir(prev => sortBy === col && prev === 'asc' ? 'desc' : 'asc');
    };

    const handleConfirm = () => {
        if (!confirm) return;
        const action = confirm.type === 'approve' ? 'approve' : 'reject';
        router.patch(`/pengajuan/${confirm.id}/${action}`);
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <AppLayout
            title="Daftar Pengajuan Kredit"
            subtitle="Pantau dan kelola seluruh pengajuan pembiayaan nasabah"
        >
            <Head title="Pengajuan Kredit" />

            <div className="space-y-5">

                {/* Stats — klik untuk filter */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Semua',     icon: FileText     },
                        { label: 'Pending',   icon: Clock        },
                        { label: 'Disetujui', icon: CheckCircle2 },
                        { label: 'Ditolak',   icon: XCircle      },
                    ].map(s => (
                        <StatCard
                            key={s.label}
                            label={s.label}
                            value={counts[s.label]}
                            icon={s.icon}
                            color={STAT_COLORS[s.label]}
                            active={filter === s.label}
                            onClick={() => setFilter(s.label)}
                        />
                    ))}
                </div>

                {/* Tabel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                        <div className="relative max-w-xs w-full">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                <Search size={14} />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nama atau tipe…"
                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition"
                            />
                        </div>

                        <div className="flex items-center gap-2 justify-between sm:justify-end">
                            {filter !== 'Semua' && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Filter size={12} />
                                    <span className="font-medium">{filter}</span>
                                    <button
                                        onClick={() => setFilter('Semua')}
                                        className="text-slate-400 hover:text-slate-600"
                                        aria-label="Hapus filter"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <span className="text-xs text-slate-400">{rows.length} data</span>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm shadow-blue-200"
                            >
                                <Plus size={13} />
                                Pengajuan Baru
                            </button>
                        </div>
                    </div>

                    {/* Empty state */}
                    {rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <FileText size={40} className="mb-3 opacity-25" />
                            <p className="text-sm font-medium text-slate-500">Tidak ada data ditemukan</p>
                            <p className="text-xs mt-1">
                                {search
                                    ? 'Coba ubah kata kunci pencarian'
                                    : 'Klik "Pengajuan Baru" untuk memulai'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="w-10 px-4 py-3 text-left text-xs font-semibold text-slate-400">
                                            #
                                        </th>
                                        {TABLE_COLS.map(col => (
                                            <th
                                                key={col.key}
                                                onClick={() => col.sortable && handleSort(col.key)}
                                                className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap ${
                                                    col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''
                                                }`}
                                            >
                                                <span className="inline-flex items-center">
                                                    {col.label}
                                                    {col.sortable && (
                                                        <SortIndicator col={col.key} sortBy={sortBy} sortDir={sortDir} />
                                                    )}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((p, i) => (
                                        <tr
                                            key={p.id}
                                            className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="px-4 py-3.5 text-xs text-slate-400 tabular-nums">{i + 1}</td>
                                            <td className="px-4 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">{p.nik}</td>
                                            <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{p.nama}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                    {p.tipe}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-700 tabular-nums whitespace-nowrap">
                                                {fmtRupiah(p.nominal)}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                                {p.tenor} bln
                                            </td>
                                            <td className="px-4 py-3.5 font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                                                {fmtRupiah(p.tagihan_per_bulan)}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                                                {p.tanggal_pengajuan}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <StatusBadge status={p.status} />
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <ActionMenu
                                                    pengajuan={p}
                                                    onApprove={() => setConfirm({ type: 'approve', id: p.id, nama: p.nama })}
                                                    onReject={() => setConfirm({ type: 'reject', id: p.id, nama: p.nama })}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showForm} onClose={() => setShowForm(false)} title="Pengajuan Kredit Baru" size="md">
                <PengajuanForm onClose={() => setShowForm(false)} />
            </Modal>

            <ConfirmModal
                show={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={handleConfirm}
                type={confirm?.type}
                nama={confirm?.nama}
            />
        </AppLayout>
    );
}
