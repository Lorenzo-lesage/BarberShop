// Interfaces
import type { User } from '@/interfaces/auth';

export function HeaderDashboard({ user }: { user: User }) {
    return (
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
                    {user.name.split(' ')[0]}_
                    <span className="text-outline text-primary">CORE</span>
                </h1>
            </div>
            <div className="hidden text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">
                <p>ID: #{user.id.toString().padStart(4, '0')}</p>
                <p>ST_DATE: {new Date().toLocaleDateString('it-IT')}</p>
            </div>
        </div>
    );
}
