import { Link } from '@inertiajs/react';

// Components
import { Button } from '@/components/ui/button';

// Icons
import { Activity, ArrowUpRight } from 'lucide-react';

// Interfaces
import type { User } from '@/interfaces/auth';

export function HeaderClientDashboard({ user }: { user: User }) {
    return (
        <div className="flex flex-col gap-6 border-b border-border/60 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    <Activity size={12} /> System_Ready
                </div>
                <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter sm:text-6xl">
                    Welcome,{' '}
                    <span className="text-primary">
                        {user.name.split(' ')[0]}
                    </span>
                </h1>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    ID_AUTH: {user.id.toString().padStart(5, '0')} {'//'}{' '}
                    Access_Level: Client
                </p>
            </div>
            <Button
                asChild
                className="h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:skew-x-2"
            >
                <Link href={route('saloons.dashboard.index')}>
                    Explore_Network <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
    );
}
