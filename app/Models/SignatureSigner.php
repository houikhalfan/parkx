<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SignatureSigner extends Model
{
    protected $fillable = [
        'signature_request_id', 'name', 'email', 'sign_order',
        'signed_at', 'signature_image_path', 'signature_text', 'signed_ip'
    ];

    protected $dates = ['signed_at'];

    public function request(): BelongsTo {
        return $this->belongsTo(SignatureRequest::class, 'signature_request_id');
    }

    public function tokens(): HasMany {
        return $this->hasMany(SignerToken::class);
    }
}
