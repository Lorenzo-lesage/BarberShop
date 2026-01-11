<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    $barberId = auth()->id();

    $clients = User::where('is_barber', false)
        ->whereHas('appointments', function ($query) use ($barberId) {
            // Filtra solo i clienti che hanno almeno un appuntamento con ME
            $query->where('barber_id', $barberId);
        })
        ->withCount(['appointments' => function ($query) use ($barberId) {
            // Conta solo gli appuntamenti fatti con ME, non quelli totali
            $query->where('barber_id', $barberId);
        }])
        ->orderBy('name', 'asc')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Dashboard/Clients/Index', [
        'clients' => $clients,
        'breadcrumbs' => [
            ['label' => 'Dashboard', 'href' => route('dashboard')],
            ['label' => 'My Clients', 'href' => null],
        ],
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('Dashboard/Clients/Show', [
            'client' => $user->load([
                'appointments' => function ($query) {
                    $query->orderBy('appointment_time', 'desc')->take(10);
                }
            ]),
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'My Clients', 'href' => route('clients.index')],
                ['label' => $user->name, 'href' => null],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
