<?php

use App\Http\Controllers\PengajuanController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'));

Route::get('/dashboard', [PengajuanController::class, 'dashboard'])->name('dashboard');

Route::get('/pengajuan', [PengajuanController::class, 'index'])->name('pengajuan.index');
Route::post('/pengajuan', [PengajuanController::class, 'store'])->name('pengajuan.store');
Route::get('/pengajuan/{pengajuan}', [PengajuanController::class, 'show'])->name('pengajuan.show');
Route::patch('/pengajuan/{pengajuan}/approve', [PengajuanController::class, 'approve'])->name('pengajuan.approve');
Route::patch('/pengajuan/{pengajuan}/reject', [PengajuanController::class, 'reject'])->name('pengajuan.reject');
