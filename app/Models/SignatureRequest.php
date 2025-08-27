<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SignatureRequest extends Model
{
    protected $fillable = [
        'contractor_id',
        'admin_id',
        'title',
        'message',
        'original_path',
        'signed_path',
        'status',       // 'pending' | 'signed' | 'rejected'
        'signed_at',
        'rejected_at',
        'meta',
    ];

    protected $casts = [
        'signed_at'   => 'datetime',
        'rejected_at' => 'datetime',
        'meta'        => 'array',
    ];

    public function contractor()
    {
        return $this->belongsTo(Contractor::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    // Correct relation: FK = signature_request_id
    public function comments()
    {
        return $this->hasMany(SignatureRequestComment::class, 'signature_request_id')
                    ->latest();
    }

    // (optional alias if you referenced requestComments() elsewhere)
    public function requestComments()
    {
        return $this->comments();
    }
    public function signers() {
    return $this->hasMany(\App\Models\SignatureSigner::class);
}
public function events() { return $this->hasMany(\App\Models\SignatureEvent::class); }
public function assignedUser() { return $this->belongsTo(\App\Models\User::class, 'assigned_user_id'); }

}
