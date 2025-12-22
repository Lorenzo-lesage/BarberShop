<?php

namespace App\Http\Controllers;

use App\Models\Saloon;
use App\Models\SaloonException; // <--- AGGIUNGI QUESTO IMPORT
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SaloonController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Saloons/Index', [
            // Usiamo 'barber' invece di 'user'
            'saloons' => Saloon::with('barber:id,name')->get(),
        ]);
    }

    public function show(Saloon $saloon)
    {
        // Anche qui, carichiamo 'barber'
        $saloon->load(['barber:id,name', 'exceptions']);

        return Inertia::render('Public/Saloons/Show', [
            'saloon' => $saloon,
        ]);
    }

    public function edit()
    {
        // Usiamo firstOrCreate per assicurarci che l'utente abbia sempre un oggetto Saloon
        // associato, così il frontend non crasha cercando di leggere proprietà di 'null'
        $saloon = Auth::user()->saloon()->with('exceptions')->first();

        return Inertia::render('Dashboard/Barber/SaloonConfig', [
            'saloon' => $saloon,
            'auth_user' => Auth::user()->name,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'My Saloon', 'href' => null],
            ],
        ]);
    }

    public function storeException(Request $request)
    {
        $saloon = Auth::user()->saloon;

        $validated = $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:255',
        ]);

        // CONTROLLO SOVRAPPOSIZIONE
        $overlap = $saloon->exceptions()
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_date', '<=', $validated['start_date'])
                            ->where('end_date', '>=', $validated['end_date']);
                    });
            })->exists();

        if ($overlap) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Attention!',
                'description' => 'This period overlaps with an existing one.',
            ]);
        }

        $saloon->exceptions()->create($validated);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Saved!',
            'description' => 'The closed period has been saved.',
        ]);
    }

    public function destroyException($id) // <--- Cambiato da SaloonException a $id
    {
        $exception = SaloonException::findOrFail($id);

        // Controllo di sicurezza
        if ($exception->saloon->user_id !== Auth::id()) {
            abort(403);
        }

        $exception->delete();

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Removed!',
            'description' => 'The closed period has been removed.',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'opening_hours' => 'nullable|array',
        ]);

        Auth::user()->saloon()->updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Saved!',
            'description' => 'Configuration saved.',
        ]);
    }
}
