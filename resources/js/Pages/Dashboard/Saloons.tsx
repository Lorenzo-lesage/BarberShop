import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Page
import SaloonsComponent from '@/components/publicPagesComponents/SaloonsComponents';

export default function Saloon() {
    return (
        <Dashboard>
            <Head title="Dashboard Saloons" />
            <SaloonsComponent />
        </Dashboard>
    );
}
