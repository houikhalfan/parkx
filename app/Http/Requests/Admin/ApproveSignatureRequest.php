<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ApproveSignatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        // already protected by AdminAuth middleware
        return true;
    }

    public function rules(): array
    {
        return [
            'signed_file' => ['required', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:10240'],
            'comment'     => ['nullable', 'string', 'max:4000'],
        ];
    }

    public function messages(): array
    {
        return [
            'signed_file.required' => 'Veuillez joindre le document signé.',
            'signed_file.mimes'    => 'Formats autorisés: pdf, doc, docx, png, jpg, jpeg.',
            'signed_file.max'      => 'Taille maximale: 10 Mo.',
        ];
    }
}
