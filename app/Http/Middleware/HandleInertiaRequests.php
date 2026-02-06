<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Appointment;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => function () use ($request) {
                $user = $request->user();

                // 1. Se l'utente non esiste, restituiamo subito null per 'user'
                if (!$user) {
                    return [
                        'user' => null,
                    ];
                }
                $nowItaly = \Carbon\Carbon::now('Europe/Rome');

                // 2. Se l'utente esiste, carichiamo gli appuntamenti
                $appointments = $user->is_barber
                    ? Appointment::where('barber_id', $user->id)
                        ->with('client')
                        ->where('appointment_time', '>=', $nowItaly)
                        ->where('status', '!=', 'cancelled')
                        ->orderBy('appointment_time', 'asc')
                        ->take(3)
                        ->get()
                    : $user->appointments()
                        ->with('saloon')
                        ->where('appointment_time', '>=', $nowItaly)
                        ->where('status', '!=', 'cancelled')
                        ->orderBy('appointment_time', 'asc')
                        ->take(5)
                        ->get();

                // 3. Restituiamo i dati dell'utente
                return [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'is_barber' => $user->is_barber,
                        'appointments' => $appointments,
                        'profile_photo' => $user->profile_photo,
                        'profile_photo_url' => $user->profile_photo_url,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at
                    ],
                    'notification' => $request->user()
                        ? $request->user()->unreadNotifications()->first()
                        : null,
                ];
            },
            'flash' => [
                'toast' => fn() => $request->session()->get('toast')
            ],
        ];
    }
}

