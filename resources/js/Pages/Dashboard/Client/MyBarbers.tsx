import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function MyBarbers() {
    return (
        <Dashboard
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'My Barbers' },
            ]}
        >
            <Head title="Dashboard Client My Barbers" />
            <h1>My barbers</h1>
        </Dashboard>
    );
}
