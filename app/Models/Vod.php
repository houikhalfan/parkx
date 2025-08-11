<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'projet',
        'activite',
        'observateur',
        'personnes_observees',
        'entreprise_observee',
        'pratiques',
        'comportements',
        'conditions',
        'correctives',
    ];
protected $casts = [
    'date'                 => 'date', 
    'personnes_observees' => 'array',
    'entreprise_observee' => 'array',
    'pratiques' => 'array',
    'comportements' => 'array',
    'conditions' => 'array',
    'correctives' => 'array',
];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
