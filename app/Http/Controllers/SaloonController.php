<?php

namespace App\Http\Controllers;

use App\Models\Saloon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SaloonController extends Controller
{
    /**
     * Mostra la pagina di gestione del salone
     */
    public function edit()
    {
        // Recuperiamo il salone del barbiere loggato
        $saloon = Auth::user()->saloon;

        return Inertia::render('Dashboard/Barber/SaloonConfig', [
            'saloon' => $saloon,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'Configurazione Salone', 'href' => null], // Ultimo elemento, niente link
            ],
        ]);
    }

    /**
     * Salva o aggiorna i dati del salone
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'opening_hours' => 'nullable|array',
        ]);

        // Aggiorna se esiste, altrimenti crea
        Auth::user()->saloon()->updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Saloon updated!',
            'description' => 'Your saloon has been updated successfully.',
        ]);
    }
}
