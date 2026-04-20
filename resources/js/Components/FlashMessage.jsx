import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const prev = useRef({});

    useEffect(() => {
        if (flash?.success && flash.success !== prev.current.success) {
            toast.success(flash.success);
            prev.current.success = flash.success;
        }
        if (flash?.error && flash.error !== prev.current.error) {
            toast.error(flash.error);
            prev.current.error = flash.error;
        }
    }, [flash]);

    return null;
}
