<?php

namespace Database\Seeders;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AppointmentTestSeeder extends Seeder
{
    public function run(): void
    {

        // Generiamo dati per gli ultimi 90 giorni
        for ($i = 0; $i < 90; $i++) {
            Appointment::create([
                'client_id' => 85, // Il tuo client di test
                'barber_id' => 69, // Il tuo barber ID
                'saloon_id' => 12, // Il tuo saloon ID
                // Genera una data casuale tra oggi e 90 giorni fa
                'appointment_time' => Carbon::now()->subDays(rand(0, 90))->setHour(rand(9, 18)),
                'status' => 'confirmed',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Sistema CORE popolato con 40 nodi di test.');
    }
}
