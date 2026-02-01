// Icons
import { Calendar, LayoutDashboard, Users } from 'lucide-react';

export function FeautersBento() {
    return (
        <section className="relative flex items-center bg-background px-6 py-40 md:px-12">
            {/* Background accent decorativo - un fascio di luce sottile */}
            <div className="absolute left-1/2 top-0 h-[1px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-primary" />
            <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
                {[
                    {
                        icon: <Calendar className="h-8 w-8" />,
                        title: 'Live Booking',
                        desc: 'Zero-latency scheduling with automated conflict resolution.',
                        tag: 'Engine',
                    },
                    {
                        icon: <Users className="h-8 w-8" />,
                        title: 'Client Intelligence',
                        desc: 'Next-gen CRM to track every snip, preference, and visit history.',
                        tag: 'CRM',
                    },
                    {
                        icon: <LayoutDashboard className="h-8 w-8" />,
                        title: 'Growth Analytics',
                        desc: 'Data-driven insights to scale your brand and revenue.',
                        tag: 'Data',
                    },
                ].map((f, i) => (
                    <div
                        key={i}
                        className="group relative flex flex-col justify-between border border-primary/20 bg-background p-12 transition-all duration-700 hover:bg-primary hover:text-primary-foreground"
                    >
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="transition-transform duration-500 group-hover:scale-110">
                                    {f.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                    {f.tag}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black uppercase leading-none tracking-tighter md:text-2xl lg:text-3xl">
                                {f.title}
                            </h3>
                            <p className="text-lg font-light leading-relaxed opacity-60 group-hover:opacity-100">
                                {f.desc}
                            </p>
                        </div>
                        <div className="mt-12 overflow-hidden">
                            <div className="h-[2px] w-full translate-x-[-100%] bg-current transition-transform duration-700 group-hover:translate-x-0" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
