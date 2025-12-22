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
}
