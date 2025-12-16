import { usePage } from '@inertiajs/react';

// Interfaces
import type { PageProps } from '@/types';

// Layout
import Dashboard from '@/Layouts/Dashboard';

export default function DashboardBarber() {
    /*
    |----------------------------------------------------------------------
    | Data
    |----------------------------------------------------------------------
    */

    const { auth } = usePage<PageProps>().props;

    /*
    |----------------------------------------------------------------------
    | Render
    |----------------------------------------------------------------------
    */
    return (
        <Dashboard>
            <h1>DashboarBarber</h1>
            <p>{auth.user.name}</p>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </Dashboard>
    );
}
