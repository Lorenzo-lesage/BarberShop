import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Layouts
import SaloonsComponent from '@/components/saloon/SaloonsComponents';
import Dashboard from '@/Layouts/Dashboard';

// Componetns
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
import SearchBar from '@/components/publicPagesComponents/searchbar/SearchBar';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Saloon } from '@/interfaces/saloon';

interface Props {
    saloons: PaginationData<Saloon>;
    breadcrumbs: BreadcrumbItemType[];
    filters: { search?: string };
}
export default function Index({ saloons, breadcrumbs, filters }: Props) {
    /*
      |--------------------------------------------------------------------------
      | Data
      |--------------------------------------------------------------------------
      */

    const [isLoading, setIsLoading] = useState(false);

    /*
      |--------------------------------------------------------------------------
      | Hooks
      |--------------------------------------------------------------------------
      */

    useEffect(() => {
        const removeStartListener = router.on('start', () =>
            setIsLoading(true),
        );
        const removeFinishListener = router.on('finish', () =>
            setIsLoading(false),
        );

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

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

            <div>
                <div className="mb-10 mt-2 flex justify-end">
                    <SearchBar
                        filters={filters}
                        routeName="saloons.dashboard.index"
                    />
                </div>

                <SaloonsComponent
                    saloons={saloons.data}
                    routeName="saloons.dashboard.show"
                    isLoading={isLoading}
                />
            </div>

            {/* Pagination */}
            <MyPagination links={saloons.links} />
        </Dashboard>
    );
}
