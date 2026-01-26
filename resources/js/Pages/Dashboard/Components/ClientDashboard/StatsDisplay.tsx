interface StatsDisplayProps {
    totalSessions: number;
    preferredBarber: string;
    lastUpdate: string | null;
}

export function StatsDisplay({
    totalSessions,
    preferredBarber,
    lastUpdate,
}: StatsDisplayProps) {
    const stats = [
        {
            label: 'Total_Sessions',
            value: totalSessions.toString().padStart(2, '0'),
        },
        {
            label: 'Preferred_Operator',
            value: preferredBarber.toUpperCase().replace(' ', '_'),
        },
        { label: 'Last_Profile_Update', value: lastUpdate || '--' },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-8 md:grid-cols-3">
            {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1 text-center">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        {stat.label}
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                        {stat.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
