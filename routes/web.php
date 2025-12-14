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
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rotte profilo
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 🔹 Redirect al provider (con stateless)
Route::get('/auth/{provider}', action: function ($provider) {
    return Socialite::driver($provider)->redirect();
})->name('oauth.redirect');

// 🔹 Callback
Route::get('/auth/{provider}/callback', function ($provider) {
    try {
        $socialUser = Socialite::driver($provider)->user();

        $email = $socialUser->getEmail();
        if (!$email) {
            return redirect('/login')->with('toast', [
                'type' => 'error',
                'message' => 'Login failed',
                'description' => 'Email not provided by ' . ucfirst($provider)
            ]);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                'email' => $email,
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'password' => bcrypt(str()->random(16)),
            ]);
        } else {
            $user->update([
                'provider' => $user->provider ?? $provider,
                'provider_id' => $user->provider_id ?? $socialUser->getId(),
            ]);
        }

        Auth::login($user);

        return redirect('/dashboard')->with('toast', [
            'type' => 'success',
            'message' => 'Authenticated!',
        ]);

    } catch (\Exception $e) {
        \Log::error('OAuth callback error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

        return redirect('/login')->with('toast', [
            'type' => 'error',
            'message' => 'Authentication failed',
            'description' => 'Authentication error occurred'
        ]);
    }
});

Route::middleware('guest')->group(function () {
    Route::get('become-barber', [BecomeBarberController::class, 'index'])
        ->name('become.barber');

    Route::post('become-barber', [RegisteredUserController::class, 'store'])
        ->name('become.barber.register'); // stessa store, ma POST dalla pagina barbiere
});

require __DIR__ . '/auth.php';
