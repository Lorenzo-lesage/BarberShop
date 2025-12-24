<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreSaloonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_barber;
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
                'message' => 'Access Denied',
                'description' => 'You are not authorized to perform this action.',
            ])
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'opening_hours' => 'nullable|array',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The saloon name is required.',
            'name.max' => 'The saloon name is too long (max 255 chars).',
            'address.required' => 'Please provide the saloon address.',
            'address.max' => 'The address is too long (max 255 chars).',
            'opening_hours.array' => 'Opening hours format is invalid.',
        ];
    }
}
