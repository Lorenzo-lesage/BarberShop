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
            // Nuovi campi indirizzo
            'city' => 'required|string|max:255',
            'province' => 'required|string|size:2', // Sigla (MI, RM, ecc.)
            'region' => 'required|string|max:255',
            'cap' => 'required|string|size:5',
            'opening_hours' => 'nullable|array',

            // Gestione Immagini
            // main_photo è la cover principale
            'main_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            // gallery è un array di file
            'gallery' => 'nullable|array|max:10',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
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
            'city.required' => 'City is required.',
            'province.required' => 'Province (2 letters) is required.',
            'province.size' => 'The province must be exactly 2 letters.',
            'cap.size' => 'The CAP must be 5 digits.',
            'main_photo.image' => 'The cover must be an image file.',
            'main_photo.max' => 'The cover image cannot be larger than 5MB.',
            'gallery.*.image' => 'Each file in the gallery must be an image.',
            'gallery.*.max' => 'Each gallery image cannot be larger than 5MB.',
        ];
    }
}
