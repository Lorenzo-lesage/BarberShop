import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function Appointments() {
    return (
        <Dashboard
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Appointments' },
            ]}
        >
            <Head title="Dashboard Barber Appointments" />
            <h1>Barber Appointments</h1>
        </Dashboard>
    );
}
