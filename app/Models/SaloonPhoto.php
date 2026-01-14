<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaloonPhoto extends Model
{
    use HasFactory;

    // Definiamo i campi che possono essere salvati in massa
    protected $fillable = [
        'saloon_id',
        'path',
        'is_main',
    ];

    /**
     * Cast dei tipi di dato.
     * Forza 'is_main' a essere trattato come un vero booleano (true/false)
     */
    protected $casts = [
        'is_main' => 'boolean',
    ];

    /**
     * Relazione inversa: ogni foto appartiene a un salone specifico.
     */
    public function saloon()
    {
        return $this->belongsTo(Saloon::class);
    }
}
