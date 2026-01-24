'use client';

import { cn } from '@/lib/utils';
import { Head, router, usePage } from '@inertiajs/react'; // Aggiunto router

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Icons
import {
    Activity,
    Clock,
    DollarSign,
    Maximize2,
    Terminal,
    TrendingUp,
    Users,
} from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

interface DashboardBarberProps {
    stats: {
        revenue_today: number;
        appointments_count: number;
        pending_count: number;
        new_clients: number;
    };
    appointments: {
        time: string;
        client: string;
        status: string;
    }[];
    // Dati reali per il grafico dal controller
    chartData: {
        label: string;
        value: number;
    }[];
    activeFilter?: string; // Filtro corrente dal backend
}

export default function DashboardBarber({
    stats,
    appointments,
    chartData = [], // Default per evitare errori
    activeFilter = 'DAYS',
    history
}: DashboardBarberProps) {
    const { auth } = usePage().props;

    /*
    |--------------------------------------------------------------------------
    | Logic: Chart Scaling
    |--------------------------------------------------------------------------
    */
    // Calcoliamo il valore massimo per scalare le barre (minimo 1 per evitare divisione per zero)
    const safeChartData = chartData || []; // Se è null diventa un array vuoto

    const handleFilterChange = (filter: string) => {
        router.get(
            route('dashboard'),
            { filter },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['chartData', 'activeFilter'],
            },
        );
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Performance_Stream',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Periodo',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Appuntamenti',
                },
                beginAtZero: true,
            },
        },
    };

    const data = {
        labels: safeChartData.map((d) => d.label),
        datasets: [
            {
                label: 'Appointments',
                data: safeChartData.map((d) => d.value),
                borderColor: 'hsl(var(--primary))',
                backgroundColor: 'hsl(var(--primary))',
            },
        ],
    };

    console.log(history);

    return (
        <Dashboard
            breadcrumbs={[{ label: 'CORE_OPERATOR', href: '/dashboard' }]}
        >
            <Head title="BARBER_DASHBOARD" />

            <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-0 border-x border-border/40 bg-background">
                {/* --- HEADER --- */}
                <div className="flex items-center justify-between border-b border-border/60 p-6 md:p-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.4em] text-primary">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                            </span>
                            System_Ready
                        </div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
                            {auth.user.name.split(' ')[0]}_
                            <span className="text-outline text-primary">
                                CORE
                            </span>
                        </h1>
                    </div>
                    <div className="hidden text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">
                        <p>ID: #{auth.user.id.toString().padStart(4, '0')}</p>
                        <p>ST_DATE: {new Date().toLocaleDateString('it-IT')}</p>
                    </div>
                </div>

                {/* --- PERFORMANCE_ANALYTICS_MODULE --- */}
                <Card className="rounded-none border-x-0 border-b border-t-0 border-border/60 bg-muted/5 shadow-none">
                    <CardHeader className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Performance_Stream
                            </CardTitle>
                            <p className="mt-1 text-[8px] font-bold uppercase italic text-muted-foreground">
                                Data_Point_Optimization: {activeFilter}
                            </p>
                        </div>
                        {/* FILTRI TECNICI */}
                        <div className="flex border border-border/60 bg-background/50 p-1">
                            {['DAYS', 'WEEKS', 'MONTHS', 'YEARS'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => handleFilterChange(f)}
                                    className={cn(
                                        'px-3 py-1 text-[8px] font-black tracking-widest transition-all',
                                        activeFilter.toUpperCase() === f
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-primary/10',
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Line options={options} data={data} />
                    </CardContent>
                </Card>
                {/* --- KPI GRID --- */}
                <div className="grid grid-cols-2 divide-x divide-y border-b border-border/60 md:grid-cols-4 md:divide-y-0">
                    {[
                        {
                            label: 'Daily_Revenue',
                            val: `€${stats.revenue_today}`,
                            icon: DollarSign,
                            color: 'text-emerald-500',
                        },
                        {
                            label: 'Total_Queue',
                            val: stats.appointments_count
                                .toString()
                                .padStart(2, '0'),
                            icon: Clock,
                            color: 'text-primary',
                        },
                        {
                            label: 'Pending_Nodes',
                            val: stats.pending_count
                                .toString()
                                .padStart(2, '0'),
                            icon: Activity,
                            color: 'text-orange-500',
                        },
                        {
                            label: 'New_Registries',
                            val: `+${stats.new_clients}`,
                            icon: Users,
                            color: 'text-blue-500',
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="group p-6 transition-colors hover:bg-muted/5"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground">
                                    {stat.label}
                                </span>
                                <stat.icon
                                    size={14}
                                    className={cn(
                                        'opacity-30 transition-opacity group-hover:opacity-100',
                                        stat.color,
                                    )}
                                />
                            </div>
                            <div className="text-2xl font-black italic tracking-tighter">
                                {stat.val}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid divide-x divide-border/60 md:grid-cols-12">
                    {/* --- MAIN: LIVE AGENDA --- */}
                    <div className="p-0 md:col-span-8">
                        <div className="flex items-center justify-between border-b border-border/40 bg-muted/5 p-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Live_Agenda_Stream
                            </h2>
                            <Badge className="rounded-none border-primary/20 bg-primary/10 font-mono text-[9px] text-primary">
                                {appointments.length}_FOUND
                            </Badge>
                        </div>
                        <div className="divide-y divide-border/40">
                            {appointments.map((apt, idx) => (
                                <div
                                    key={idx}
                                    className="group flex cursor-pointer items-center gap-6 p-6 transition-all hover:bg-muted/10"
                                >
                                    <div className="w-16 font-mono text-xs font-black italic text-primary">
                                        {apt.time}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black uppercase tracking-widest transition-colors group-hover:text-primary">
                                            {apt.client}
                                        </div>
                                        <div className="mt-1 text-[8px] font-bold uppercase italic tracking-[0.2em] text-muted-foreground/40">
                                            ST: {apt.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                'h-1.5 w-1.5 rounded-full',
                                                apt.status === 'completed'
                                                    ? 'bg-emerald-500'
                                                    : 'animate-pulse bg-orange-500',
                                            )}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none opacity-0 group-hover:opacity-100"
                                        >
                                            <Maximize2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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
