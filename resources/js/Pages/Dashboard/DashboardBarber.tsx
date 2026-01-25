'use client';

import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components
import { PerformanceChart } from './Components/BarberDashboard/chart-area-interactive';
import EfficiencySidebar from './Components/BarberDashboard/EfficiencySidebar';
import { HeaderDashboard } from './Components/BarberDashboard/HeaderDashboard';
import { InsightsGrid } from './Components/BarberDashboard/InsightsGrid';
import { KpiGrid } from './Components/BarberDashboard/KpiGrid';
import { LiveAgenda } from './Components/BarberDashboard/LiveAgenda';
import { OperationalMetrics } from './Components/BarberDashboard/OperationalMetrics';

// Interfaces
import { User } from '@/interfaces/auth';
interface DashboardBarberProps {
    stats: {
        total_today: number;
        completed_today: number;
        remaining_today: number;
        new_clients: number;
        total_appointments: number;
        unique_clients: number;
        retention_rate: number;
        efficiency_today: number;
        peak_hour: string;
        busy_day: string;
    };
    appointments: {
        time: string;
        client: string;
        status: string;
        client_id: number;
    }[];
    chartData:
        | {
              label: string;
              value: number;
          }[]
        | {
              labels: string[];
              datasets: {
                  data: number[];
              }[];
          };
    activeFilter?: string;
}

export default function DashboardBarber({
    stats,
    appointments,
    chartData = [],
    activeFilter = '7d',
}: DashboardBarberProps) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const { auth } = usePage().props;
    const user = auth.user as User;

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Validated chart data
     */
    const validatedData = useMemo(() => {
        if (Array.isArray(chartData)) return chartData;

        if (
            chartData &&
            typeof chartData === 'object' &&
            'labels' in chartData &&
            'datasets' in chartData &&
            Array.isArray(chartData.labels) &&
            Array.isArray(chartData.datasets) &&
            chartData.datasets[0] &&
            Array.isArray(chartData.datasets[0].data)
        ) {
            return chartData.labels.map((label: string, index: number) => ({
                label: label,
                value: chartData.datasets[0].data[index] || 0,
            }));
        }

        return [];
    }, [chartData]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Dashboard
            breadcrumbs={[{ label: 'CORE_OPERATOR', href: '/dashboard' }]}
        >
            <Head title="BARBER_DASHBOARD" />

            <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-0 border-x border-border/40 bg-background">
                {/* --- HEADER --- */}
                <HeaderDashboard user={user} />

                {/* --- PERFORMANCE_MODULE (Con i 3 nuovi filtri) --- */}
                <PerformanceChart
                    data={validatedData}
                    activeFilter={activeFilter}
                />

                {/* --- KPI GRID --- */}
                <KpiGrid stats={stats} />

                {/* --- SEZIONE STATISTICHE REALI --- */}
                <OperationalMetrics stats={stats} />

                {/* --- 3. INSIGHTS STRATEGICI (ANALISI) --- */}
                <InsightsGrid stats={stats} />

                <div className="grid divide-x divide-border/60 md:grid-cols-12">
                    {/* --- MAIN: LIVE AGENDA --- */}
                    <LiveAgenda appointments={appointments} />

                    {/* --- SIDEBAR --- */}
                    <EfficiencySidebar
                        appointments={appointments}
                        stats={stats}
                    />
                </div>
            </div>
        </Dashboard>
    );
}
