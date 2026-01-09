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
    public function store(StoreAppointmentRequest $request)
    {
        // Se arrivi qui, i dati sono già validati e il barbiere è libero
        $validated = $request->validated();

        // Carbon parse per sicurezza se vuoi il formato DB
        $time = Carbon::parse($validated['appointment_time'])->format('Y-m-d H:i:s');

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
        //
    }
}
