<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengajuan;
use Carbon\Carbon;

class PengajuanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nama' => 'Budi Santoso',
                'tipe' => 'Motor',
                'nominal' => 15000000,
                'tenor' => 12,
                'pendapatan' => 5000000,
                'catatan' => 'Untuk usaha',
                'tanggal_pengajuan' => Carbon::now(),
                'status' => 'Pending'
            ],
            [
                'nama' => 'Siti Aminah',
                'tipe' => 'Mobil',
                'nominal' => 150000000,
                'tenor' => 24,
                'pendapatan' => 10000000,
                'catatan' => 'Karyawan swasta',
                'tanggal_pengajuan' => Carbon::now()->subDays(1),
                'status' => 'Disetujui'
            ],
            [
                'nama' => 'Ahmad Fauzi',
                'tipe' => 'Multiguna',
                'nominal' => 50000000,
                'tenor' => 18,
                'pendapatan' => 7000000,
                'catatan' => null,
                'tanggal_pengajuan' => Carbon::now()->subDays(2),
                'status' => 'Ditolak'
            ],
        ];

        foreach ($data as $item) {
            Pengajuan::create($item);
        }
    }
}
