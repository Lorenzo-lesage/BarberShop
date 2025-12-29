import { Head } from '@inertiajs/react';

// Layouts
import AppShell from '@/Layouts/Appshell';
import SaloonsComponent from '@/components/publicPagesComponents/SaloonsComponents';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

// Components
import { MyPagination } from '@/components/publicPagesComponents/DataTablePagination';

// Definiamo l'interfaccia per la prop saloons paginata
interface PaginatedSaloons {
    saloons: {
        data: Saloon[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function Index({ saloons }: PaginatedSaloons) {
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
