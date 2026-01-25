import { cn } from '@/lib/utils';
import { LucideIcon, Scissors, Target, Users, Zap } from 'lucide-react';

interface MetricItem {
    label: string;
    val: string | number;
    icon: LucideIcon;
    color: string;
}

interface OperationalMetricsProps {
    stats: {
        total_appointments: number;
        unique_clients: number;
        retention_rate: number;
        efficiency_today: number;
    };
}

export function OperationalMetrics({ stats }: OperationalMetricsProps) {
    const metrics: MetricItem[] = [
        {
            label: 'Lifetime_Jobs',
            val: stats.total_appointments.toString().padStart(2, '0'),
            icon: Scissors,
            color: 'text-zinc-400', // Grigio tecnico per lo storico
        },
        {
            label: 'Client_Base',
            val: stats.unique_clients.toString().padStart(2, '0'),
            icon: Users,
            color: 'text-indigo-400',
        },
        {
            label: 'Loyalty_Rate',
            val: `${stats.retention_rate}%`,
            icon: Target,
            color: 'text-rose-500',
        },
        {
            label: 'Load_Factor',
            val: `${stats.efficiency_today}%`,
            icon: Zap,
            color: 'text-yellow-500',
        },
    ];

    return (
        <div className="relative grid grid-cols-2 divide-x divide-y border-b border-border/60 bg-muted/5 md:grid-cols-4 md:divide-y-0">
            {/* Etichetta di contesto - Stile identico a KpiGrid ma con colore diverso per distinguerlo */}
            <div className="absolute -top-3 left-6 z-10 border border-border/60 bg-background px-2 py-1 text-[8px] font-black uppercase tracking-[0.3em] text-primary">
                Lifetime_Operational_Archive [Global]
            </div>

            {metrics.map((stat, i) => (
                <div
                    key={i}
                    className="group p-6 transition-colors hover:bg-background"
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
                    <div className="text-2xl font-black italic tabular-nums tracking-tighter">
                        {stat.val}
                    </div>
                </div>
            ))}
        </div>
    );
}
