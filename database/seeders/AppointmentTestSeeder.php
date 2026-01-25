<?php

namespace Database\Seeders;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AppointmentTestSeeder extends Seeder
{
    public function run(): void
    {
        // Puliamo i vecchi dati di test per l'ID 69 per non fare confusione
        Appointment::where('barber_id', 69)->delete();

        // Generiamo dati per gli ultimi 90 giorni
        for ($i = 0; $i < 40; $i++) {
            Appointment::create([
                'client_id' => 74, // Il tuo client di test
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
