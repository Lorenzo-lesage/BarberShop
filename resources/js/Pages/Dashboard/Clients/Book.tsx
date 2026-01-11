import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function Book() {
    return (
        <Dashboard
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Book Appointment' },
            ]}
        >
            <Head title="Dashboard Client Book Appointment" />
            <h1>Book Appointment</h1>
        </Dashboard>
    );
}
