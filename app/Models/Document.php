<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $fillable = [
        'title',
        'description',
        'filename',
        'original_filename',
        'file_path',
        'file_type',
        'file_size',
        'visibility',
        'admin_id',
        'full_name',
        'category',
        'meta'
    ];

    protected $casts = [
        'visibility' => 'string'
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * Get the admin who uploaded this document
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    /**
     * Scope to get only public documents
     */
    public function scopePublic($query)
    {
        return $query->where('visibility', 'public');
    }

    /**
     * Scope to get only private documents
     */
    public function scopePrivate($query)
    {
        return $query->where('visibility', 'private');
    }
}
