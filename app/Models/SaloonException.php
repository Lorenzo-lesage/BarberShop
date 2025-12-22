<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaloonException extends Model
{
    protected $fillable = [
        'saloon_id',
        'start_date',
        'end_date',
        'reason',
        'is_closed'
    ];

    // Cast delle date per usarle come oggetti Carbon in PHP
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_closed' => 'boolean',
    ];

    public function saloon()
    {
        return $this->belongsTo(Saloon::class);
    }
}
