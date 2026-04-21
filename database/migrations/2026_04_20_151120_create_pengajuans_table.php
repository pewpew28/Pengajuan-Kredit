<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuans', function (Blueprint $table) {
            $table->id();
            $table->string('nik', 16)->index();
            $table->string('nama');
            $table->enum('tipe', ['Sepeda Motor', 'Mobil', 'Multiguna']);
            $table->bigInteger('nominal');
            $table->integer('tenor');
            $table->bigInteger('pendapatan');
            $table->text('catatan')->nullable();
            $table->date('tanggal_pengajuan');
            $table->enum('status', ['Pending', 'Disetujui', 'Ditolak'])->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuans');
    }
};
