'use client';

import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

// Interfaces

// Icons
import { User } from 'lucide-react';

// Components
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function TeamSwitcher() {
    const { open } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div
                    className={cn(
                        'transition-all duration-300 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                        !open && 'px-0',
                    )}
                >
                    <div
                        className={cn(
                            'flex w-full items-center justify-between px-0',
                            !open && 'px-0',
                        )}
                    >
                        <Link href="/">
                            <ApplicationLogo
                                className={cn(
                                    'h-8 fill-current text-gray-500',
                                    !open && 'mx-auto',
                                )}
                            />
                        </Link>

                        {open ? (
                            <div className="grid text-left text-sm leading-tight">
                                <Link href={route('profile.edit')}>
                                    <User />
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
