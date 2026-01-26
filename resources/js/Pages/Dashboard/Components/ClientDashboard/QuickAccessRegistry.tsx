import { Link } from '@inertiajs/react';

// Componets
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Icons
import { ArrowUpRight } from 'lucide-react';

// Interfaces
import type { DashboardProps } from '@/interfaces/saloon';

export function QuickAccessRegistry({
    history,
}: {
    history: DashboardProps['history'];
}) {
    /*
    |---------------------------------------------------------------------------
    | Methods
    |---------------------------------------------------------------------------
    */

    /**
     * Get unique history
     * @param history
     * @returns
     */
    const uniqueBySaloon = (history: DashboardProps['history'] = []) => {
        return Array.from(
            new Map(history.map((item) => [item.saloon.id, item])).values(),
        );
    };
    const uniqueHistory = uniqueBySaloon(history);

    /*
    |---------------------------------------------------------------------------
    | Render
    |---------------------------------------------------------------------------
    */

    if (!history.length) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="h-1 w-1 animate-pulse bg-primary" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Quick_Access_Registry
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Questa sezione filtrerebbe i saloni dalla history per mostrare i più frequentati */}
                {uniqueHistory.slice(0, 3).map((item, i) => (
                    <Link
                        key={`fav-${i}`}
                        href={route('saloons.dashboard.show', item.saloon.id)}
                        className="group relative flex items-center gap-4 border border-border/40 bg-muted/5 p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                    >
                        <div className="h-12 w-12 shrink-0 overflow-hidden border border-border/60">
                            <Avatar className="h-full w-full rounded-none">
                                <AvatarImage
                                    src={`/storage/${item.saloon.main_photo?.path}`}
                                    className="object-cover grayscale transition-all group-hover:grayscale-0"
                                />
                                <AvatarFallback className="rounded-none text-xs font-black">
                                    {item.saloon.name.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-xs font-black uppercase italic tracking-tight">
                                {item.saloon.name}
                            </span>
                            <span className="text-[9px] font-bold uppercase text-muted-foreground/60">
                                {item.saloon.city}
                            </span>
                        </div>

                        <ArrowUpRight
                            size={14}
                            className="ml-auto text-primary opacity-0 transition-all group-hover:opacity-100"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
