'use client';

import { Link } from '@inertiajs/react';

// Interfaces
interface NavAppointment {
    id: number;
    name: string;
    url: string;
    icon: LucideIcon;
}

// Icons
import { MoreHorizontal } from 'lucide-react';

// Components
import { Badge } from '@/components/ui/badge';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavProjects({
    appointments,
}: {
    appointments: NavAppointment[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Appointments</SidebarGroupLabel>
            <SidebarMenu>
                {appointments.length === 0 && (
                    <SidebarMenuItem>
                        <span className="text-sm text-muted-foreground">
                            No Appointments
                        </span>
                    </SidebarMenuItem>
                )}
                {appointments.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url} prefetch>
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <Link href={route('appointments.index')} prefetch>
                        <Badge variant="outline">
                            <MoreHorizontal className="mr-2 h-4 w-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                                Show All Appointments
                            </span>
                        </Badge>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
