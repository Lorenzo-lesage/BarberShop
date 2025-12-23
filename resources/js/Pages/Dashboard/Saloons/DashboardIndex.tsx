import { Head } from '@inertiajs/react';

// Layouts
import Dashboard from '@/Layouts/Dashboard';
import SaloonsComponent from '@/components/publicPagesComponents/SaloonsComponents';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import type { Saloon } from '@/interfaces/saloon';

export default function Index({
    saloons,
    breadcrumbs,
}: {
    saloons: Saloon[];
    breadcrumbs: BreadcrumbItemType[];
}) {
    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */
    return (
        <Dashboard breadcrumbs={breadcrumbs} className="grid-cols-4 px-4 py-12">
            <Head title="Dashboard Saloons" />
            <SaloonsComponent
                saloons={saloons}
                routeName="saloons.dashboard.show"
            />
        </Dashboard>
    );
}
