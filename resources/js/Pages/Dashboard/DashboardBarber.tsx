'use client';

import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components UI
import { Button } from '@/components/ui/button';

// Components
import { PerformanceChart } from './Components/BarberDashboard/chart-area-interactive';
import { HeaderDashboard } from './Components/BarberDashboard/HeaderDashboard';
import { KpiGrid } from './Components/BarberDashboard/KpiGrid';
import { LiveAgenda } from './Components/BarberDashboard/LiveAgenda';

// Icons
import { Terminal, TrendingUp } from 'lucide-react';

// Interfaces
import { User } from '@/interfaces/auth';
interface DashboardBarberProps {
    stats: {
        total_today: number;
        completed_today: number;
        remaining_today: number;
        new_clients: number;
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

                <div className="grid divide-x divide-border/60 md:grid-cols-12">
                    {/* --- MAIN: LIVE AGENDA --- */}
                    <LiveAgenda appointments={appointments} />

                    {/* --- SIDEBAR --- */}
                    <div className="flex flex-col divide-y divide-border/60 md:col-span-4">
                        <div className="space-y-6 bg-muted/5 p-8">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    Efficiency_Index
                                </span>
                                <TrendingUp size={14} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black italic leading-none">
                                    94%
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-tighter text-emerald-500">
                                    Above_Avg
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 bg-foreground p-8 text-background">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                                Control_Panel
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                <Button className="h-11 rounded-none border-none bg-background text-[9px] font-black uppercase tracking-widest text-foreground hover:bg-primary">
                                    Manage_Schedule
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11 rounded-none border-border/20 text-[9px] font-black uppercase tracking-widest text-background hover:bg-white/5"
                                >
                                    Inventory_Logs
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 p-8">
                            <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                                <Terminal size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                    Console_Logs
                                </span>
                            </div>
                            <div className="space-y-2 font-mono text-[8px] uppercase italic leading-tight text-muted-foreground/40">
                                <p>
                                    [{new Date().getHours()}:00]
                                    Operator_Login_Success
                                </p>
                                {appointments.slice(0, 2).map((apt, i) => (
                                    <p key={i}>
                                        [{apt.time}] Node_Active:{' '}
                                        {apt.client.split(' ')[0]}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
