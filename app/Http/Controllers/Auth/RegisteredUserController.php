<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

        $request->validate(
            [
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'is_barber' => 'boolean',
            ],
            [
                'name.required' => 'Name is required',
                'name.max' => 'Name is too long (max 255 chars)',
                'name.string' => 'Name must be a string',
                'email.required' => 'Email is required',
                'email.unique' => 'Email already registered',
                'email.max' => 'Email is too long (max 255 chars)',
                'email.string' => 'Email must be a string',
                'email.email' => 'Email is not valid',
                'email.lowercase' => 'Email must be lowercase',
                'password.required' => 'Password is required',
                'password.confirmed' => 'Password confirmation does not match',
            ]
        );

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_barber' => $request->boolean('is_barber'),

        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
