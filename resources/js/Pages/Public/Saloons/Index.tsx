import { Head } from '@inertiajs/react';

// Layouts
import AppShell from '@/Layouts/Appshell';
import SaloonsComponent from '@/components/publicPagesComponents/SaloonsComponents';

// Interfaces
import type { Saloons } from '@/interfaces/saloon';

export default function Index({ saloons }: Saloons) {
    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */
    return (
        <AppShell className="mx-auto max-w-7xl px-4 py-12">
            <Head title="Saloons" />
            <SaloonsComponent saloons={saloons} routeName="saloons.show" />
        </AppShell>
    );
}
