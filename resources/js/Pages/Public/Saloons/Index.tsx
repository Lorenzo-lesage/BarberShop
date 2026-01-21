import { Head } from '@inertiajs/react';

// Layouts
import SaloonsComponent from '@/components/publicPagesComponents/saloon/SaloonsComponents';
import AppShell from '@/Layouts/Appshell';

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
import SearchBar from '@/components/publicPagesComponents/searchbar/SearchBar';

// Interfaces
import { PaginationData } from '@/interfaces/pagination';
import { Saloon } from '@/interfaces/saloon';

interface Props {
    // Stai usando lo stampo (PaginationData) con il tuo ingrediente (Saloon)
    saloons: PaginationData<Saloon>;
    filters: { search?: string };
}
export default function Index({ saloons, filters }: Props) {
    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */
    return (
        <AppShell className="mx-auto flex max-w-7xl flex-col px-4">
            <Head title="Saloons" />

            <div className="mt-28 h-[80vh]">
                <div className="mb-10 mt-2 flex justify-end">
                    <SearchBar filters={filters} routeName="saloons.index" />
                </div>
                <SaloonsComponent
                    saloons={saloons.data}
                    routeName="saloons.show"
                />
            </div>

            <MyPagination links={saloons.links} />
        </AppShell>
    );
}
