<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatReport extends Model
{
    protected $fillable = [
        'contractor_id',
        'payload',
        'trir',
        'ltir',
        'dart',
        'total_hours',
        'pdf_path',
        'status',
    ];

    protected $casts = [
        'payload' => 'array',
        'trir'    => 'float',
        'ltir'    => 'float',
        'dart'    => 'float',
    ];
}
