export function DualExperience() {
    return (
        <section className="relative border-y border-border bg-background transition-colors duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* LEFT SIDE: FOR THE ARTISAN */}
                <div className="group relative overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
                    <div className="relative z-10 space-y-12 p-12 md:p-24">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                For the Professional
                            </span>
                            <h3 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter text-foreground md:text-7xl">
                                Scale your <br />
                                <span className="text-outline-adaptive italic opacity-40 transition-opacity group-hover:opacity-100">
                                    Legacy.
                                </span>
                            </h3>
                        </div>

                        <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
                            Stop managing your business through fragmented chats
                            and scattered notes. Reclaim your time with a
                            high-performance engine designed for masters of the
                            craft.
                        </p>

                        <ul className="space-y-6">
                            {[
                                'Real-time revenue & growth analytics',
                                'Advanced CRM with technical style notes',
                                'Priority placement in the elite network',
                            ].map((text, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground/70 transition-colors group-hover:text-foreground"
                                >
                                    <div className="h-[1px] w-8 bg-primary" />{' '}
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Background Accent - Più discreto in light mode */}
                    <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-primary/[0.08] blur-[120px] transition-colors duration-700 group-hover:bg-primary/[0.12] dark:bg-primary/5" />
                </div>

                {/* RIGHT SIDE: FOR THE CLIENT */}
                <div className="group relative overflow-hidden bg-muted/20 dark:bg-white/[0.02]">
                    <div className="relative z-10 space-y-12 p-12 md:p-24">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                                For the Individual
                            </span>
                            <h3 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter text-foreground md:text-7xl">
                                Refine your <br />
                                <span className="text-outline-adaptive italic opacity-40 transition-opacity group-hover:opacity-100">
                                    Ritual.
                                </span>
                            </h3>
                        </div>

                        <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
                            Connect with the finest artisans in your city.
                            Experience frictionless booking and bespoke service
                            tailored to your personal aesthetic.
                        </p>

                        <ul className="space-y-6">
                            {[
                                'Access to top-tier verified barbers',
                                'Instant 24/7 autonomous booking',
                                'Personal style archive & preferences',
                            ].map((text, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground/70 transition-colors group-hover:text-foreground"
                                >
                                    <div className="h-[1px] w-8 bg-foreground/20 transition-colors group-hover:bg-foreground/60" />{' '}
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Background Accent */}
                    <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/4 -translate-y-1/4 rounded-full bg-foreground/[0.03] blur-[120px] dark:bg-white/5" />
                </div>
            </div>
        </section>
    );
}
