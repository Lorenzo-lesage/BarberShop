<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            return parent::render($request, $e);
        }

        if ($e instanceof AuthorizationException) {
            return Inertia::render('Errors/Forbidden')
                ->toResponse($request)
                ->setStatusCode(403);
        }

        if ($e instanceof HttpException && $e->getStatusCode() === 403) {
            return Inertia::render('Errors/Forbidden')
                ->toResponse($request)
                ->setStatusCode(403);
        }

        return parent::render($request, $e);
    }
}
