# Capella Credit — Sistem Pengajuan Kredit Internal

Prototype internal tool untuk PT Capella Multidana dalam mengelola pengajuan kredit nasabah. Dibangun sebagai bagian dari *Coding Test — IT Department*.

---

## Tech Stack

| Layer      | Teknologi                          |
|------------|------------------------------------|
| Backend    | PHP 8.2 · Laravel 11               |
| Frontend   | React 19 · Inertia.js              |
| Styling    | Tailwind CSS v4                    |
| Build Tool | Vite 5                             |
| Icons      | Lucide React                       |
| Toast      | Sonner                             |
| Database   | MySQL (via Laragon)                |

---

## Fitur Aplikasi

### Layout & UX
- Sidebar dark collapsible (expand `w-56` / collapse `w-16`) dengan toggle hamburger di topbar
- Navigasi SPA tanpa full reload (Inertia.js) dengan progress bar biru di atas halaman
- Skeleton loading otomatis saat berpindah halaman
- Mobile drawer sidebar dengan backdrop overlay
- Tooltip icon saat sidebar dalam mode collapsed
- Semua scrollbar disembunyikan (clean UI)

### Dashboard
- Kartu ringkasan: Total Pengajuan, Pending, Disetujui, Ditolak, Total Nominal Disetujui
- Tabel 5 pengajuan terbaru dengan link ke halaman lengkap

### Pengajuan Kredit
- Form dengan field: NIK (16 digit), nama, tipe, nominal, tenor, pendapatan, catatan
- **Simulasi cicilan real-time** — tagihan/bulan dan rasio cicilan/pendapatan muncul otomatis
- Preset tenor cepat: 6 / 12 / 18 / 24 bulan
- Validasi error tampil sebagai toast notifikasi

### Daftar Pengajuan
- Tabel lengkap dengan kolom NIK (font mono)
- **Filter** berdasarkan status via kartu statistik interaktif
- **Pencarian** NIK, nama, atau tipe pengajuan
- **Sorting** per kolom (nama, tipe, nominal, tagihan, status)
- Menu aksi ⋯ per baris: Detail, Setujui, Tolak (Setujui/Tolak hanya muncul untuk status Pending)

### Detail Pengajuan
- Informasi nasabah: nama, NIK, tipe, tanggal, nominal, tenor, pendapatan
- Kalkulasi tagihan per bulan (nominal ÷ tenor)
- Indikator rasio cicilan/pendapatan (hijau < 30%, kuning 30–50%, merah > 50%)
- **Jadwal cicilan bulanan** dengan tanggal jatuh tempo dan sisa pinjaman (collapsible)
- Tombol Setujui / Tolak dengan modal konfirmasi

### Validasi & Business Rules

| Aturan | Keterangan |
|--------|-----------|
| NIK | 16 digit angka, wajib diisi |
| Pendapatan minimal | Rp 1.000.000 |
| Nominal maksimal | Rp 200.000.000 |
| Tenor maksimal | 24 bulan |
| Maks. pengajuan | 3 kali per nasabah (berdasarkan NIK) |
| Status awal | Pending |
| Approve / Reject | Hanya bisa dari status Pending |

---

## Cara Menjalankan Project

### Prasyarat

- [Laragon](https://laragon.org/) (bundel PHP 8.2, MySQL, Apache/Nginx)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) v18+

### 1. Clone / Ekstrak Project

```bash
git clone <repo-url> credit-app
cd credit-app
```

### 2. Install Dependensi

```bash
composer install
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

Sesuaikan `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=credit_app
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Buat Database & Migrasi

```sql
CREATE DATABASE credit_app;
```

```bash
php artisan migrate --seed
```

### 5. Jalankan Aplikasi

**Via Laragon (direkomendasikan):**
```
http://credit-app.test
```

**Via Artisan (2 terminal terpisah):**
```bash
php artisan serve
npm run dev
```

---

## Struktur Project

```
credit-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── PengajuanController.php    # dashboard, index, store, show, approve, reject
│   │   └── Requests/
│   │       └── StorePengajuanRequest.php  # validasi form + max 3 pengajuan per NIK
│   └── Models/
│       └── Pengajuan.php                  # model + accessor tagihan & jadwal cicilan
├── database/
│   ├── migrations/
│   │   └── ..._create_pengajuans_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── PengajuanSeeder.php
├── resources/
│   └── js/
│       ├── app.jsx                        # entry point + Inertia setup + progress bar
│       ├── Layouts/
│       │   └── AppLayout.jsx              # sidebar collapse + topbar + skeleton loading
│       ├── Components/
│       │   ├── StatusBadge.jsx            # badge Pending / Disetujui / Ditolak
│       │   ├── FlashMessage.jsx           # toast dari Laravel flash session
│       │   ├── Modal.jsx                  # modal generik (ESC + backdrop close)
│       │   ├── ConfirmModal.jsx           # modal konfirmasi approve / reject
│       │   └── PengajuanForm.jsx          # form + simulasi cicilan live
│       ├── Pages/
│       │   ├── Dashboard/
│       │   │   └── Index.jsx              # ringkasan stats + tabel pengajuan terbaru
│       │   └── Pengajuan/
│       │       ├── Index.jsx              # daftar + filter + search + sort + aksi ⋯
│       │       └── Show.jsx               # detail + jadwal cicilan collapsible
│       └── utils/
│           └── format.js                  # fmtRupiah, toRawNumber, toDisplayNumber
└── routes/
    └── web.php
```

---

## Routes

| Method | URI                          | Keterangan               |
|--------|------------------------------|--------------------------|
| GET    | `/`                          | Redirect ke dashboard    |
| GET    | `/dashboard`                 | Halaman dashboard        |
| GET    | `/pengajuan`                 | Daftar semua pengajuan   |
| POST   | `/pengajuan`                 | Simpan pengajuan baru    |
| GET    | `/pengajuan/{id}`            | Detail pengajuan         |
| PATCH  | `/pengajuan/{id}/approve`    | Setujui pengajuan        |
| PATCH  | `/pengajuan/{id}/reject`     | Tolak pengajuan          |

---

## Alur Penggunaan

```
[ Dashboard ]
  ├─ Lihat ringkasan statistik
  └─ Klik "Lihat semua" → halaman Pengajuan

[ Daftar Pengajuan ]
  ├─ Klik kartu statistik    → filter tabel per status
  ├─ Ketik di search box     → cari NIK / nama / tipe
  ├─ Klik header kolom       → sort ascending / descending
  ├─ Klik "Pengajuan Baru"   → buka modal form
  │    └─ Isi NIK, nama, nominal + tenor → simulasi cicilan muncul otomatis
  └─ Klik ⋯ di baris         → menu aksi
       ├─ Detail              → halaman Show
       ├─ Setujui             → modal konfirmasi → status jadi Disetujui
       └─ Tolak               → modal konfirmasi → status jadi Ditolak

[ Detail Pengajuan ]
  ├─ Info lengkap nasabah + NIK
  ├─ Kalkulasi tagihan + rasio cicilan/pendapatan
  ├─ Jadwal cicilan bulanan (klik untuk expand semua)
  └─ Tombol Setujui / Tolak (hanya jika masih Pending)
```

---

*Dibuat untuk keperluan Coding Test IT Department — PT Capella Multidana.*
