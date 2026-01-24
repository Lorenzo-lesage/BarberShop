<?php

use App\Http\Controllers\SaloonController;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\BecomeBarberController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Models\Saloon;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ClientController;

// Rotte principali
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'saloons' => Saloon::latest()->with('barber:id,name', 'mainPhoto')->take(10)->get(),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user(); // Ottieni l'utente corrente

    $componentName = $user->is_barber
        ? 'Dashboard/DashboardBarber'
        : 'Dashboard/DashboardClient';

    return Inertia::render($componentName);

})->middleware(['auth', 'verified'])->name('dashboard');

// Rotte profilo
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::patch('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
});

/**
 * Routes for becoming a barber
 */
Route::middleware('guest')->group(function () {
    Route::get('become-barber', [BecomeBarberController::class, 'index'])
        ->name('become.barber');

    Route::post('become-barber', [RegisteredUserController::class, 'store'])
        ->name('become.barber.register');
});

/**
 * Mail routes
 */

Route::middleware('auth')->group(function () {
    Route::post('/become-barber/request', [BecomeBarberController::class, 'request'])
        ->name('become.barber.request');

    Route::get('/become-barber/approve/{user}', [BecomeBarberController::class, 'approve'])
        ->middleware('signed')
        ->name('become.barber.approve');
});

/**
 * Routes Web
 */
/**
 * Routes Dashboard barber
 */
Route::middleware(['auth', 'barber'])->group(function () {

    Route::get('/dashboard/my-saloon', [SaloonController::class, 'edit'])->name('dashboard.barber.saloon');
    Route::post('/dashboard/my-saloon', [SaloonController::class, 'store'])->name('dashboard.barber.saloon.store');

    // Nuove rotte per le ferie
    Route::post('/dashboard/my-saloon/exceptions', [SaloonController::class, 'storeException'])->name('dashboard.barber.saloon.exceptions.store');
    Route::delete('/dashboard/my-saloon/exceptions/{exception}', [SaloonController::class, 'destroyException'])->name('dashboard.barber.saloon.exceptions.destroy');

    Route::get('/dashboard/my-clients', function () {
        return Inertia::render('Dashboard/Barber/MyClients');
    })->name('dashboard.barber.my.clients');

    Route::get('/dashboard/barber-appointments', function () {
        return Inertia::render('Dashboard/Barber/Appointments');
    })->name('dashboard.barber.appointments');

    //Photos
    Route::patch('/saloon/{saloon}/cover', [SaloonController::class, 'updateCover'])->name('dashboard.barber.saloon.cover.update');
    Route::post('/saloon/{saloon}/photos', [SaloonController::class, 'addPhoto'])->name('dashboard.barber.saloon.photos.store');
    Route::delete('/dashboard/barber/saloon/photos/{id}', [SaloonController::class, 'destroyPhoto'])
        ->name('dashboard.barber.saloon.photos.destroy');


    // My Clients route
    Route::get('/dashboard/clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('/dashboard/clients/{user}', [ClientController::class, 'show'])->name('clients.show');

});

/**
 * Routes Dashboard client
 */
Route::middleware(['auth', 'client'])->group(function () {

    Route::get('/dashboard/my-reservations', function () {
        return Inertia::render('Dashboard/Client/MyReservations');
    })->name('dashboard.client.bookings');

    Route::get('/dashboard/book', function () {
        return Inertia::render('Dashboard/Client/Book');
    })->name('dashboard.client.book');

    Route::get('/dashboard/my-saloons', [SaloonController::class, 'mySaloons'])
        ->name('saloons.my-saloons');

});

/**
 * Routes Dashboard
 */
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard/saloons', [SaloonController::class, 'dashboardIndex'])->name('saloons.dashboard.index');
    Route::get('dashboard/saloons/{saloon}', [SaloonController::class, 'dashboardShow'])->name('saloons.dashboard.show');
    Route::delete('/dashboard/saloon', [SaloonController::class, 'destroy'])->name('saloon.destroy');

    Route::get('/dashboard/barbers', function () {
        return Inertia::render('Dashboard/Barbers');
    })->name('dashboard.barbers');

});

/**
 * Routes for appointments
 */
Route::middleware('auth')->group(function () {
    Route::post('/dasboard/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::get('/dashboard/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    Route::put('/dashboard/appointments/{appointment}', [AppointmentController::class, 'update'])->name('appointments.update');
    Route::delete('/dashboard/appointments/{appointment}', [AppointmentController::class, 'destroy'])->name('appointments.destroy');
});



Route::get('/barbers', function () {
    return Inertia::render('Public/Barbers');
})->name('barbers');
Route::get('/saloons', [SaloonController::class, 'index'])->name('saloons.index');
Route::get('/saloons/{saloon}', [SaloonController::class, 'show'])->name('saloons.show');


/**
 * Routes for not found
 */
Route::fallback(function () {
    return Inertia::render('Errors/NotFound')
        ->toResponse(request())
        ->setStatusCode(404);
});

require __DIR__ . '/auth.php';
