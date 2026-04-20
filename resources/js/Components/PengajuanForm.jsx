import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { User, Tag, Banknote, Clock, Wallet, FileText, ChevronDown, AlertCircle, TrendingUp, Calculator } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const TIPE_OPTIONS = [
    { value: 'Sepeda Motor', label: 'Sepeda Motor' },
    { value: 'Mobil',        label: 'Mobil'        },
    { value: 'Multiguna',    label: 'Multiguna'    },
];

const TENOR_PRESETS = [6, 12, 18, 24];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);

const toRaw = (s) => parseInt(String(s).replace(/\D/g, '') || '0', 10);

const toDisplay = (raw) =>
    raw ? String(raw).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';

// ─── Sub-components ──────────────────────────────────────────────────────────

function Label({ children }) {
    return <label className="block text-xs font-semibold text-slate-600 mb-1.5">{children}</label>;
}

function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
            <AlertCircle size={11} /> {msg}
        </p>
    );
}

function Input({ icon: Icon, error, className = '', ...props }) {
    return (
        <div className="relative">
            {Icon && <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400"><Icon size={14} /></span>}
            <input
                {...props}
                className={`
                    w-full bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:bg-white transition
                    ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5
                    ${error ? 'border-red-300 focus:ring-red-100 focus:border-red-400' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}
                    ${className}
                `}
            />
        </div>
    );
}

// ─── Calculator Preview ───────────────────────────────────────────────────────

function CalcPreview({ nominal, tenor, pendapatan }) {
    const tagihanPerBulan = useMemo(() => {
        if (!nominal || !tenor) return 0;
        return Math.round(nominal / tenor);
    }, [nominal, tenor]);

    const ratio = useMemo(() => {
        if (!pendapatan || !tagihanPerBulan) return 0;
        return (tagihanPerBulan / pendapatan) * 100;
    }, [tagihanPerBulan, pendapatan]);

    const ratioColor =
        ratio === 0    ? 'bg-slate-300' :
        ratio > 50     ? 'bg-red-500'   :
        ratio > 30     ? 'bg-amber-500' :
                         'bg-emerald-500';

    const ratioTextColor =
        ratio === 0    ? 'text-slate-400' :
        ratio > 50     ? 'text-red-600'   :
        ratio > 30     ? 'text-amber-600' :
                         'text-emerald-600';

    const ratioLabel =
        ratio === 0    ? '—' :
        ratio > 50     ? 'Melebihi batas aman' :
        ratio > 30     ? 'Perlu diperhatikan'  :
                         'Dalam batas aman';

    if (!nominal && !tenor) return null;

    return (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                <Calculator size={13} />
                Simulasi Cicilan
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg px-3 py-2.5 border border-slate-100">
                    <p className="text-xs text-slate-400">Tagihan / Bulan</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 tabular-nums">
                        {tagihanPerBulan ? fmt(tagihanPerBulan) : '—'}
                    </p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2.5 border border-slate-100">
                    <p className="text-xs text-slate-400">Total Kewajiban</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 tabular-nums">
                        {nominal ? fmt(nominal) : '—'}
                    </p>
                </div>
            </div>

            {pendapatan > 0 && tagihanPerBulan > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-slate-500">Rasio Cicilan / Pendapatan</span>
                        <span className={`text-xs font-bold ${ratioTextColor}`}>{ratio.toFixed(1)}% — {ratioLabel}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${ratioColor}`}
                            style={{ width: `${Math.min(ratio, 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function PengajuanForm({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama:       '',
        tipe:       'Sepeda Motor',
        nominal:    '',
        tenor:      '',
        pendapatan: '',
        catatan:    '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/pengajuan', {
            onSuccess: () => { reset(); onClose?.(); },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nama */}
            <div>
                <Label>Nama Lengkap Nasabah</Label>
                <Input
                    icon={User}
                    type="text"
                    value={data.nama}
                    onChange={e => setData('nama', e.target.value)}
                    placeholder="Sesuai KTP"
                    error={errors.nama}
                    autoFocus
                />
                <FieldError msg={errors.nama} />
            </div>

            {/* Tipe */}
            <div>
                <Label>Tipe Pengajuan</Label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <Tag size={14} />
                    </span>
                    <select
                        value={data.tipe}
                        onChange={e => setData('tipe', e.target.value)}
                        className={`w-full bg-slate-50 border rounded-xl text-sm text-slate-900 pl-9 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:bg-white transition
                            ${errors.tipe ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                    >
                        {TIPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={14} />
                    </span>
                </div>
                <FieldError msg={errors.tipe} />
            </div>

            {/* Nominal */}
            <div>
                <Label>Nominal Pengajuan</Label>
                <Input
                    icon={Banknote}
                    type="text"
                    inputMode="numeric"
                    value={toDisplay(data.nominal)}
                    onChange={e => setData('nominal', toRaw(e.target.value))}
                    placeholder="Maks. Rp 200.000.000"
                    error={errors.nominal}
                />
                <FieldError msg={errors.nominal} />
            </div>

            {/* Tenor */}
            <div>
                <Label>Tenor (Bulan)</Label>
                {/* Quick-pick buttons */}
                <div className="flex gap-2 mb-2">
                    {TENOR_PRESETS.map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setData('tenor', t)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                                Number(data.tenor) === t
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                            }`}
                        >
                            {t} bln
                        </button>
                    ))}
                </div>
                <Input
                    icon={Clock}
                    type="number"
                    value={data.tenor}
                    onChange={e => setData('tenor', e.target.value)}
                    min="1" max="24"
                    placeholder="1 – 24 bulan"
                    error={errors.tenor}
                />
                <FieldError msg={errors.tenor} />
            </div>

            {/* Pendapatan */}
            <div>
                <Label>Pendapatan Bulanan</Label>
                <Input
                    icon={Wallet}
                    type="text"
                    inputMode="numeric"
                    value={toDisplay(data.pendapatan)}
                    onChange={e => setData('pendapatan', toRaw(e.target.value))}
                    placeholder="Min. Rp 1.000.000"
                    error={errors.pendapatan}
                />
                <FieldError msg={errors.pendapatan} />
            </div>

            {/* Live Calculator Preview */}
            <CalcPreview
                nominal={data.nominal}
                tenor={Number(data.tenor)}
                pendapatan={data.pendapatan}
            />

            {/* Catatan */}
            <div>
                <Label>
                    Catatan{' '}
                    <span className="font-normal text-slate-400">(opsional)</span>
                </Label>
                <div className="relative">
                    <span className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                        <FileText size={14} />
                    </span>
                    <textarea
                        value={data.catatan}
                        onChange={e => setData('catatan', e.target.value)}
                        rows={3}
                        placeholder="Catatan tambahan..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 pl-9 pr-3 pt-2.5 pb-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition"
                    />
                </div>
                <FieldError msg={errors.catatan} />
            </div>

            {/* Rules hint */}
            <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <ul className="text-xs text-amber-700 space-y-0.5">
                    <li>Pendapatan minimal <strong>Rp 1.000.000</strong></li>
                    <li>Nominal maksimal <strong>Rp 200.000.000</strong></li>
                    <li>Tenor maksimal <strong>24 bulan</strong></li>
                    <li>Maks. <strong>3 pengajuan</strong> per nasabah</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2.5 pt-1 border-t border-slate-100">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                    >
                        Batal
                    </button>
                )}
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm shadow-blue-200"
                >
                    {processing ? 'Menyimpan…' : 'Ajukan Kredit'}
                </button>
            </div>
        </form>
    );
}
