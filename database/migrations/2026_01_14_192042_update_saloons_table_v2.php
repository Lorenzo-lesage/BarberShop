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
        Schema::table('saloons', function (Blueprint $table) {
            $table->string('city')->after('address');
            $table->string('province', 2)->after('city');
            $table->string('region')->after('province');
            $table->string('cap', 5)->after('region');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saloons', function (Blueprint $table) {
            $table->dropColumn(['city', 'province', 'region', 'cap']);
        });
    }
};
