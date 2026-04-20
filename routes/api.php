<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengajuanController;

Route::prefix('pengajuan')->group(function () {
    Route::get('/', [PengajuanController::class, 'index']);
    Route::post('/', [PengajuanController::class, 'store']);
    Route::get('/{pengajuan}', [PengajuanController::class, 'show']);
    Route::patch('/{pengajuan}/approve', [PengajuanController::class, 'approve']);
    Route::patch('/{pengajuan}/reject', [PengajuanController::class, 'reject']);
});
