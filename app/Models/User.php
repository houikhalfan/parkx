<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'vods_quota', // 👈 Ajout du champ quota
        'vods_target_per_month',

    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'vods_quota' => 'integer', // 👈 Cast
        ];
    }
    
    public function vods()
{
    return $this->hasMany(Vods::class);
}

// Nombre de VODS qu'il reste à faire (si l'admin a défini une cible)
public function getVodsToCompleteAttribute()
{
    $target = $this->vods_target_per_month ?? 0;

    $doneThisMonth = $this->vods()
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->count();

    return max(0, $target - $doneThisMonth);
}

}
