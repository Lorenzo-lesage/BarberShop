import { usePage } from '@inertiajs/react';

// Interfaces
import type { PageProps } from '@/types';

export default function DashboardClient() {
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
        <div>
            <h1>DashboardCLient</h1>
            <p>{auth.user.name}</p>
        </div>
    );
}
