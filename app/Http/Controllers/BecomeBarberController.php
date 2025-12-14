<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class BecomeBarberController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/BecomeBarberPage', [
            'submitRoute' => 'become.barber.register',
            'isBarber' => true, // <- qui passi true al form
        ]);
    }
}

