import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

// Images
import hero from '@/assets/hero.jpg';

// Main Layout
import AppShell from '@/Layouts/Appshell';

export default function Welcome({
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <AppShell>
            <Head title="Welcome" />
            <div className="text-black/50 dark:text-white/50">
                <div
                    style={{
                        /* Use theme-aware CSS variable for background so gradient follows light/dark mode.
                           The '--background' variable is defined in `resources/css/app.css` as H S L components
                           (e.g. "90 0% 95%"), so we use `hsl(var(--background) / alpha)` to produce colors
                           with alpha channel. We put the gradient first so it is painted on top of the image. */
                        backgroundImage: `linear-gradient(180deg, hsl(var(--background) / 0), hsl(var(--background) / 1)), url(${hero})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        opacity: 0.8,
                    }}
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <main className="mt-6">
                            <h1 className="text-4xl font-bold text-black dark:text-white sm:text-5xl lg:text-6xl">
                                Welcome to BarberShop
                            </h1>
                            <p className="mt-6 text-lg leading-8">
                                Your one-stop solution for managing barber
                                appointments, clients, and services with ease
                                and efficiency.
                            </p>
                            <div>
                                <p className="mt-6 text-sm">
                                    Laravel v{laravelVersion} (PHP v{phpVersion}
                                    )
                                </p>
                            </div>
                        </main>
                        <main className="mt-6">
                            <h1 className="text-4xl font-bold text-black dark:text-white sm:text-5xl lg:text-6xl">
                                Features
                            </h1>
                            <div className="mt-6 text-lg leading-8">
                                <ul>
                                    <li>Client Management</li>
                                    <li>Barber Management</li>
                                    <li>Service Management</li>
                                    <li>Appointment Management</li>
                                </ul>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
