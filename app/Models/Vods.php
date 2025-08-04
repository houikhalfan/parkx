<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vods extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'projet',
        'activite',
        'observateur',
        'personnesObservees',
        'entrepriseObservee',
        'data', // JSON ou texte structuré contenant pratiques/comportements/conditions/etc.
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
