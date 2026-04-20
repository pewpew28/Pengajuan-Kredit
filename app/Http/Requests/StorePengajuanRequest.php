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
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:Sepeda Motor,Mobil,Multiguna',
            'nominal' => 'required|numeric|min:1|max:200000000',
            'tenor' => 'required|integer|min:1|max:24',
            'pendapatan' => 'required|numeric|min:1000000',
            'catatan' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'pendapatan.min' => 'Nasabah belum dapat mengajukan pinjaman (pendapatan minimal Rp 1.000.000)',
            'nominal.max' => 'Nominal maksimal pinjaman adalah Rp 200.000.000',
            'tenor.max' => 'Tenor maksimal adalah 24 bulan',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $count = Pengajuan::countByName($this->nama);

            if ($count >= 3) {
                $validator->errors()->add('nama', 'Nasabah sudah mencapai batas maksimal 3 pengajuan');
            }
        });
    }
}
