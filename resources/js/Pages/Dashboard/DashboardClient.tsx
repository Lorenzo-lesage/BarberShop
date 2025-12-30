import { Head, usePage } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function DashboardClient() {
    /*
    |----------------------------------------------------------------------
    | Data
    |----------------------------------------------------------------------
    */

    const { auth } = usePage().props;

    /*
    |----------------------------------------------------------------------
    | Render
    |----------------------------------------------------------------------
    */
    return (
        <Dashboard breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard Client" />
            <h1>DashboardCLient</h1>
            <p>{auth.user.name}</p>
        </Dashboard>
    );
}
