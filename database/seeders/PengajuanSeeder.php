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
                'nik'               => '3201011501900001',
                'nama'              => 'Budi Santoso',
                'tipe'              => 'Sepeda Motor',
                'nominal'           => 15000000,
                'tenor'             => 12,
                'pendapatan'        => 5000000,
                'catatan'           => 'Untuk operasional usaha sehari-hari.',
                'tanggal_pengajuan' => Carbon::today(),
                'status'            => 'Pending',
            ],
            [
                'nik'               => '3271025507850002',
                'nama'              => 'Siti Aminah',
                'tipe'              => 'Mobil',
                'nominal'           => 150000000,
                'tenor'             => 24,
                'pendapatan'        => 12000000,
                'catatan'           => 'Karyawan swasta, sudah bekerja 5 tahun.',
                'tanggal_pengajuan' => Carbon::today()->subDays(1),
                'status'            => 'Disetujui',
            ],
            [
                'nik'               => '3578031209880003',
                'nama'              => 'Ahmad Fauzi',
                'tipe'              => 'Multiguna',
                'nominal'           => 50000000,
                'tenor'             => 18,
                'pendapatan'        => 7000000,
                'catatan'           => null,
                'tanggal_pengajuan' => Carbon::today()->subDays(2),
                'status'            => 'Ditolak',
            ],
            [
                'nik'               => '3201011501900001',
                'nama'              => 'Budi Santoso',
                'tipe'              => 'Multiguna',
                'nominal'           => 30000000,
                'tenor'             => 12,
                'pendapatan'        => 5000000,
                'catatan'           => 'Renovasi warung.',
                'tanggal_pengajuan' => Carbon::today()->subDays(5),
                'status'            => 'Disetujui',
            ],
            [
                'nik'               => '3374044404920004',
                'nama'              => 'Dewi Rahayu',
                'tipe'              => 'Sepeda Motor',
                'nominal'           => 20000000,
                'tenor'             => 18,
                'pendapatan'        => 4500000,
                'catatan'           => null,
                'tanggal_pengajuan' => Carbon::today()->subDays(3),
                'status'            => 'Pending',
            ],
            [
                'nik'               => '3515052908950005',
                'nama'              => 'Rudi Hartono',
                'tipe'              => 'Mobil',
                'nominal'           => 200000000,
                'tenor'             => 24,
                'pendapatan'        => 15000000,
                'catatan'           => 'Untuk kebutuhan keluarga.',
                'tanggal_pengajuan' => Carbon::today()->subDays(7),
                'status'            => 'Disetujui',
            ],
            [
                'nik'               => '3374044404920004',
                'nama'              => 'Dewi Rahayu',
                'tipe'              => 'Multiguna',
                'nominal'           => 10000000,
                'tenor'             => 6,
                'pendapatan'        => 4500000,
                'catatan'           => 'Biaya pendidikan.',
                'tanggal_pengajuan' => Carbon::today()->subDays(10),
                'status'            => 'Ditolak',
            ],
        ];

        foreach ($data as $item) {
            Pengajuan::create($item);
        }
    }
}
