<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Pengajuan;

class StorePengajuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nik'       => ['required', 'digits:16'],
            'nama'      => ['required', 'string', 'max:255'],
            'tipe'      => ['required', 'in:Sepeda Motor,Mobil,Multiguna'],
            'nominal'   => ['required', 'integer', 'min:1', 'max:200000000'],
            'tenor'     => ['required', 'integer', 'min:1', 'max:24'],
            'pendapatan'=> ['required', 'integer', 'min:1000000'],
            'catatan'   => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'nik.required'       => 'NIK wajib diisi.',
            'nik.digits'         => 'NIK harus terdiri dari 16 digit angka.',
            'nama.required'      => 'Nama nasabah wajib diisi.',
            'tipe.required'      => 'Tipe pengajuan wajib dipilih.',
            'tipe.in'            => 'Tipe pengajuan tidak valid.',
            'nominal.required'   => 'Nominal pinjaman wajib diisi.',
            'nominal.min'        => 'Nominal pinjaman harus lebih dari 0.',
            'nominal.max'        => 'Nominal maksimal pinjaman adalah Rp 200.000.000.',
            'tenor.required'     => 'Tenor wajib diisi.',
            'tenor.min'          => 'Tenor minimal adalah 1 bulan.',
            'tenor.max'          => 'Tenor maksimal adalah 24 bulan.',
            'pendapatan.required'=> 'Pendapatan bulanan wajib diisi.',
            'pendapatan.min'     => 'Nasabah belum dapat mengajukan pinjaman (pendapatan minimal Rp 1.000.000).',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $this->nik) return;

            if (Pengajuan::countByNik($this->nik) >= 3) {
                $validator->errors()->add('nik', 'Nasabah dengan NIK ini sudah mencapai batas maksimal 3 pengajuan.');
            }
        });
    }
}
