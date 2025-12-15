<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class OAuthController extends Controller
{
    /**
     * Redirect to the OAuth provider.
     */
    public function redirect(Request $request, string $provider)
    {
        if ($request->get('intent')) {
            session(['oauth_intent' => $request->get('intent')]);
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the callback from the provider.
     */
    public function callback(string $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();

            $email = $socialUser->getEmail();
            if (!$email) {
                return redirect('/login')->with('toast', [
                    'type' => 'error',
                    'message' => 'Login failed',
                    'description' => 'Email not provided by ' . ucfirst($provider),
                ]);
            }

            // Recupero l'intent dalla sessione
            $intent = session('oauth_intent');
            session()->forget('oauth_intent'); // pulisco la sessione
            $isBarber = $intent === 'barber';

            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                    'email' => $email,
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'password' => bcrypt(str()->random(16)),
                    'is_barber' => $isBarber,
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
            Log::error('OAuth callback error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return redirect('/login')->with('toast', [
                'type' => 'error',
                'message' => 'Authentication failed',
                'description' => 'Authentication error occurred',
            ]);
        }
    }
}
