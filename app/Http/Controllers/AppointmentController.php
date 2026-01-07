<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\Saloon;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;


class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validated = $request->validate([
            'saloon_id' => 'required|exists:saloons,id',
            'barber_id' => 'required|exists:users,id',
            'appointment_time' => 'required|date|after:now',
        ]);

        $time = Carbon::parse($request->appointment_time)->format('Y-m-d H:i:s');

        // Controllo veloce: il barbiere ha già un impegno a quell'ora nel salone?
        $exists = Appointment::where('barber_id', $request->barber_id)
            ->where('appointment_time', $time)
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($exists) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error!',
                'description' => 'The barber is already busy at that time.',
            ]);
        }

        Appointment::create([
            'client_id' => auth()->id(),
            'barber_id' => $request->barber_id,
            'saloon_id' => $request->saloon_id,
            'appointment_time' => $time,
            'status' => 'confirmed',
        ]);

        Cache::forget("saloon_shared_detail_{$request->saloon_id}");

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
        //
    }
}
