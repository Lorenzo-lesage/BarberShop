import { Head } from '@inertiajs/react';

// Layouts
import Dashboard from '@/Layouts/Dashboard';
import SaloonsComponent from '@/components/publicPagesComponents/SaloonsComponents';

// Componetns
import { MyPagination } from '@/components/publicPagesComponents/DataTablePagination';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import type { Saloon } from '@/interfaces/saloon';

interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    // Aggiungi altri campi se ti servono (current_page, last_page, etc.)
}

export default function Index({
    saloons,
    breadcrumbs,
}: {
    saloons: PaginatedData<Saloon>;
    breadcrumbs: BreadcrumbItemType[];
}) {
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
            {/* Barra della Paginazione */}
            <MyPagination links={saloons.links} />
        </Dashboard>
    );
}
