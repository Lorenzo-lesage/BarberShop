import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';
import BookingComponent from '@/components/publicPagesComponents/saloon/BookingComponent';

// Interfaces
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import type { Saloon } from '@/interfaces/saloon';

interface Props {
    saloon: Saloon;
    breadcrumbs: BreadcrumbItemType[];
}

export default function DashboardShow({ saloon, breadcrumbs }: Props) {
    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <Dashboard breadcrumbs={breadcrumbs} className="px-4 py-8 sm:py-12">
            <Head title={`${saloon.name} - Booking`} />
            <BookingComponent saloon={saloon} />
        </Dashboard>
    );
}
