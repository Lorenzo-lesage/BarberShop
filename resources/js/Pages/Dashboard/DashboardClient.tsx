'use client';

import { Head, usePage } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components Layout
import { HeaderClientDashboard } from '@/Pages/Dashboard/Components/ClientDashboard/HeaderClientDashboard';
import { QuickAccessRegistry } from './Components/ClientDashboard/QuickAccessRegistry';
import { StatsDisplay } from './Components/ClientDashboard/StatsDisplay';

// Components

// Icons

// Interfaces
import { User } from '@/interfaces/auth';
import type { DashboardProps } from '@/interfaces/saloon';
import { AppointmentStatus } from './Components/ClientDashboard/AppointmentStatus';
import { SessionLogs } from './Components/ClientDashboard/SessionLogs';

export default function DashboardClient({
    nextAppointment,
    history,
}: DashboardProps) {
    /*
    |---------------------------------------------------------------------------
    | Data
    |---------------------------------------------------------------------------
    */

    const { auth } = usePage().props;
    const user = auth.user as User;

    /*
    |---------------------------------------------------------------------------
    | Render
    |---------------------------------------------------------------------------
    */

    return (
        <Dashboard breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}>
            <Head title="CLIENT_DASHBOARD" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 md:p-10">
                {/* --- HEADER SEZIONALE --- */}
                <HeaderClientDashboard user={user} />

                {/* --- CONTENT SEZIONALE --- */}
                <StatsDisplay user={user} history={history} />

                {/* --- PREFERRED_NODES (Accesso Rapido ai tuoi Saloni) --- */}
                {history && <QuickAccessRegistry history={history} />}

                {/* --- NEXT APPOINTMENT --- */}
                <AppointmentStatus nextAppointment={nextAppointment} />

                {/* --- RECENT HISTORY (LOG STYLE) --- */}
                <SessionLogs history={history} />
            </div>
        </Dashboard>
    );
}
