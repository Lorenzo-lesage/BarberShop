import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Components
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

// Icons
import { Bell, Terminal } from 'lucide-react';

export function GlobalNotificationDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<{
        id: string;
        title: string;
        description: string;
    } | null>(null);

    useEffect(() => {
        const handleShowNotif = (e: any) => {
            setData(e.detail);
            setIsOpen(true);
        };

        window.addEventListener('show-global-notification', handleShowNotif);
        return () =>
            window.removeEventListener(
                'show-global-notification',
                handleShowNotif,
            );
    }, []);

    const handleClose = () => {
        if (!data) return;
        router.post(
            `/notifications/${data.id}/mark-as-read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setIsOpen(false),
            },
        );
    };

    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-md border-none bg-background/95 p-0 shadow-2xl backdrop-blur-md">
                {/* 1. Header Decorativo "Artisan" */}
                <div className="relative overflow-hidden border-b border-primary/20 bg-muted/30 p-4">
                    {/* Background Noise/Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '10px 10px',
                        }}
                    />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/30 bg-background/50 shadow-[0_0_10px_rgba(var(--primary),0.1)]">
                                <Bell className="h-4 w-4 animate-pulse text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                    System_Broadcast
                                </span>
                                <span className="font-mono text-[8px] uppercase text-muted-foreground">
                                    Inbound_Signal // {data.id.slice(0, 8)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Content Area */}
                <div className="relative p-8 px-10">
                    {/* Angoli Tecnici */}
                    <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-primary/20" />
                    <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-primary/20" />

                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-foreground md:text-3xl">
                            {data.title}
                            <span className="animate-pulse text-primary">
                                _
                            </span>
                        </DialogTitle>
                        <div className="flex gap-4">
                            <div className="h-full w-[2px] shrink-0 bg-primary/20" />
                            <p className="text-xs font-medium leading-relaxed tracking-wide text-muted-foreground/80">
                                {data.description}
                            </p>
                        </div>
                    </DialogHeader>
                </div>

                {/* 3. Footer con Button Custom */}
                <DialogFooter className="border-t border-primary/10 bg-muted/20 p-4">
                    <button
                        onClick={handleClose}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden bg-primary px-4 py-3 transition-all hover:bg-primary/90 active:scale-95"
                    >
                        {/* Effetto Scanning Line sul bottone */}
                        <div className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

                        <Terminal className="h-4 w-4 text-primary-foreground" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-foreground">
                            Acknowledge_Signal
                        </span>
                    </button>
                </DialogFooter>

                {/* MetaData laterale */}
                <div className="absolute -left-12 top-1/2 hidden -rotate-90 font-mono text-[8px] uppercase tracking-[0.4em] text-muted-foreground/30 md:block">
                    Auth_Secure_Connection
                </div>
            </DialogContent>
        </Dialog>
    );
}
