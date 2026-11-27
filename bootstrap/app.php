<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Dietro Nginx Proxy Manager: l'HTTPS termina sul proxy, Laravel deve fidarsi
        // di X-Forwarded-Proto per generare URL https. L'IP reale lo gestisce già
        // Nginx nel container (TRUSTED_PROXY=local), quindi niente X-Forwarded-For.
        $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_PROTO);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'barber' => \App\Http\Middleware\EnsureUserIsBarber::class,
            'client' => \App\Http\Middleware\EnsureUserIsClient::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (\Illuminate\Http\Exceptions\PostTooLargeException $e, $request) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Upload failed',
                'description' => 'The file is too large.',
            ]);
        });

        $exceptions->render(function (\Throwable $e, $request) {

            $status = method_exists($e, 'getStatusCode')
                ? $e->getStatusCode()
                : 500;

            if ($status === 403) {
                return Inertia::render('Errors/Forbidden')
                    ->toResponse($request)
                    ->setStatusCode(403);
            }

            if ($status === 404) {
                return Inertia::render('Errors/NotFound')
                    ->toResponse($request)
                    ->setStatusCode(404);
            }
        });

    })
    ->create();
