'use client';

import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

// Icons
import { type LucideIcon, Activity, ChevronRight } from 'lucide-react';

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
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">
                    <Activity size={10} /> Main_Terminal
                </div>
            </SidebarGroupLabel>

            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    // Utilizziamo route().current() se disponibile, o un confronto pulito dell'URL
                    const isActive =
                        route().current(item.href) ||
                        window.location.pathname === item.href;

                    return (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.label}
                                className={cn(
                                    'group/menu relative h-11 rounded-none border-l-2 transition-all duration-200',
                                    isActive
                                        ? 'border-primary bg-primary/5 text-foreground'
                                        : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex w-full items-center px-3"
                                >
                                    {item.icon && (
                                        <item.icon
                                            size={18}
                                            className={cn(
                                                'transition-transform duration-300',
                                                isActive
                                                    ? 'scale-110 text-primary'
                                                    : 'opacity-50 group-hover/menu:opacity-100',
                                            )}
                                        />
                                    )}

                                    <span
                                        className={cn(
                                            'ml-3 text-[11px] font-black uppercase tracking-widest transition-all',
                                            isActive
                                                ? 'translate-x-1'
                                                : 'group-hover/menu:translate-x-1',
                                        )}
                                    >
                                        {item.label.replace(/\s+/g, '_')}
                                    </span>

                                    {isActive && (
                                        <ChevronRight
                                            size={12}
                                            className="ml-auto animate-pulse text-primary"
                                        />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
