import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const CONFIGS = {
    approve: {
        Icon:      CheckCircle2,
        iconBg:    'bg-emerald-50',
        iconColor: 'text-emerald-600',
        title:     'Setujui Pengajuan?',
        verb:      'disetujui',
        btnClass:  'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
        btnLabel:  'Ya, Setujui',
    },
    reject: {
        Icon:      AlertTriangle,
        iconBg:    'bg-red-50',
        iconColor: 'text-red-500',
        title:     'Tolak Pengajuan?',
        verb:      'ditolak',
        btnClass:  'bg-red-600 hover:bg-red-700 shadow-red-200',
        btnLabel:  'Ya, Tolak',
    },
};

/**
 * Modal konfirmasi untuk aksi approve / reject pengajuan.
 *
 * @param {{
 *   show:      boolean,
 *   onClose:   () => void,
 *   onConfirm: () => void,
 *   type:      'approve' | 'reject',
 *   nama:      string
 * }} props
 */
export default function ConfirmModal({ show, onClose, onConfirm, type, nama }) {
    if (!show) return null;

    const cfg = CONFIGS[type] ?? CONFIGS.approve;
    const { Icon } = cfg;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className={`w-14 h-14 rounded-full ${cfg.iconBg} flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={26} className={cfg.iconColor} />
                </div>

                <h3 className="text-base font-bold text-slate-900">{cfg.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Pengajuan atas nama{' '}
                    <span className="font-semibold text-slate-700">"{nama}"</span>{' '}
                    akan <span className="font-semibold">{cfg.verb}</span>.{' '}
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
                        className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition shadow-sm ${cfg.btnClass}`}
                    >
                        {cfg.btnLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
