<?php

namespace App\Http\Controllers;

use App\Models\Saloon;
use App\Models\SaloonException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class SaloonController extends Controller
{
    /**
     * Show public page for saloons
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Public/Saloons/Index', [
            'saloons' => Saloon::with('barber:id,name')->get(),

        ]);
    }

    /**
     * Show Dashboard page for saloons
     * @return \Inertia\Response
     */
    public function dashboardIndex()
    {
        return Inertia::render('Dashboard/Saloons/DashboardIndex', [
            'saloons' => Saloon::with('barber:id,name')->get(),
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'Saloons', 'href' => null],
            ],
        ]);
    }

    /**
     * Show Detail saloon in public route
     * @param Saloon $saloon
     * @return \Inertia\Response
     */
    public function show(Saloon $saloon): Response|RedirectResponse
    {

        if (Auth::id() === $saloon->user_id) {
            return back() // Assicurati che il nome rotta sia corretto
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Management Area',
                    'description' => 'You are the owner, we have taken you to the management preview.',
                ]);
        }

        // Anche qui, carichiamo 'barber'
        $saloon->load(['barber:id,name', 'exceptions']);

        return Inertia::render('Public/Saloons/Show', [
            'saloon' => $saloon,
        ]);
    }
    /**
     * Show Detail page in dashboard routes
     * @param Saloon $saloon
     * @return \Inertia\Response
     */
    public function dashboardShow(Saloon $saloon): Response|RedirectResponse
    {
        if (Auth::id() === $saloon->user_id) {
            return back() // Assicurati che il nome rotta sia corretto
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Management Area',
                    'description' => 'You are the owner, we have taken you to the management preview.',
                ]);
        }
        // Carichiamo le relazioni necessarie per il singolo salone
        $saloon->load(['barber:id,name', 'exceptions']);

        return Inertia::render('Dashboard/Saloons/DashboardShow', [
            'saloon' => $saloon,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'Saloons', 'href' => route('saloons.dashboard.index')],
                ['label' => $saloon->name, 'href' => null],
            ],
        ]);
    }

    /**
     * View to create or edit saloon
     * @return \Inertia\Response
     */
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

    /**
     * Function to create or update saloon
     * @param Request $request
     * @return RedirectResponse
     */
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

    public function destroy()
    {
        // Recuperiamo il salone dell'utente autenticato
        $saloon = Auth::user()->saloon;

        if (!$saloon) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error!',
                'description' => 'No saloon found to delete.',
            ]);
        }

        // Eliminiamo il salone
        // (Nota: se hai impostato le chiavi esterne con 'onDelete cascade' nel DB,
        // verranno eliminate automaticamente anche le eccezioni e gli orari)
        $saloon->delete();

        return redirect()->route('dashboard')->with('toast', [
            'type' => 'success',
            'message' => 'Saloon Deleted',
            'description' => 'Your saloon and all its data have been removed.',
        ]);
    }

    /**
     * Summary of storeException
     * @param Request $request
     * @return RedirectResponse
     */
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

}
