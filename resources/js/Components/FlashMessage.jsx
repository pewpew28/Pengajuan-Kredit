import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Menampilkan flash message dari server (success / error) sebagai toast.
 * Menggunakan ref untuk mencegah toast muncul duplikat pada re-render.
 */
export default function FlashMessage() {
    const { flash } = usePage().props;
    const shown = useRef({ success: null, error: null });

    useEffect(() => {
        if (flash?.success && flash.success !== shown.current.success) {
            toast.success(flash.success);
            shown.current.success = flash.success;
        }
        if (flash?.error && flash.error !== shown.current.error) {
            toast.error(flash.error);
            shown.current.error = flash.error;
        }
    }, [flash]);

    return null;
}
