'use client';

import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';

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
    /*
    |-----------------------------------------------------------------------
    | Data
    |-----------------------------------------------------------------------
    */

    const { open } = useSidebar();
    const { auth } = usePage().props;

    /*
    |-----------------------------------------------------------------------
    | Render
    |-----------------------------------------------------------------------
    */

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div
                    className={cn(
                        'flex h-16 items-center transition-all duration-300',
                        open ? 'justify-between px-4' : 'justify-center px-0',
                    )}
                >
                    {/* --- AREA LOGO / BRAND --- */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center justify-center transition-transform hover:scale-105"
                        >
                            <ApplicationLogo
                                className={cn(
                                    'h-9 fill-current text-foreground transition-all',
                                )}
                            />
                        </Link>

                        {open && (
                            <div className="flex flex-col border-l border-border/60 pl-3">
                                <span className="text-[10px] font-black uppercase leading-none tracking-[0.3em]">
                                    Manage
                                </span>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-primary/60">
                                    {auth.user.is_barber
                                        ? 'your saloon'
                                        : 'Appointments'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* --- USER ACTION (Solo se aperto) --- */}
                    {open && (
                        <Link
                            href={route('profile.edit')}
                            className="group flex h-8 w-8 items-center justify-center border border-border bg-muted/20 transition-all hover:border-primary hover:bg-primary/5"
                            title="Account_Settings"
                        >
                            <User
                                size={14}
                                className="text-muted-foreground transition-colors group-hover:text-primary"
                            />
                        </Link>
                    )}

                    {/* --- STATUS DOT (Solo se chiuso) --- */}
                    {!open && (
                        <div className="absolute bottom-2 h-1 w-1 animate-pulse rounded-full bg-primary" />
                    )}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
