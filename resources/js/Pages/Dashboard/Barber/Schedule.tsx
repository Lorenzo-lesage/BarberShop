import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function Schedule() {
    return (
        <Dashboard
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Schedule' },
            ]}
        >
            <Head title="Dashboard Barber Schedule" />
            <h1>Barber Schedule</h1>
        </Dashboard>
    );
}
