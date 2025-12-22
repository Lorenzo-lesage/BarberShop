<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'client:id',
        'barber_id',
        'saloon_id',
        'appointment_time',
        'status',
    ];

    protected $casts = [
        'appointment_time' => 'datetime',
    ];

    /**
     * Get the client associated with the appointment
     */
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Get the barber associated with the appointment
     */
    public function barber()
    {
        return $this->belongsTo(User::class, 'barber_id');
    }

    /**
     * Get the saloon associated with the appointment
     */
    public function saloon()
    {
        return $this->belongsTo(Saloon::class);
    }
}
