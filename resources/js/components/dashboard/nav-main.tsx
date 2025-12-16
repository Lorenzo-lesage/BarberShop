'use client';

// Icons
import { type LucideIcon } from 'lucide-react';

// Components
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
    items,
}: {
    items: {
        label: string;
        href: string;
        icon: LucideIcon;
    }[];
}) {
    /*
    |-----------------------------------------------------------------------
    | Methods
    |-----------------------------------------------------------------------
    */

    const HandleRoute = (href: string) => {
        window.location.href = href;
    };

    /*
    |-----------------------------------------------------------------------
    | Render
    |-----------------------------------------------------------------------
    */

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Managemant</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                            tooltip={item.label}
                            onClick={() => HandleRoute(item.href)}
                        >
                            {item.icon && <item.icon />}
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
