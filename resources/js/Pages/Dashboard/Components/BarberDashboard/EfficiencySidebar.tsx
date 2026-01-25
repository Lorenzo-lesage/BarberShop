import { Link } from '@inertiajs/react';

// Components
import { Button } from '@/components/ui/button';

// Icons
import { Terminal, TrendingUp } from 'lucide-react';

interface Appointment {
    time: string;
    client: string;
}

interface EfficiencySidebarProps {
    appointments: Appointment[];
    stats: {
        total_today: number;
        completed_today: number;
        efficiency_today: number; // Aggiunto
        retention_rate: number; // Aggiunto
    };
}

export default function EfficiencySidebar({
    appointments,
    stats,
}: EfficiencySidebarProps) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */
    // Calcolo dinamico dell'efficienza (basato su una giornata tipo di 8 ore/appuntamenti)
    // Se hai più di 8 appuntamenti, l'efficienza è al 100%
    const efficiency =
        stats.total_today > 0
            ? Math.min(Math.round((stats.total_today / 8) * 100), 100)
            : 0;

    const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    /**
     * Get system message
     * @returns
     */
    const getSystemMessage = () => {
        if (stats.efficiency_today > 80)
            return 'RESOURCE_CRITICAL: High demand today.';
        if (stats.retention_rate < 40)
            return 'STRATEGY: Focus on client retention.';
        if (stats.total_today === 0)
            return 'SYSTEM_IDLE: Waiting for bookings.';
        return 'OPERATIONAL_STATUS: Optimal.';
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="flex flex-col divide-y divide-border/60 border-l border-border/60 md:col-span-4">
            {/* Efficiency Index Dinamico */}
            <div className="space-y-6 bg-muted/5 p-8">
                <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Efficiency_Index
                    </span>
                    <TrendingUp
                        size={14}
                        className={
                            efficiency > 70
                                ? 'text-emerald-500'
                                : 'text-orange-500'
                        }
                    />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic leading-none">
                        {efficiency}%
                    </span>
                    <span
                        className={`text-[9px] font-bold uppercase tracking-tighter ${efficiency > 70 ? 'text-emerald-500' : 'text-orange-500'}`}
                    >
                        {efficiency > 70 ? 'Above_Avg' : 'Optimization_Needed'}
                    </span>
                </div>
            </div>

            {/* Pannello di Controllo */}
            <div className="space-y-4 bg-muted p-8 text-background">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    Control_Panel
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    <Link
                        href={route('dashboard.barber.saloon')}
                        className="w-full bg-primary"
                    >
                        <Button className="h-11 w-full rounded-none border border-primary bg-muted text-[9px] font-black uppercase tracking-widest text-foreground hover:bg-background">
                            Manage_Schedule
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Console Logs Dinamici */}
            <div className="flex-1 p-8">
                <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                    <Terminal size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                        Console_Logs
                    </span>
                </div>
                <div className="space-y-2 font-mono text-[8px] uppercase italic leading-tight">
                    {/* Messaggio di Sistema Dinamico */}
                    <p className="font-bold text-emerald-500">
                        [{currentTime}] {getSystemMessage()}
                    </p>

                    <p className="text-muted-foreground/40">
                        [{currentTime}] System_Check_O_K
                    </p>

                    {appointments.length > 0 ? (
                        appointments.slice(0, 3).map((apt, i) => (
                            <p key={i} className="text-muted-foreground/40">
                                [{apt.time}] Node_Active:{' '}
                                {apt.client.split(' ')[0]}
                            </p>
                        ))
                    ) : (
                        <p className="text-[7px] text-muted-foreground/20">
                            [--:--] Waiting_For_Data...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
