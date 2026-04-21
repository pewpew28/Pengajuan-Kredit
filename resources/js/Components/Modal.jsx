import { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZE_CLASS = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

/**
 * Modal generik yang dapat digunakan ulang di seluruh aplikasi.
 * Mendukung penutupan via tombol ✕, klik backdrop, atau tombol Escape.
 *
 * @param {{
 *   show:    boolean,
 *   onClose: () => void,
 *   title:   string,
 *   children: React.ReactNode,
 *   size?:   'sm' | 'md' | 'lg' | 'xl'
 * }} props
 */
export default function Modal({ show, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (!show) return;

        const handleKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${SIZE_CLASS[size]} flex flex-col max-h-[92vh]`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Tutup modal"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-5" style={{ scrollbarWidth: 'none' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
