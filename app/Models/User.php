<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_barber',
        'provider',
        'provider_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_barber' => 'boolean',
        ];
    }

    /**
     * Get the saloon associated with the user
     */
    public function saloon()
    {
        return $this->hasOne(Saloon::class);
    }

    /**
     * If the user is a Barber, gets its Clients
     */
    public function clients()
    {
        // Relazione molti-a-molti: un barbiere ha molti utenti (clienti)
        return $this->belongsToMany(User::class, 'barber_client', 'barber_id', 'client_id')
            ->withTimestamps();
    }

    /**
     * If the user is a Client, gets its Barbers
     */
    public function barbers()
    {
        // Relazione molti-a-molti: un cliente ha molti utenti (barbieri)
        return $this->belongsToMany(User::class, 'barber_client', 'client_id', 'barber_id')
            ->withTimestamps();
    }
}
