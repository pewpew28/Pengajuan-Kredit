import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Toaster } from 'sonner';
import { LayoutDashboard, FileText, Menu, X, Building2 } from 'lucide-react';
import FlashMessage from '@/Components/FlashMessage';

const NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/pengajuan', icon: FileText,         label: 'Pengajuan' },
];

function Skeleton({ className = '' }) {
    return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

function PageSkeleton() {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
            <Skeleton className="h-28" />
            <div className="space-y-3">
                <Skeleton className="h-10" />
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
        </div>
    );
}

export default function AppLayout({ children, title, subtitle }) {
    const [collapsed,  setCollapsed]  = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        const start  = router.on('start',  () => setNavigating(true));
        const finish = router.on('finish', () => setNavigating(false));
        return () => { start(); finish(); };
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <style>{`*::-webkit-scrollbar{display:none}`}</style>
            <Toaster position="top-right" richColors closeButton />
            <FlashMessage />

            {/* ── SIDEBAR desktop ── */}
            <aside className={`hidden lg:flex flex-col shrink-0 bg-slate-900 transition-[width] duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
                <div className="flex h-16 items-center border-b border-white/10 px-4 gap-3 overflow-hidden shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                        <Building2 size={15} className="text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">Capella</p>
                            <p className="text-xs text-slate-400 truncate">Credit Management</p>
                        </div>
                    )}
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
                    {NAV_ITEMS.map(item => (
                        <DesktopNavItem key={item.href} item={item} collapsed={collapsed} />
                    ))}
                </nav>
                <div className="shrink-0 border-t border-white/10 px-4 py-3 overflow-hidden">
                    {!collapsed && <p className="text-xs text-slate-500 truncate">Internal Tool v1.0</p>}
                </div>
            </aside>

            {/* ── MOBILE DRAWER ── */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-56 bg-slate-900 lg:hidden">
                        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                    <Building2 size={15} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Capella</p>
                                    <p className="text-xs text-slate-400">Credit Management</p>
                                </div>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition">
                                <X size={16} />
                            </button>
                        </div>
                        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                            {NAV_ITEMS.map(item => (
                                <MobileNavItem key={item.href} item={item} onClose={() => setMobileOpen(false)} />
                            ))}
                        </nav>
                        <div className="shrink-0 border-t border-white/10 px-4 py-3">
                            <p className="text-xs text-slate-500">Internal Tool v1.0</p>
                        </div>
                    </aside>
                </>
            )}

            {/* ── MAIN COLUMN ── */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-5 shrink-0">
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition">
                        <Menu size={18} />
                    </button>
                    <button onClick={() => setCollapsed(c => !c)} className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition">
                        <Menu size={18} />
                    </button>

                    <div className="h-5 w-px bg-slate-200 shrink-0" />

                    <div className="flex-1 min-w-0">
                        {title    && <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>}
                        {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600">CM</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {navigating ? <PageSkeleton /> : children}
                </main>

                <footer className="flex h-10 items-center border-t border-slate-200 bg-white px-6 shrink-0">
                    <p className="text-xs text-slate-400">© {new Date().getFullYear()} PT Capella Multidana</p>
                </footer>
            </div>
        </div>
    );
}

function DesktopNavItem({ item, collapsed }) {
    const { url } = usePage();
    const isActive = item.href === '/dashboard'
        ? url === '/dashboard' || url === '/'
        : url.startsWith(item.href);

    return (
        <div className="relative group">
            <Link
                href={item.href}
                className={`flex items-center rounded-lg text-sm font-medium transition-colors
                    ${collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5 w-full'}
                    ${isActive ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
            >
                <item.icon size={16} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
            {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.label}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-700" />
                </div>
            )}
        </div>
    );
}

function MobileNavItem({ item, onClose }) {
    const { url } = usePage();
    const isActive = item.href === '/dashboard'
        ? url === '/dashboard' || url === '/'
        : url.startsWith(item.href);

    return (
        <Link
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full
                ${isActive ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
        >
            <item.icon size={16} className="shrink-0" />
            {item.label}
        </Link>
    );
}
