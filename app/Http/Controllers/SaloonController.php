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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class SaloonController extends Controller
{

    /**
     * Get Saloons data and cache it for 1 hour
     * @param mixed $page
     */
    private function getSaloonsData($page)
    {
        return Cache::remember("saloons_shared_list_page_{$page}", now()->addHours(1), function () {
            return Saloon::with('barber:id,name', 'mainPhoto')
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
            // Ricarichiamo il modello dalla query per assicurarci che
            // l'array salvato in cache contenga tutte le relazioni
            return Saloon::with([
                'barber:id,name',
                'exceptions',
                'photos',
                'mainPhoto',
                'appointments' => function ($query) {
                    $query->where('appointment_time', '>=', now()->startOfDay())
                        ->where('status', '!=', 'cancelled');
                }
            ])->find($saloon->id);
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
        // Carichiamo il salone dell'utente con tutte le relazioni necessarie
        $saloon = Auth::user()->saloon()
            ->with(['exceptions', 'photos', 'mainPhoto'])
            ->first() ?? new Saloon; // Se non esiste, crea un'istanza vuota in memoria

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
        // 1. Recuperiamo i dati validati (inclusi city, province, ecc.)
        $validated = $request->validated();

        if (isset($validated['opening_hours'])) {
            foreach ($validated['opening_hours'] as $day => $hours) {
                // Questa riga trasforma "0", "1", "true", "false" in veri booleani PHP
                $validated['opening_hours'][$day]['is_closed'] = filter_var($hours['is_closed'], FILTER_VALIDATE_BOOLEAN);
            }
        }
        // Usiamo una transazione: se il caricamento dei file fallisce, il DB non viene sporcato
        return DB::transaction(function () use ($request, $validated) {

            // 2. Aggiorna o crea il salone
            $saloon = Auth::user()->saloon()->updateOrCreate(
                ['user_id' => Auth::id()],
                $validated
            );

            // 3. Gestione Foto Principale (Cover)
            if ($request->hasFile('main_photo')) {
                // Eliminiamo la vecchia cover se esiste
                $oldMain = $saloon->mainPhoto;
                if ($oldMain) {
                    Storage::disk('public')->delete($oldMain->path);
                    $oldMain->delete();
                }

                // Salviamo la nuova
                $path = $request->file('main_photo')->store('saloons/covers', 'public');
                $saloon->photos()->create([
                    'path' => $path,
                    'is_main' => true
                ]);
            }

            // 4. Gestione Galleria (Multiple)
            if ($request->hasFile('gallery')) {
                foreach ($request->file('gallery') as $file) {
                    $path = $file->store('saloons/gallery', 'public');
                    $saloon->photos()->create([
                        'path' => $path,
                        'is_main' => false
                    ]);
                }
            }

            // 5. Pulizia Cache
            $this->clearSaloonCache($saloon->id);

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'Success!',
                'description' => 'Your saloon information has been saved.',
            ]);
        });
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

    /**
     * Show saloons where the current client has made appointments
     */
    public function mySaloons(Request $request)
    {
        $userId = Auth::id();

        $saloons = Saloon::whereHas('appointments', function ($query) use ($userId) {
            $query->where('client_id', $userId);
        })
            ->with(['barber:id,name'])
            ->withCount([
                    'appointments' => function ($query) use ($userId) {
                        $query->where('client_id', $userId);
                    }
                ])
            ->latest()
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('Dashboard/Clients/MySaloons', [
            'saloons' => $saloons,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'My Saloons', 'href' => null],
            ],
        ]);
    }

    /**
     * Function to delete a specific gallery photo
     * @param int $id
     * @return RedirectResponse
     */
    public function destroyPhoto($id)
    {
        // 1. Recupera il salone dell'utente autenticato
        $saloon = Auth::user()->saloon;

        if (!$saloon) {
            return back()->with('toast', ['type' => 'error', 'message' => 'Saloon not found.']);
        }

        // 2. Cerca la foto solo tra quelle che appartengono a QUESTO salone
        $photo = $saloon->photos()->findOrFail($id);

        // 3. Elimina il file fisico dal disco
        if (\Storage::disk('public')->exists($photo->path)) {
            \Storage::disk('public')->delete($photo->path);
        }

        // 4. Elimina il record dal DB
        $photo->delete();

        // 5. Svuota la cache (perché i dati del salone sono cambiati)
        $this->clearSaloonCache($saloon->id);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Removed!',
            'description' => 'The photo has been removed from your gallery.',
        ]);
    }

}


