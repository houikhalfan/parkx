<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SignatureRequestComment extends Model
{
    protected $fillable = [
        'signature_request_id',
        'author_type', // App\Models\Contractor | App\Models\Admin
        'author_id',
        'body',
    ];

    public function signatureRequest()
    {
        return $this->belongsTo(SignatureRequest::class);
    }

    public function author()
    {
        return $this->morphTo();
    }
}
