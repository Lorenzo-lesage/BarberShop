import { Link } from '@inertiajs/react';

// Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Icons
import { Terminal } from 'lucide-react';

// Interfaces
import type { DashboardProps } from '@/interfaces/saloon';

export function SessionLogs({
    history,
}: {
    history: DashboardProps['history'];
}) {
    return (
        <Card className="rounded-none border-border/40 shadow-none">
            <CardHeader className="border-b border-border/40 bg-muted/20">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                            Session_Logs (last_5)
                        </CardTitle>
                        <CardDescription className="mt-1 text-[9px] uppercase tracking-wider">
                            Registry_Depth: {history.length}_Items
                        </CardDescription>
                    </div>
                    <Terminal size={16} className="text-muted-foreground/30" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                    {history.length > 0 ? (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col justify-between p-4 transition-colors hover:bg-muted/30 md:flex-row md:items-center"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="hidden font-mono text-[10px] italic text-muted-foreground/40 md:block">
                                        #{item.id.toString().padStart(4, '0')}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black uppercase tracking-widest transition-colors group-hover:text-primary">
                                            {item.saloon.name}
                                        </span>
                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground opacity-50">
                                            Op: {item.barber} {'//'}{' '}
                                            {item.saloon.city}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-8 md:mt-0 md:justify-end">
                                    <div className="text-right">
                                        <div className="text-[11px] font-black uppercase tracking-tighter">
                                            {item.date}
                                        </div>
                                        <div className="font-mono text-[9px] opacity-40">
                                            {item.time}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="h-8 rounded-none border-border/60 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
                                    >
                                        <Link
                                            href={route(
                                                'saloons.dashboard.show',
                                                item.saloon.id,
                                            )}
                                        >
                                            Repeat_Order
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-[8px] font-bold uppercase italic tracking-[0.3em] text-muted-foreground/30 md:text-[10px]">
                            No_History_Found_In_Local_Buffer
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
