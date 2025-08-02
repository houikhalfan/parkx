<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Contractor extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'company_name',
        'role',
        'is_approved',
    ];

    protected $hidden = ['password'];
}
