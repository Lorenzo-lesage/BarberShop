import { Head } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';
import BookingComponent from '@/components/publicPagesComponents/BookingComponent';

// Interfaces
import BreadcrumbItemType from '@/interfaces/breadcrumbs';
import type { SaloonProps } from '@/interfaces/saloon';

export default function DashboardShow({
    saloon,
    breadcrumbs,
}: {
    saloon: SaloonProps['saloon'];
    breadcrumbs: BreadcrumbItemType[];
}) {
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
