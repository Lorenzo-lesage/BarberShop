<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\BarberRequestMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class BecomeBarberController extends Controller
{
    /**
     * Mostra la pagina "Become Barber"
     */
    public function index()
    {
        return Inertia::render('Auth/BecomeBarberPage');
    }

    /**
     * L'utente loggato invia richiesta per diventare barber
     */
    public function request()
    {
        $user = auth()->user();

        if ($user->is_barber) {
            abort(403);
        }

        // URL firmata per approvazione
        $approveUrl = URL::signedRoute(
            'become.barber.approve',
            ['user' => $user->id]
        );

        Mail::to('admin@barbershop.test')->send(
            new BarberRequestMail($user, $approveUrl)
        );

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Request sent!',
            'description' => 'We will review your request soon.',
        ]);
    }

    /**
     * L'admin approva il cambio ruolo
     */
    public function approve(User $user)
    {
        if ($user->is_barber) {
            return redirect('/')->with('toast', [
                'type' => 'info',
                'message' => 'User already barber',
            ]);
        }

        $user->update([
            'is_barber' => true,
        ]);

        return redirect('/')->with('toast', [
            'type' => 'success',
            'message' => 'Barber approved!',
        ]);
    }
}
