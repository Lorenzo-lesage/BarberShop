'use client';

import { Link } from '@inertiajs/react';

// Icons
import { MoreHorizontal, Terminal } from 'lucide-react';

// Components
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

// Interfaces
import { LucideIcon } from 'lucide-react';

interface NavAppointment {
    id: number;
    name: string;
    url: string;
    icon: LucideIcon;
}

export function NavProjects({
    appointments,
}: {
    appointments: NavAppointment[];
}) {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            {/* Label tecnica con icona */}
            <SidebarGroupLabel className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-primary/70">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">
                    <Terminal size={12} />
                    Live_Queue
                </div>
                {appointments.length > 2 && (
                    <Link
                        href={route('appointments.index')}
                        prefetch
                        className="flex items-center justify-center gap-2 rounded border border-border/40 bg-muted/20 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 transition-colors hover:bg-foreground hover:text-background"
                    >
                        <MoreHorizontal className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            More
                        </span>
                    </Link>
                )}
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 space-y-1">
                {appointments.length === 0 ? (
                    <SidebarMenuItem className="border border-dashed border-border/40 bg-muted/5 py-2 text-center">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                            Queue_Empty
                        </span>
                    </SidebarMenuItem>
                ) : (
                    appointments.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                asChild
                                className="group/item h-9 rounded-none border-l-2 border-transparent transition-all hover:border-primary hover:bg-primary/5"
                            >
                                <Link
                                    href={route('appointments.index')}
                                    prefetch
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center bg-muted/50 group-hover/item:bg-primary/10">
                                        <item.icon className="h-3 w-3 text-muted-foreground transition-colors group-hover/item:text-primary" />
                                    </div>

                                    <div className="flex flex-col overflow-hidden">
                                        <span className="truncate text-[11px] font-black uppercase leading-none tracking-tighter text-foreground/80 group-hover/item:text-foreground">
                                            {item.name}
                                        </span>
                                        <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/50">
                                            Ref_ID_
                                            {item.id
                                                .toString()
                                                .padStart(3, '0')}
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
