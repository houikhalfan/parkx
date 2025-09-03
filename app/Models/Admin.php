<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Admin extends Authenticatable
{
    use Notifiable;
    
    protected $fillable = ['name', 'email', 'password'];

    /**
     * Get the documents uploaded by this admin
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
