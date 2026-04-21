/**
 * Format angka menjadi mata uang Rupiah (IDR).
 * @param {number} value
 * @returns {string}  contoh: "Rp 1.500.000"
 */
export const fmtRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);

/**
 * Ubah string angka berformat (misal "1.500.000") menjadi integer murni.
 * @param {string|number} s
 * @returns {number}
 */
export const toRawNumber = (s) =>
    parseInt(String(s).replace(/\D/g, '') || '0', 10);

/**
 * Format integer menjadi string dengan titik ribuan untuk input display.
 * @param {number|string} raw
 * @returns {string}  contoh: "1.500.000"
 */
export const toDisplayNumber = (raw) =>
    raw
        ? String(raw).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : '';
