import { Head } from '@inertiajs/react';

// Layouts
import SaloonsComponent from '@/components/publicPagesComponents/saloon/SaloonsComponents';
import AppShell from '@/Layouts/Appshell';

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';

// Interfaces
import { PaginationData } from '@/interfaces/pagination';
import { Saloon } from '@/interfaces/saloon';

interface Props {
    // Stai usando lo stampo (PaginationData) con il tuo ingrediente (Saloon)
    saloons: PaginationData<Saloon>;
}
export default function Index({ saloons }: Props) {
    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */
    return (
        <AppShell className="mx-auto flex max-w-7xl flex-col px-4">
            <Head title="Saloons" />

            <div className="h-[80vh]">
                <SaloonsComponent
                    saloons={saloons.data}
                    routeName="saloons.show"
                />
            </div>

            <MyPagination links={saloons.links} />
        </AppShell>
    );
}
