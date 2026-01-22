<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\Saloon;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\StoreAppointmentRequest;


class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    $user = $request->user();

    return Inertia::render('Dashboard/Appointments/Index', [
        // Appuntamenti Futuri
        'appointments' => $this->getAppointmentsData($user, 'upcoming', $request->query('page')),

        // Appuntamenti Passati
        'pastAppointments' => $this->getAppointmentsData($user, 'past', $request->query('past_page')),

        'breadcrumbs' => [
            ['label' => 'Dashboard', 'href' => route('dashboard')],
            ['label' => $user->is_barber ? 'Appointments Received' : 'My Appointments', 'href' => null],
        ],
    ]);
}

private function getAppointmentsData($user, $type, $page)
{

    $query = $user->is_barber
        ? Appointment::where('barber_id', $user->id)->with('client')
        : $user->appointments()->with(['saloon.mainPhoto']);

    if ($type === 'upcoming') {
        $query->where('appointment_time', '>=', now())
              ->orderBy('appointment_time', 'asc');
        $pageName = 'page';
    } else {
        $query->where('appointment_time', '<', now())
              ->orderBy('appointment_time', 'desc');
        $pageName = 'past_page';
    }

    return $query->paginate(7, ['*'], $pageName)->withQueryString();
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
    public function store(StoreAppointmentRequest $request)
    {
        // Se arrivi qui, i dati sono già validati e il barbiere è libero
        $validated = $request->validated();

        // Carbon parse per sicurezza se vuoi il formato DB
        $time = Carbon::parse($validated['appointment_time'])->format('Y-m-d H:i:s', 'Europe/Rome');

        Appointment::create([
            'client_id' => auth()->id(),
            'barber_id' => $validated['barber_id'],
            'saloon_id' => $validated['saloon_id'],
            'appointment_time' => $time,
            'status' => 'confirmed',
        ]);

        Cache::forget("saloon_shared_detail_{$validated['saloon_id']}");

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Saved!',
            'description' => 'Your appointment has been scheduled.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        $appointment = Appointment::findOrFail($id);

        // Se è già cancellato, non facciamo nulla
        if ($appointment->status === 'cancelled') {
            return redirect()->back();
        }

        $appointment->status = 'cancelled';
        $appointment->save();

        // Puliamo la cache del salone se necessario
        Cache::forget("saloon_shared_detail_{$appointment->saloon_id}");

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Cancelled!',
            'description' => 'Your appointment has been cancelled.',
        ]);
    }
}
