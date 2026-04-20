const VARIANTS = {
    Pending:   { dot: 'bg-amber-400',   pill: 'bg-amber-50 border-amber-200 text-amber-700'   },
    Disetujui: { dot: 'bg-emerald-500', pill: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    Ditolak:   { dot: 'bg-red-500',     pill: 'bg-red-50 border-red-200 text-red-700'         },
};

export default function StatusBadge({ status, size = 'sm' }) {
    const v = VARIANTS[status] ?? { dot: 'bg-slate-400', pill: 'bg-slate-50 border-slate-200 text-slate-600' };
    const sz = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold ${sz} ${v.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.dot}`} />
            {status}
        </span>
    );
}
