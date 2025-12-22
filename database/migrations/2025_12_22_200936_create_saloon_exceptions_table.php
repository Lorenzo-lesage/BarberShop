<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('saloon_exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('saloon_id')->constrained()->onDelete('cascade');
            $table->date('start_date'); // Giorno inizio ferie
            $table->date('end_date');   // Giorno fine ferie (se è un solo giorno, coincide con start)
            $table->string('reason')->nullable(); // Es: "Vacanze di Natale"
            $table->boolean('is_closed')->default(true); // Se il salone è totalmente chiuso
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saloon_exceptions');
    }
};
