// Components
import { Badge } from '@/components/ui/badge';

export function DashboardPreview() {
    return (
        <section className="container mx-auto px-6 py-40 md:px-12">
            <div className="flex flex-col gap-20 lg:flex-row lg:items-center">
                <div className="order-2 space-y-8 lg:order-1 lg:w-1/2">
                    <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/5 text-primary"
                    >
                        Control Tower
                    </Badge>
                    <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
                        One Terminal. <br />
                        <span className="text-muted-foreground/30 dark:text-muted-foreground/40">
                            Total Control.
                        </span>
                    </h2>
                    <p className="max-w-md text-xl font-light leading-relaxed text-muted-foreground">
                        Your shop's vitals, distilled into a single,
                        high-performance interface. Monitor revenue, manage
                        staff, and analyze growth without leaving the cockpit.
                    </p>
                    <div className="flex gap-12 pt-8">
                        {[
                            { v: '0.2s', l: 'Latency' },
                            { v: '256-bit', l: 'Encryption' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-black tracking-tighter text-foreground">
                                    {stat.v}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-60">
                                    {stat.l}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MOCKUP INTERATTIVO ADATTIVO */}
                <div className="order-1 lg:order-2 lg:w-1/2">
                    <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-border bg-card p-3 shadow-2xl transition-colors">
                        {/* Inner Terminal Shell */}
                        <div className="flex h-full w-full flex-col border border-border/50 bg-background shadow-inner">
                            {/* Fake Header */}
                            <div className="flex h-12 items-center justify-between border-b border-border bg-muted/30 px-4">
                                <div className="flex gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-red-500/30" />
                                    <div className="h-2 w-2 rounded-full bg-yellow-500/30" />
                                    <div className="h-2 w-2 rounded-full bg-green-500/30" />
                                </div>
                                <div className="h-4 w-32 rounded-full bg-muted" />
                            </div>

                            {/* Dashboard Content Mockup */}
                            <div className="grid grid-cols-3 gap-4 p-6">
                                {/* Stat Cards */}
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-20 space-y-2 border border-border bg-muted/20 p-3"
                                    >
                                        <div className="h-1 w-8 bg-primary/40" />
                                        <div className="h-4 w-12 bg-muted" />
                                    </div>
                                ))}

                                {/* Main Chart Area */}
                                <div className="relative col-span-3 h-40 overflow-hidden border border-border bg-gradient-to-t from-primary/5 to-transparent">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-10">
                                        <svg
                                            viewBox="0 0 400 100"
                                            className="w-full fill-none stroke-primary stroke-[1.5]"
                                        >
                                            <path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50" />
                                        </svg>
                                    </div>
                                </div>

                                {/* List items simulated */}
                                <div className="col-span-2 space-y-3">
                                    <div className="h-4 w-full bg-muted/40" />
                                    <div className="h-4 w-[90%] bg-muted/30" />
                                    <div className="h-4 w-2/3 bg-muted/20" />
                                </div>
                                <div className="h-20 border border-border bg-muted/10" />
                            </div>
                        </div>

                        {/* Floating Badge (sempre scuro per contrasto o adattivo) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-2xl transition-transform group-hover:scale-110">
                            Real-time Sync Active
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
