import { Head } from '@inertiajs/react';


// Layout
import Dashboard from '@/Layouts/Dashboard';

// Page
import BarbersComponent from '@/components/publicPagesComponents/BarbersComponent';

export default function Barbers() {
    return (
        <Dashboard>
            <Head title="Dashboard Barbers" />
            <BarbersComponent />
        </Dashboard>
    );
}
