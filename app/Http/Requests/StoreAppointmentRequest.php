<?php

namespace App\Http\Requests;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ricordati di impostarlo a true se l'utente è loggato
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'saloon_id' => 'required|exists:saloons,id',
            'barber_id' => 'required|exists:users,id',
            'appointment_time' => 'required|date|after:now',
        ];
    }

    /**
     * Messaggi di errore personalizzati per le regole standard
     */
    public function messages(): array
    {
        return [
            'appointment_time.after' => 'You cannot book an appointment in the past.',
            'saloon_id.exists' => 'The selected saloon does not exist.',
        ];
    }

    /**
     * Logica extra: controlla se il barbiere è occupato
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $time = Carbon::parse($this->appointment_time)->format('Y-m-d H:i:s');

            $exists = Appointment::where('barber_id', $this->barber_id)
                ->where('appointment_time', $time)
                ->where('status', '!=', 'cancelled')
                ->exists();

            if ($exists) {
                $validator->errors()->add(
                    'appointment_time',
                    'The barber is already busy at that time.'
                );
            }
        });
    }
}
