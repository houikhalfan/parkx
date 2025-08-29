<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    protected $fillable = ['name', 'responsible_user_id'];

    public function responsible()
    {
        return $this->belongsTo(\App\Models\User::class, 'responsible_user_id');
    }

    public function users()
    {
        return $this->hasMany(\App\Models\User::class, 'site_id');
    }

    // (optional) Backward-compat so old UI that reads "manager_user_id"
    // from JSON won't crash even if we forget a place.
    protected $appends = ['manager_user_id'];
    public function getManagerUserIdAttribute()
    {
        return $this->responsible_user_id;
    }
}

