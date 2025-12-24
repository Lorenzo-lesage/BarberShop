<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaloonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_barber;
    }

    protected function failedAuthorization()
    {
        abort(403, 'Only barbers can manage a saloon.');
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
