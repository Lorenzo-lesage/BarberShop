import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function Clients() {
    return (
        <Dashboard
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'My Clients' },
            ]}
        >
            <Head title="Dashboard My Clients" />
            <h1>Barber Clients</h1>
        </Dashboard>
    );
}
