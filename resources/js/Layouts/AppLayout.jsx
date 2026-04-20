import { Link, usePage } from '@inertiajs/react';
import { Toaster } from 'sonner';
import { LayoutDashboard, FileText } from 'lucide-react';
import FlashMessage from '@/Components/FlashMessage';

export default function AppLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" style={{ scrollbarWidth: 'none' }}>
            <style>{`*::-webkit-scrollbar { display: none; }`}</style>

            <Toaster position="top-right" richColors closeButton expand={false} />
            <FlashMessage />

            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-300">
                            <LayoutDashboard size={15} className="text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-sm font-bold text-slate-800 tracking-tight">Capella</span>
                            <span className="text-sm font-bold text-blue-600 tracking-tight"> Credit</span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="flex items-center gap-1">
                        <NavLink href="/" icon={FileText} label="Pengajuan" />
                    </nav>
                </div>
            </header>

            {/* Page Header */}
            {(title || subtitle) && (
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                        {title  && <h1 className="text-lg font-bold text-slate-900">{title}</h1>}
                        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white mt-auto">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center">
                    <p className="text-xs text-slate-400">© {new Date().getFullYear()} PT Capella Multidana — Sistem Pengajuan Kredit Internal</p>
                </div>
            </footer>
        </div>
    );
}

function NavLink({ href, icon: Icon, label }) {
    const { url } = usePage();
    const isActive = url === href || (href !== '/' && url.startsWith(href));

    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
        >
            <Icon size={13} />
            {label}
        </Link>
    );
}
