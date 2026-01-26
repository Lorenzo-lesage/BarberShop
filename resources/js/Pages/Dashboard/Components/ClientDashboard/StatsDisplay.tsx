// Interfaces
import type { User } from '@/interfaces/auth';
import type { DashboardProps } from '@/interfaces/saloon';

export function StatsDisplay({
    user,
    history,
}: {
    user: User;
    history: DashboardProps['history'];
}) {
    /*
    |---------------------------------------------------------------------------
    | Methods
    |---------------------------------------------------------------------------
    */

    /**
     * Get preferred barber
     * @returns
     */
    const getPreferredBarber = () => {
        if (!history || history.length === 0) return 'NONE';

        // Contiamo le occorrenze di ogni barbiere
        const counts = history.reduce((acc: Record<string, number>, curr) => {
            acc[curr.barber] = (acc[curr.barber] || 0) + 1;
            return acc;
        }, {});

        // Troviamo quello con il valore più alto
        return Object.entries(counts).reduce((a, b) =>
            a[1] > b[1] ? a : b,
        )[0];
    };

    const preferredBarber = getPreferredBarber();

    /*
    |---------------------------------------------------------------------------
    | Render
    |---------------------------------------------------------------------------
    */

    return (
        <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-8 md:grid-cols-3">
            {[
                {
                    label: 'Total_Sessions',
                    value: history.length.toString().padStart(2, '0'),
                },
                {
                    label: 'Preferred_Operator',
                    value: preferredBarber.toUpperCase().replace(' ', '_'),
                },
                {
                    label: 'Last_Profile_Update',
                    value: user?.updated_at
                        ? new Date(user.updated_at).toLocaleString([], {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : user?.created_at
                          ? new Date(user.created_at).toLocaleString([], {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                          : '--',
                },
            ].map((stat, i) => (
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
