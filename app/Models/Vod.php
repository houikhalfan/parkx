<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

/**
 * @property int|null    $due_year
 * @property int|null    $due_month
 * @property int|null    $week_of_year
 * @property \Carbon\Carbon|null $completed_at
 * @property bool        $has_danger
 * @property int         $danger_count
 * @property array|null  $risk_breakdown
 * @property string|null $pdf_path
 * @property string|null $thumb_path
 */
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

        // New analytics/storage helpers
        'due_year',
        'due_month',
        'week_of_year',
        'completed_at',
        'has_danger',
        'danger_count',
        'risk_breakdown',
        'pdf_path',
        'thumb_path',
    ];

    protected $casts = [
        'date'                  => 'date',
        'completed_at'          => 'datetime',

        'personnes_observees'   => 'array',
        'entreprise_observee'   => 'array',
        'pratiques'             => 'array',
        'comportements'         => 'array',
        'conditions'            => 'array',
        'correctives'           => 'array',

        'has_danger'            => 'boolean',
        'danger_count'          => 'integer',
        'risk_breakdown'        => 'array',
    ];

    // Optional defaults so JSON fields are always arrays
    protected $attributes = [
        'personnes_observees' => '[]',
        'entreprise_observee' => '[]',
        'pratiques'           => '[]',
        'comportements'       => '[]',
        'conditions'          => '[]',
        'correctives'         => '[]',
        'risk_breakdown'      => '[]',
    ];

    /* ---------------- Relationships ---------------- */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /* ---------------- Accessors / Helpers ---------------- */

    public function getPdfUrlAttribute(): ?string
    {
        return $this->pdf_path ? Storage::url($this->pdf_path) : null;
    }

    public function getThumbUrlAttribute(): ?string
    {
        return $this->thumb_path ? Storage::url($this->thumb_path) : null;
    }

    public function getMonthKeyAttribute(): ?string
    {
        if (!$this->due_year || !$this->due_month) return null;
        return sprintf('%04d-%02d', $this->due_year, $this->due_month);
    }

    public function getMonthLabelAttribute(): ?string
    {
        if (!$this->date) return null;
        return Carbon::parse($this->date)->locale('fr')->translatedFormat('F Y');
    }

    public function getIsCompletedAttribute(): bool
    {
        return !is_null($this->completed_at);
    }

    /* ---------------- Query Scopes ---------------- */

    public function scopeForMonth(Builder $q, int $year, int $month): Builder
    {
        return $q->where('due_year', $year)->where('due_month', $month);
    }

    public function scopeCompleted(Builder $q): Builder
    {
        return $q->whereNotNull('completed_at');
    }

    public function scopeWithDanger(Builder $q): Builder
    {
        return $q->where('has_danger', true);
    }

    public function scopeByUser(Builder $q, int $userId): Builder
    {
        return $q->where('user_id', $userId);
    }

    /* ---------------- Model Events ---------------- */

    protected static function booted(): void
    {
        static::saving(function (Vod $vod) {
            // Keep time buckets in sync with "date"
            if ($vod->isDirty('date') && $vod->date) {
                $d = $vod->date instanceof Carbon ? $vod->date : Carbon::parse($vod->date);
                $vod->due_year     = (int) $d->year;
                $vod->due_month    = (int) $d->month;
                $vod->week_of_year = (int) $d->isoWeek(); // ISO week number
            }

            // Derive danger flags from conditions JSON
            if ($vod->isDirty('conditions')) {
                $arr = is_array($vod->conditions)
                    ? $vod->conditions
                    : (json_decode($vod->conditions ?? '[]', true) ?: []);
                $count = count(array_filter($arr ?? []));
                $vod->danger_count = $count;
                $vod->has_danger   = $count > 0;
            }
        });
    }
}
