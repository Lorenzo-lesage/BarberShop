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
        // DashboardController.php

        $filter = $request->query('filter', '7d'); // Default 7 giorni
        $query = Appointment::where('barber_id', $user->id)
            ->where('status', '!=', 'cancelled');

        if ($filter === '90d') {
            $days = 90;
        } elseif ($filter === '30d') {
            $days = 30;
        } else {
            $days = 7;
        }

        $chartData = $query->selectRaw('DATE_FORMAT(appointment_time, "%d %b") as label, COUNT(*) as value, MIN(appointment_time) as sort_date')
            ->where('appointment_time', '>=', now()->subDays($days))
            ->where('appointment_time', '<=', now())
            ->groupBy('label')
            ->orderBy('sort_date', 'asc')
            ->get()
            ->map(fn($item) => [
                'label' => (string) $item->label,
                'value' => (int) $item->value
            ])
            ->values();


        // --- APPUNTAMENTI E STATS ---
        $now = Carbon::now('Europe/Rome');

        $todayAppointments = Appointment::where('barber_id', $user->id)
            ->whereDate('appointment_time', Carbon::today('Europe/Rome')) // Specifica il fuso anche qui!
            ->where('status', 'confirmed')
            ->with('client') // Carica i clienti per evitare la query N+1 nel map successivo
            ->orderBy('appointment_time', 'asc')
            ->get();

        // --- STATISTICHE TOTALI (LIFETIME) ---
        // 1. Calcoli preventivi
        $totalAppointments = Appointment::where('barber_id', $user->id)->where('status', 'confirmed')->count();
        $totalClients = Appointment::where('barber_id', $user->id)->where('status', 'confirmed')->distinct('client_id')->count();

        // 2. Calcolo Retention
        $returningClients = Appointment::where('barber_id', $user->id)
            ->where('status', 'confirmed')
            ->select('client_id')
            ->groupBy('client_id')
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        $retentionRate = $totalClients > 0 ? (int) round(($returningClients / $totalClients) * 100) : 0;

        // 3. Calcolo Efficienza (Basata su 10 slot)
        $efficiencyToday = $todayAppointments->count() > 0
            ? (int) min(round(($todayAppointments->count() / 10) * 100), 100)
            : 0;


        // 4. Calcolo Pico Orario
        $peakHour = Appointment::where('barber_id', $user->id)
            ->where('status', 'confirmed')
            ->selectRaw('HOUR(appointment_time) as hour, count(*) as total')
            ->groupBy('hour')
            ->orderBy('total', 'desc')
            ->first();


        // 5. Calcolo Giorno Più Occupato
        $busyDay = Appointment::where('barber_id', $user->id)
            ->where('status', 'confirmed')
            ->selectRaw('DAYNAME(appointment_time) as day, count(*) as total')
            ->groupBy('day')
            ->orderBy('total', 'desc')
            ->first();


        $stats = [
            'completed_today' => $todayAppointments->filter(
                fn($apt) =>
                Carbon::parse($apt->appointment_time, 'Europe/Rome')->isPast()
            )->count(),

            'remaining_today' => $todayAppointments->filter(
                fn($apt) =>
                Carbon::parse($apt->appointment_time, 'Europe/Rome')->isFuture()
            )->count(),

            'total_today' => $todayAppointments->count(),

            'new_clients' => Appointment::where('barber_id', $user->id)
                ->whereDate('created_at', Carbon::today('Europe/Rome'))
                ->distinct('client_id')
                ->count(),
            'total_appointments' => $totalAppointments,
            'unique_clients' => $totalClients,
            'retention_rate' => $retentionRate,
            'efficiency_today' => $efficiencyToday,
            'peak_hour' => $peakHour ? sprintf('%02d:00', $peakHour->hour) : "--:--",
            'busy_day' => $busyDay ? strtoupper($busyDay->day) : "N/A",
        ];

        return Inertia::render('Dashboard/DashboardBarber', [
            'stats' => $stats,
            'appointments' => $todayAppointments->map(fn($apt) => [
                'time' => Carbon::parse($apt->appointment_time, 'Europe/Rome')->format('H:i'),
                'client' => $apt->client->name,
                'client_id' => $apt->client_id,
                'photo' => $apt->client->profile_photo,
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
