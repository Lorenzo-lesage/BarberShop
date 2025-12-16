'use client';

import { usePage } from '@inertiajs/react';

// Interfaces
import type { PageProps } from '@/types';

// Icons
import {
    BookOpen,
    Bot,
    Frame,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from 'lucide-react';
import * as React from 'react';

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
import { barberItems } from '../../Feauteres/Barbers/barberItems';
import { clientItems } from '../../Feauteres/Barbers/clientItems';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
                {
                    title: 'Settings',
                    url: '#',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
                },
            ],
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map,
        },
    ],
};

export function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user: { name: string; email: string; avatar: string };
}) {
    /*
    |-----------------------------------------------------------------------
    | Data
    |-----------------------------------------------------------------------
    */

    const { auth } = usePage<PageProps>().props;
    const isBarber = auth.user.is_barber;

    const items = isBarber ? barberItems : clientItems;

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
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={props.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
