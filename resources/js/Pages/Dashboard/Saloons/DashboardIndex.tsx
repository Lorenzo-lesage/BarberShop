import { Head } from '@inertiajs/react';

// Layouts
import SaloonsComponent from '@/components/publicPagesComponents/saloon/SaloonsComponents';
import Dashboard from '@/Layouts/Dashboard';

// Componetns
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Saloon } from '@/interfaces/saloon';

interface Props {
    saloons: PaginationData<Saloon>;
    breadcrumbs: BreadcrumbItemType[];
}
export default function Index({ saloons, breadcrumbs }: Props) {
    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="h-100 flex-column flex justify-between px-4 py-12"
        >
            <Head title="Dashboard Saloons" />

            <SaloonsComponent
                saloons={saloons.data}
                routeName="saloons.dashboard.show"
            />

            {/* Pagination */}
            <MyPagination links={saloons.links} />
        </Dashboard>
    );
}
