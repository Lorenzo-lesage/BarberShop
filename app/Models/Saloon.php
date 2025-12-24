<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Saloon extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'opening_hours',
    ];

    /**
     * Transform the opening hours from JSON to an array PHP and reverse.
     */
    protected $casts = [
        'opening_hours' => 'array',
    ];

    /**
     * Get the barber that owns the saloon.
     */
    public function barber()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the appointments for the saloon.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the exceptions for the saloon.
     */
    public function exceptions()
    {
        return $this->hasMany(SaloonException::class);
    }

    /**
     * Function to don't overlap data
     * @param array $data
     * @return bool
     */
    public function hasExceptionOverlap(array $data): bool
    {
        return $this->exceptions()
            ->where(function ($query) use ($data) {
                $query->whereBetween('start_date', [$data['start_date'], $data['end_date']])
                    ->orWhereBetween('end_date', [$data['start_date'], $data['end_date']])
                    ->orWhere(function ($q) use ($data) {
                        $q->where('start_date', '<=', $data['start_date'])
                            ->where('end_date', '>=', $data['end_date']);
                    });
            })->exists();
    }
}
