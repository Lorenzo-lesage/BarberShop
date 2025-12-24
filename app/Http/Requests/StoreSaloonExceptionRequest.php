<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;

class StoreSaloonExceptionRequest extends FormRequest
{
    /**
     * Determina se l'utente è autorizzato a fare questa richiesta.
     */
    public function authorize(): bool
    {
        // Solo chi ha un salone può aggiungere eccezioni
        return Auth::user()->saloon !== null;
    }

    /**
     * Se l'autorizzazione fallisce, invece di una pagina 403 grigia,
     * reindirizziamo l'utente con un messaggio Toast.
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(
            back()->with('toast', [
                'type' => 'error',
                'message' => 'Forbidden',
                'description' => 'You must have a saloon to add exceptions.',
            ])
        );
    }

    /**
     * Regole di validazione.
     */
    public function rules(): array
    {
        return [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:255',
        ];
    }

    /**
     * Messaggi personalizzati.
     */
    public function messages(): array
    {
        return [
            'start_date.required' => 'Start date is required.',
            'start_date.after_or_equal' => 'Start date must be after or equal to today.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'reason.max' => 'The reason is too long (max 255 chars).',
        ];
    }
}
