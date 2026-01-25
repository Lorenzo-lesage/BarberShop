import { cn } from '@/lib/utils';
import { Activity, CheckCircle2, Clock, LucideIcon, Users } from 'lucide-react';

interface KpiItem {
    label: string;
    val: string | number;
    icon: LucideIcon;
    color: string;
}

interface KpiGridProps {
    stats: {
        completed_today: number;
        remaining_today: number;
        total_today: number;
        new_clients: number;
    };
}

export function KpiGrid({ stats }: KpiGridProps) {
    const kpis: KpiItem[] = [
        {
            label: 'Done_Today',
            val: stats.completed_today.toString().padStart(2, '0'),
            icon: CheckCircle2,
            color: 'text-emerald-500',
        },
        {
            label: 'To_Do_Next',
            val: stats.remaining_today.toString().padStart(2, '0'),
            icon: Clock,
            color: 'text-primary',
        },
        {
            label: 'Total_Daily',
            val: stats.total_today.toString().padStart(2, '0'),
            icon: Activity,
            color: 'text-blue-500',
        },
        {
            label: 'New_Entries',
            val: `+${stats.new_clients}`,
            icon: Users,
            color: 'text-orange-500',
        },
    ];

    return (
        <div className="grid grid-cols-2 divide-x divide-y border-b border-border/60 md:grid-cols-4 md:divide-y-0">
            {kpis.map((stat, i) => (
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
    );
}
