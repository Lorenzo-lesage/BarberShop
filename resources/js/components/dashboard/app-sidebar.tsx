'use client';

import { usePage } from '@inertiajs/react';
import { format } from 'date-fns'; // Importa format
import * as React from 'react';

// Interfaces
import { User } from '@/interfaces/auth';
import { Appointment } from '@/interfaces/saloon';

// Icons
import { Clock } from 'lucide-react';

// Components
import { NavMain } from '@/components/dashboard/nav-main';
import { NavProjects } from '@/components/dashboard/nav-projects';
import { NavUser } from '@/components/dashboard/nav-user';
import { TeamSwitcher } from '@/components/dashboard/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

// items
import { barberItems } from '../../Feauteres/barberItems';
import { clientItems } from '../../Feauteres/clientItems';

export function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user: User;
}) {
    /*
    |-----------------------------------------------------------------------
    | Data
    |-----------------------------------------------------------------------
    */

    const { auth } = usePage().props;
    const isBarber = auth.user.is_barber;

    const items = isBarber ? barberItems : clientItems;

    /**
     * Appointments Items
     */
    const appointmentItems =
        auth.user.appointments?.map((app: Appointment) => ({
            id: app.id,
            name: isBarber
                ? `${app.client?.name} (${format(new Date(app.appointment_time), 'dd/MM/yyyy HH:mm')})`
                : `${app.saloon?.name} (${format(new Date(app.appointment_time), 'dd/MM/yyyy HH:mm')})`,
            icon: Clock,
        })) || [];

    /*
    |-----------------------------------------------------------------------
    | Render
    |-----------------------------------------------------------------------
    */

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={items} />
                <NavProjects appointments={appointmentItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={props.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
