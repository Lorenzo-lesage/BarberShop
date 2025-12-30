<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaloonExceptionRequest;
use App\Http\Requests\StoreSaloonRequest;
use App\Models\Saloon;
use App\Models\SaloonException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class SaloonController extends Controller
{

    /**
     * Get Saloons data and cache it for 1 hour
     * @param mixed $page
     */
    private function getSaloonsData($page)
    {
        return Cache::remember("saloons_shared_list_page_{$page}", now()->addHours(1), function () {
            return Saloon::with('barber:id,name')
                ->latest()
                ->paginate(8)
                ->withQueryString();
        });
    }

    /**
     * Get single saloon data and cache it for 24 hours
     */
    private function getSingleSaloonData(Saloon $saloon)
    {
        return Cache::remember("saloon_shared_detail_{$saloon->id}", now()->addHours(24), function () use ($saloon) {
            return $saloon->load(['barber:id,name', 'exceptions']);
        });
    }

    /**
     * Clear Saloon cache
     */
    private function clearSaloonCache($saloonId = null)
    {
        // Svuotiamo la lista (almeno la prima pagina)
        Cache::forget("saloons_shared_list_page_1");

        // Se abbiamo un ID, svuotiamo il dettaglio specifico
        if ($saloonId) {
            Cache::forget("saloon_shared_detail_{$saloonId}");
        }
    }

    /**
     * Show public page for saloons
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        return Inertia::render('Public/Saloons/Index', [
            'saloons' => $this->getSaloonsData($request->get('page', 1)),
        ]);
    }

    /**
     * Show Dashboard page for saloons
     * @return \Inertia\Response
     */
    public function dashboardIndex(Request $request)
    {
        return Inertia::render('Dashboard/Saloons/DashboardIndex', [
            'saloons' => $this->getSaloonsData($request->get('page', 1)),
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'Saloons', 'href' => null],
            ],
        ]);
    }


    /**
     * Show single saloon
     * @param Saloon $saloon
     * @return \Inertia\Response
     */
    public function show(Saloon $saloon): Response|RedirectResponse
    {
        return Inertia::render('Public/Saloons/Show', [
            'saloon' => $this->getSingleSaloonData($saloon),
        ]);
    }

    /**
     * Show Dashboard single saloon
     * @param Saloon $saloon
     * @return \Inertia\Response
     */
    public function dashboardShow(Saloon $saloon): Response|RedirectResponse
    {
        return Inertia::render('Dashboard/Saloons/DashboardShow', [
            'saloon' => $this->getSingleSaloonData($saloon),
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
    public function store(StoreSaloonRequest $request)
    {
        $saloon = Auth::user()->saloon()->updateOrCreate(
            ['user_id' => Auth::id()],
            $request->validated()
        );

        // SVUOTA CACHE: Dati aggiornati!
        $this->clearSaloonCache($saloon->id);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Saved!',
            'description' => 'Configuration saved.',
        ]);
    }

    /**
     * Function to delete saloon
     * @return RedirectResponse
     */
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

        // SVUOTA CACHE: Dati aggiornati!
        $this->clearSaloonCache($saloon->id);

        return redirect()->route('dashboard')->with('toast', [
            'type' => 'success',
            'message' => 'Saloon Deleted',
            'description' => 'Your saloon and all its data have been removed.',
        ]);
    }

    /**
     * Function to create or update Exception
     * @param Request $request
     * @return RedirectResponse
     */
    public function storeException(StoreSaloonExceptionRequest $request)
    {
        // L'autorizzazione e la validazione base sono già state fatte!
        $saloon = Auth::user()->saloon;
        $validated = $request->validated();

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

        // SVUOTA CACHE: Le eccezioni sono cambiate!
        $this->clearSaloonCache($saloon->id);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Saved!',
            'description' => 'The closed period has been saved.',
        ]);
    }


    /**
     * Function to delete Exception
     * @param mixed $id
     * @return RedirectResponse
     */
    public function destroyException($id)
    {
        $saloon = Auth::user()->saloon;
        $exception = $saloon->exceptions()->findOrFail($id);
        $exception->delete();

        // SVUOTA CACHE
        $this->clearSaloonCache($saloon->id);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Removed!',
            'description' => 'The closed period has been removed.',
        ]);
    }

}


