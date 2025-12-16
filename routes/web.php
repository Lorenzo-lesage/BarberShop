<?php

use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\BecomeBarberController;
use App\Http\Controllers\Auth\RegisteredUserController;


// Rotte principali
Route::get('/', function () {
    return Inertia::render('Welcome', [
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
        : 'Dashboard/DashboardCustomer';

    return Inertia::render($componentName);

})->middleware(['auth', 'verified'])->name('dashboard');

// Rotte profilo
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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
Route::middleware(['auth', 'barber'])->group(function () {

    Route::get('/dashboard/schedule', function () {
        return Inertia::render('Dashboard/Barber/Schedule');
    })->name('dashboard.barber.schedule');

    Route::get('/dashboard/clients', function () {
        return Inertia::render('Dashboard/Barber/Clients');
    })->name('dashboard.barber.clients');

    Route::get('/dashboard/appointments', function () {
        return Inertia::render('Dashboard/Barber/Appointments');
    })->name('dashboard.barber.appointments.barber');

});


Route::middleware(['auth'])->group(function () {
    // Rotta 1: Saloon
    Route::get('/dashboard/saloons', function () {
        return Inertia::render('Dashboard/Saloons');
    })->name('dashboard.saloons');

    // Rotta 2: Barbers
    Route::get('/dashboard/barbers', function () {
        return Inertia::render('Dashboard/Barbers');
    })->name('dashboard.barbers');
});



require __DIR__ . '/auth.php';
