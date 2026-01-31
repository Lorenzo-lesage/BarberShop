<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SaloonPhoto;

class Saloon extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'opening_hours',
        'city',
        'province',
        'region',
        'cap',
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

    // Tutte le foto (galleria + principale)
    public function photos()
    {
        return $this->hasMany(SaloonPhoto::class);
    }

    // Accesso rapido alla foto di copertina
    public function mainPhoto()
    {
        return $this->hasOne(SaloonPhoto::class)->where('is_main', true);
    }

    public function setMainPhoto($path)
    {
        $oldPhotos = $this->photos()->where('is_main', true)->get();
        foreach ($oldPhotos as $old) {
            \Storage::disk('public')->delete($old->path);
            $old->delete();
        }

        // 2. Crea la nuova foto
        $newPhoto = $this->photos()->create([
            'path' => $path,
            'is_main' => true
        ]);

        $this->unsetRelation('mainPhoto');

        return $newPhoto;
    }
}
