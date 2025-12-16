import { Head } from '@inertiajs/react';

// Layouts
import Dashboard from '@/Layouts/Dashboard';

// Page
import ClientsComponent from '@/components/publicPagesComponents/ClientsComponent';

export default function Clients() {
    return (
        <Dashboard>
            <Head title="Dashboard Clients" />
            <ClientsComponent />
        </Dashboard>
    );
}
