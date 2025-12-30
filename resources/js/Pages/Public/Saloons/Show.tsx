import { Head } from '@inertiajs/react';

// Layout
import AppShell from '@/Layouts/Appshell';
import BookingComponent from '@/components/publicPagesComponents/saloon/BookingComponent';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

interface Props {
    saloon: Saloon; // Descriviamo che dentro le props c'è un oggetto saloon
}

export default function Show({ saloon }: Props) {
    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <AppShell className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
            <Head title={`${saloon.name} - Booking`} />
            <BookingComponent saloon={saloon} />
        </AppShell>
    );
}
