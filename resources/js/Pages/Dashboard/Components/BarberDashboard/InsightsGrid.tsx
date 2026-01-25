import { cn } from '@/lib/utils';

// Icons
import { Award, CalendarDays, Timer, TrendingUp } from 'lucide-react';

// Interfaces
interface InsightsGridProps {
    stats: {
        busy_day: string;
        peak_hour: string;
        retention_rate: number;
    };
}

export function InsightsGrid({ stats }: InsightsGridProps) {
    const insights = [
        {
            label: 'Peak_Traffic_Day',
            val: stats?.busy_day ? stats.busy_day.toUpperCase() : 'N/D',
            icon: CalendarDays,
            color: 'text-violet-500',
            desc: 'Highest booking volume',
        },
        {
            label: 'Prime_Time_Slot',
            val: stats.peak_hour,
            icon: Timer,
            color: 'text-cyan-500',
            desc: 'Most active work hour',
        },
        {
            label: 'Performance_Status',
            val: (stats?.retention_rate || 0) > 50 ? 'STABLE' : 'GROWING',
            icon: TrendingUp,
            color: 'text-emerald-500',
            desc: 'Business health index',
        },
        {
            label: 'Operator_Rank',
            val: 'CORE', // Questo può diventare dinamico in base ai feedback o numero tagli
            icon: Award,
            color: 'text-primary',
            desc: 'Verified proficiency level',
        },
    ];

    console.log(insights);

    return (
        <div className="relative grid grid-cols-2 divide-x divide-y border-b border-border/60 md:grid-cols-4 md:divide-y-0">
            <div className="absolute -top-3 left-6 z-10 border border-border/60 bg-background px-2 py-1 text-[8px] font-black uppercase tracking-[0.3em] text-violet-500">
                Strategic_Insights [Analysis]
            </div>

            {insights.map((item, i) => (
                <div
                    key={i}
                    className="group p-6 transition-colors hover:bg-muted/5"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground">
                            {item.label}
                        </span>
                        <item.icon
                            size={14}
                            className={cn(
                                'opacity-30 transition-opacity group-hover:opacity-100',
                                item.color,
                            )}
                        />
                    </div>
                    <div className="text-xl font-black italic tracking-tighter">
                        {item.val}
                    </div>
                    <div className="mt-1 text-[7px] font-bold uppercase tracking-widest text-muted-foreground/30">
                        {item.desc}
                    </div>
                </div>
            ))}
        </div>
    );
}
