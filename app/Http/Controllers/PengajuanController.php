<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Http\Requests\StorePengajuanRequest;
use Inertia\Inertia;
use Carbon\Carbon;

class PengajuanController extends Controller
{
    public function dashboard()
    {
        $total     = Pengajuan::count();
        $pending   = Pengajuan::where('status', 'Pending')->count();
        $disetujui = Pengajuan::where('status', 'Disetujui')->count();
        $ditolak   = Pengajuan::where('status', 'Ditolak')->count();

        $totalNominalDisetujui = Pengajuan::where('status', 'Disetujui')->sum('nominal');

        $recentPengajuans = Pengajuan::latest('tanggal_pengajuan')
            ->limit(5)
            ->get()
            ->map(fn (Pengajuan $item) => [
                'id'                => $item->id,
                'nik'               => $item->nik,
                'nama'              => $item->nama,
                'tipe'              => $item->tipe,
                'nominal'           => $item->nominal,
                'tanggal_pengajuan' => $item->tanggal_pengajuan->format('d M Y'),
                'status'            => $item->status,
            ]);

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total'                  => $total,
                'pending'                => $pending,
                'disetujui'              => $disetujui,
                'ditolak'                => $ditolak,
                'total_nominal_disetujui'=> $totalNominalDisetujui,
            ],
            'recentPengajuans' => $recentPengajuans,
        ]);
    }

    public function index()
    {
        $pengajuans = Pengajuan::latest('tanggal_pengajuan')
            ->get()
            ->map(fn (Pengajuan $item) => [
                'id'                => $item->id,
                'nik'               => $item->nik,
                'nama'              => $item->nama,
                'tipe'              => $item->tipe,
                'nominal'           => $item->nominal,
                'tenor'             => $item->tenor,
                'pendapatan'        => $item->pendapatan,
                'catatan'           => $item->catatan,
                'tanggal_pengajuan' => $item->tanggal_pengajuan->format('d M Y'),
                'status'            => $item->status,
                'tagihan_per_bulan' => $item->tagihan_per_bulan,
            ]);

        return Inertia::render('Pengajuan/Index', [
            'pengajuans' => $pengajuans,
        ]);
    }

    public function store(StorePengajuanRequest $request)
    {
        Pengajuan::create([
            'nik'               => $request->nik,
            'nama'              => $request->nama,
            'tipe'              => $request->tipe,
            'nominal'           => $request->nominal,
            'tenor'             => $request->tenor,
            'pendapatan'        => $request->pendapatan,
            'catatan'           => $request->catatan,
            'tanggal_pengajuan' => Carbon::today(),
            'status'            => 'Pending',
        ]);

        return redirect()->back()->with('success', 'Pengajuan kredit berhasil ditambahkan.');
    }

    public function show(Pengajuan $pengajuan)
    {
        return Inertia::render('Pengajuan/Show', [
            'pengajuan' => [
                'id'                => $pengajuan->id,
                'nik'               => $pengajuan->nik,
                'nama'              => $pengajuan->nama,
                'tipe'              => $pengajuan->tipe,
                'nominal'           => $pengajuan->nominal,
                'tenor'             => $pengajuan->tenor,
                'pendapatan'        => $pengajuan->pendapatan,
                'catatan'           => $pengajuan->catatan,
                'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan->format('d M Y'),
                'status'            => $pengajuan->status,
                'tagihan_per_bulan' => $pengajuan->tagihan_per_bulan,
                'jadwal_cicilan'    => $pengajuan->jadwal_cicilan,
            ],
        ]);
    }

    public function approve(Pengajuan $pengajuan)
    {
        if ($pengajuan->status !== 'Pending') {
            return redirect()->back()->with('error', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $pengajuan->update(['status' => 'Disetujui']);

        return redirect()->back()->with('success', 'Pengajuan berhasil disetujui.');
    }

    public function reject(Pengajuan $pengajuan)
    {
        if ($pengajuan->status !== 'Pending') {
            return redirect()->back()->with('error', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $pengajuan->update(['status' => 'Ditolak']);

        return redirect()->back()->with('success', 'Pengajuan berhasil ditolak.');
    }
}
