<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Pengajuan extends Model
{
    protected $fillable = [
        'nik',
        'nama',
        'tipe',
        'nominal',
        'tenor',
        'pendapatan',
        'catatan',
        'tanggal_pengajuan',
        'status',
    ];

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'nominal'           => 'integer',
        'tenor'             => 'integer',
        'pendapatan'        => 'integer',
    ];

    protected function tagihanPerBulan(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->tenor > 0 ? (int) round($this->nominal / $this->tenor) : 0,
        );
    }

    protected function jadwalCicilan(): Attribute
    {
        return Attribute::make(
            get: function () {
                $jadwal   = [];
                $perBulan = $this->tagihan_per_bulan;
                $mulai    = $this->tanggal_pengajuan->copy()->addMonth();

                for ($i = 1; $i <= $this->tenor; $i++) {
                    $jadwal[] = [
                        'bulan'         => $i,
                        'tanggal'       => $mulai->copy()->addMonths($i - 1)->format('d M Y'),
                        'tagihan'       => $perBulan,
                        'sisa_pinjaman' => max(0, $this->nominal - ($perBulan * $i)),
                    ];
                }

                return $jadwal;
            },
        );
    }

    public static function countByNik(string $nik): int
    {
        return self::where('nik', $nik)->count();
    }
}
