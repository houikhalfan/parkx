<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RejectSignatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:4000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Indiquez la raison du refus.',
        ];
    }
}
