import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, FileText, Clock, CheckCircle2, XCircle,
    Search, ChevronUp, ChevronDown as ChevDown, Filter,
} from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import Modal from '@/Components/Modal';
import ConfirmModal from '@/Components/ConfirmModal';
import PengajuanForm from '@/Components/PengajuanForm';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

function SortIcon({ col, sortBy, sortDir }) {
    if (sortBy !== col) return <span className="text-slate-300 ml-1"><ChevDown size={12} /></span>;
    return sortDir === 'asc'
        ? <ChevronUp size={12} className="text-blue-600 ml-1" />
        : <ChevDown size={12} className="text-blue-600 ml-1" />;
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-xl border p-4 flex items-center gap-3 transition hover:shadow-md ${
                active ? `${color.activeBorder} ${color.activeBg} ring-2 ${color.ring}` : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
        >
            <div className={`p-2.5 rounded-xl ${active ? color.iconBg : 'bg-slate-100'}`}>
                <Icon size={17} className={active ? color.iconText : 'text-slate-500'} />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
                <p className={`text-xs font-medium mt-0.5 ${active ? color.labelText : 'text-slate-500'}`}>{label}</p>
            </div>
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTERS = ['Semua', 'Pending', 'Disetujui', 'Ditolak'];

const STAT_COLORS = {
    Semua:     { activeBg: 'bg-slate-50',    activeBorder: 'border-slate-300',   ring: 'ring-slate-300',   iconBg: 'bg-slate-200',    iconText: 'text-slate-700',    labelText: 'text-slate-700'    },
    Pending:   { activeBg: 'bg-amber-50',    activeBorder: 'border-amber-300',   ring: 'ring-amber-200',   iconBg: 'bg-amber-100',    iconText: 'text-amber-600',    labelText: 'text-amber-700'    },
    Disetujui: { activeBg: 'bg-emerald-50',  activeBorder: 'border-emerald-300', ring: 'ring-emerald-200', iconBg: 'bg-emerald-100',  iconText: 'text-emerald-600',  labelText: 'text-emerald-700'  },
    Ditolak:   { activeBg: 'bg-red-50',      activeBorder: 'border-red-300',     ring: 'ring-red-200',     iconBg: 'bg-red-100',      iconText: 'text-red-500',      labelText: 'text-red-600'      },
};

export default function Index({ pengajuans }) {
    const [showForm,  setShowForm]  = useState(false);
    const [filter,    setFilter]    = useState('Semua');
    const [search,    setSearch]    = useState('');
    const [sortBy,    setSortBy]    = useState('tanggal_pengajuan');
    const [sortDir,   setSortDir]   = useState('desc');
    const [confirm,   setConfirm]   = useState(null); // { type, id, nama }

    // ── Derived data ──────────────────────────────────────────────────────────
    const counts = useMemo(() => ({
        Semua:     pengajuans.length,
        Pending:   pengajuans.filter(p => p.status === 'Pending').length,
        Disetujui: pengajuans.filter(p => p.status === 'Disetujui').length,
        Ditolak:   pengajuans.filter(p => p.status === 'Ditolak').length,
    }), [pengajuans]);

    const processed = useMemo(() => {
        let list = [...pengajuans];

        if (filter !== 'Semua') list = list.filter(p => p.status === filter);

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.nama.toLowerCase().includes(q) ||
                p.tipe.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => {
            let va = a[sortBy], vb = b[sortBy];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ?  1 : -1;
            return 0;
        });

        return list;
    }, [pengajuans, filter, search, sortBy, sortDir]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSort = (col) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('asc'); }
    };

    const handleConfirm = () => {
        if (!confirm) return;
        router.patch(`/pengajuan/${confirm.id}/${confirm.type === 'approve' ? 'approve' : 'reject'}`);
    };

    // ── Column defs ───────────────────────────────────────────────────────────
    const COLS = [
        { key: 'nama',               label: 'Nama',         sortable: true  },
        { key: 'tipe',               label: 'Tipe',         sortable: true  },
        { key: 'nominal',            label: 'Nominal',      sortable: true  },
        { key: 'tenor',              label: 'Tenor',        sortable: false },
        { key: 'tagihan_per_bulan',  label: 'Tagihan/Bln',  sortable: true  },
        { key: 'tanggal_pengajuan',  label: 'Tanggal',      sortable: false },
        { key: 'status',             label: 'Status',       sortable: true  },
        { key: 'aksi',               label: 'Aksi',         sortable: false },
    ];

    return (
        <AppLayout
            title="Daftar Pengajuan Kredit"
            subtitle="Pantau dan kelola seluruh pengajuan pembiayaan nasabah"
        >
            <Head title="Pengajuan Kredit" />

            <div className="space-y-5">

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Semua',     icon: FileText    },
                        { label: 'Pending',   icon: Clock       },
                        { label: 'Disetujui', icon: CheckCircle2 },
                        { label: 'Ditolak',   icon: XCircle     },
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

                {/* ── Table card ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                        {/* Search */}
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
                            {/* Active filter chip */}
                            {filter !== 'Semua' && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Filter size={12} />
                                    <span className="font-medium">{filter}</span>
                                    <button onClick={() => setFilter('Semua')} className="text-slate-400 hover:text-slate-600">✕</button>
                                </div>
                            )}
                            <span className="text-xs text-slate-400">{processed.length} data</span>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm shadow-blue-200"
                            >
                                <Plus size={13} />
                                Pengajuan Baru
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {processed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <FileText size={40} className="mb-3 opacity-25" />
                            <p className="text-sm font-medium text-slate-500">Tidak ada data ditemukan</p>
                            <p className="text-xs mt-1">
                                {search ? 'Coba ubah kata kunci pencarian' : 'Klik "Pengajuan Baru" untuk memulai'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="w-10 px-4 py-3 text-left text-xs font-semibold text-slate-400">#</th>
                                        {COLS.map(col => (
                                            <th
                                                key={col.key}
                                                className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                                                onClick={() => col.sortable && handleSort(col.key)}
                                            >
                                                <span className="inline-flex items-center">
                                                    {col.label}
                                                    {col.sortable && <SortIcon col={col.key} sortBy={sortBy} sortDir={sortDir} />}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {processed.map((p, i) => (
                                        <tr
                                            key={p.id}
                                            className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="px-4 py-3.5 text-xs text-slate-400 tabular-nums">{i + 1}</td>
                                            <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{p.nama}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                    {p.tipe}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-700 tabular-nums whitespace-nowrap">{fmt(p.nominal)}</td>
                                            <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{p.tenor} bln</td>
                                            <td className="px-4 py-3.5 font-semibold text-slate-800 tabular-nums whitespace-nowrap">{fmt(p.tagihan_per_bulan)}</td>
                                            <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">{p.tanggal_pengajuan}</td>
                                            <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                    {p.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => setConfirm({ type: 'approve', id: p.id, nama: p.nama })}
                                                                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                                                            >
                                                                Setujui
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirm({ type: 'reject', id: p.id, nama: p.nama })}
                                                                className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    <Link
                                                        href={`/pengajuan/${p.id}`}
                                                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                                                    >
                                                        Detail
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
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
