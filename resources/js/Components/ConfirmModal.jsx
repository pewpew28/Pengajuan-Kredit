import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ConfirmModal({ show, onClose, onConfirm, type = 'approve', nama }) {
    if (!show) return null;

    const isApprove = type === 'approve';
    const config = isApprove
        ? { icon: CheckCircle2, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', label: 'Setujui Pengajuan?', desc: 'disetujui', btnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200', btnLabel: 'Ya, Setujui' }
        : { icon: AlertTriangle, iconColor: 'text-red-500',     iconBg: 'bg-red-50',     label: 'Tolak Pengajuan?',   desc: 'ditolak',   btnClass: 'bg-red-600 hover:bg-red-700 shadow-red-200',         btnLabel: 'Ya, Tolak'   };

    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className={`w-14 h-14 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={26} className={config.iconColor} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{config.label}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Pengajuan atas nama{' '}
                    <span className="font-semibold text-slate-700">"{nama}"</span>{' '}
                    akan <span className="font-semibold">{config.desc}</span>.
                    Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition shadow-sm ${config.btnClass}`}
                    >
                        {config.btnLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
