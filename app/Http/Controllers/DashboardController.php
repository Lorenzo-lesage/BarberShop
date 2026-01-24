<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->is_barber) {
            return $this->barberDashboard($request, $user);
        }

        return $this->clientDashboard($user);
    }

    private function barberDashboard(Request $request, $user)
    {
        $filter = $request->query('filter', 'days');

        $query = Appointment::where('barber_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->where('appointment_time', '<', now());

        $labels = [];
        $data = [];

        if ($filter === 'weeks') {
            $start = now()->subDays(7);
            $end = now();
            $range = $end->diffInDays($start);
            for ($i = 0; $i <= $range; $i++) {
                $day = $start->copy()->addDays($i);
                $labels[] = $day->format('D');
                $data[] = Appointment::where('barber_id', $user->id)
                    ->where('status', '!=', 'cancelled')
                    ->whereDate('appointment_time', $day)
                    ->count();
            }
        } elseif ($filter === 'months') {
            $start = now()->subDays(30);
            $end = now();
            $range = $end->diffInDays($start);
            for ($i = 0; $i <= $range; $i++) {
                $day = $start->copy()->addDays($i);
                $labels[] = $day->format('d M');
                $data[] = Appointment::where('barber_id', $user->id)
                    ->where('status', '!=', 'cancelled')
                    ->whereDate('appointment_time', $day)
                    ->count();
            }
        } elseif ($filter === 'years') {
            $start = now()->subDays(365);
            $end = now();
            $range = $end->diffInDays($start);
            for ($i = 0; $i <= $range; $i++) {
                $day = $start->copy()->addDays($i);
                $labels[] = $day->format('d M');
                $data[] = Appointment::where('barber_id', $user->id)
                    ->where('status', '!=', 'cancelled')
                    ->whereDate('appointment_time', $day)
                    ->count();
            }
        } else {
            $start = now()->startOfDay();
            $end = now()->endOfDay();
            $range = 24;
            for ($i = 0; $i < $range; $i++) {
                $hour = $start->copy()->addHours($i);
                $labels[] = $hour->format('H');
                $data[] = Appointment::where('barber_id', $user->id)
                    ->where('status', '!=', 'cancelled')
                    ->whereBetween('appointment_time', [$hour, $hour->copy()->addHour()])
                    ->count();
            }
        }

        $chartData = collect($labels)->map(function ($label, $index) use ($data) {
            return [
                'label' => $label,
                'value' => $data[$index],
            ];
        });

        // --- APPUNTAMENTI E STATS ---
        $todayAppointments = Appointment::where('barber_id', $user->id)
            ->whereDate('appointment_time', Carbon::today())
            ->with('client')
            ->orderBy('appointment_time', 'asc')
            ->get();

        $stats = [
            'revenue_today' => (float) $todayAppointments->where('status', 'completed')->sum('price'),
            'appointments_count' => $todayAppointments->count(),
            'pending_count' => $todayAppointments->where('status', 'pending')->count(),
            'new_clients' => Appointment::where('barber_id', $user->id)
                ->whereDate('created_at', Carbon::today())
                ->distinct('client_id')
                ->count(),
        ];

        return Inertia::render('Dashboard/DashboardBarber', [
            'stats' => $stats,
            'appointments' => $todayAppointments->map(fn($apt) => [
                'time' => Carbon::parse($apt->appointment_time)->format('H:i'),
                'client' => $apt->client->name,
                'status' => $apt->status,
            ]),
            'chartData' => $chartData,
            'activeFilter' => strtoupper($filter)
        ]);
    }

    private function clientDashboard($user)
    {
        $nextApt = Appointment::where('client_id', $user->id)
            ->where('appointment_time', '>=', Carbon::now())
            ->where('status', '!=', 'cancelled')
            ->with('barber')
            ->orderBy('appointment_time', 'asc')
            ->first();

        $history = Appointment::where('client_id', $user->id)
            ->where('appointment_time', '<', Carbon::now())
            ->orderBy('appointment_time', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/DashboardClient', [
            'nextAppointment' => $nextApt ? [
                'date' => Carbon::parse($nextApt->appointment_time)->format('M d, Y'),
                'time' => Carbon::parse($nextApt->appointment_time)->format('h:i A'),
                'service' => $nextApt->service_name,
                'barber' => $nextApt->barber->name,
                'barber_photo' => $nextApt->barber->profile_photo,
                'status' => $nextApt->status,
                'saloon' => $nextApt->saloon()->with('mainPhoto')->first(),
            ] : null,
            'history' => $history->map(fn($h) => [
                'id' => $h->id,
                'date' => Carbon::parse($h->appointment_time)->format('M d, Y'),
                'time' => Carbon::parse($h->appointment_time)->format('h:i A'),
                'barber' => $h->barber->name,
                'saloon' => $h->saloon()->with('mainPhoto')->first(),
            ]),
        ]);
    }
}
