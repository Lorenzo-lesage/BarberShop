import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function MyReservations() {
    return (
        <Dashboard>
            <Head title="Dashboard Client My Reservations" />
            <h1>By reservation</h1>
        </Dashboard>
    );
}
