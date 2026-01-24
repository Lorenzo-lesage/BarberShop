'use client';

import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

// Interfaces
import type { AuthProps } from '@/interfaces/auth';

// Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

// Icons
import { Power, Shield, Terminal, User as UserIcon } from 'lucide-react';

// Toast
import { toast } from 'sonner';

export function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        profile_photo_url: string | undefined;
    };
}) {
    /*
    |---------------------------------------------------------------------------
    | Data
    |---------------------------------------------------------------------------
    */

    const { isMobile } = useSidebar();
    const { flash } = usePage<AuthProps>().props;

    /*
    |---------------------------------------------------------------------------
    | Hooks
    |---------------------------------------------------------------------------
    */

    useEffect(() => {
        if (flash?.toast) {
            const { type, message, description } = flash.toast;
            setTimeout(() => {
                const toastFn =
                    type === 'success' ? toast.success : toast.error;
                toastFn(message, { description });
            }, 100);
        }
    }, [flash]);

    /*
    |---------------------------------------------------------------------------
    | Methods
    |---------------------------------------------------------------------------
    */

    /**
     * Handle logout
     */
    const handleLogout = () => {
        const loadingToast = toast.loading('Terminating_Session...');
        router.post(
            route('logout'),
            {},
            {
                onSuccess: () =>
                    toast.success('Session_Closed', { id: loadingToast }),
                onError: () =>
                    toast.error('Termination_Failed', { id: loadingToast }),
            },
        );
    };

    /*
    |---------------------------------------------------------------------------
    | Render
    |---------------------------------------------------------------------------
    */

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="rounded-none border border-transparent transition-all data-[state=open]:border-border data-[state=open]:bg-muted/50"
                        >
                            <Avatar className="h-8 w-8 rounded-none border border-border/50">
                                <AvatarImage
                                    src={user.profile_photo_url}
                                    alt={user.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-none bg-primary/10 text-[10px] font-black">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-xs leading-tight">
                                <span className="truncate font-black uppercase tracking-tighter">
                                    {user.name.replace(' ', '_')}
                                </span>
                                <span className="truncate font-mono text-[9px] opacity-50">
                                    {user.email}
                                </span>
                            </div>
                            <Terminal className="ml-auto size-3 opacity-30" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-none border-border bg-background p-0 shadow-2xl"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="bg-muted/30 p-4 font-normal">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-none border border-primary/20">
                                    <AvatarImage
                                        src={user.profile_photo_url}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-none text-xs font-black">
                                        {user.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left leading-tight">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                        Active_User
                                    </div>
                                    <span className="truncate text-sm font-black uppercase italic tracking-tighter">
                                        {user.name}
                                    </span>
                                    <span className="truncate font-mono text-[9px] opacity-50">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="m-0" />

                        <DropdownMenuGroup className="p-2">
                            <DropdownMenuItem
                                onClick={() =>
                                    router.visit(route('profile.edit'))
                                }
                                className="cursor-pointer gap-3 rounded-none px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5"
                            >
                                <Shield size={14} className="text-primary/60" />
                                Account_Security
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.visit('/')}
                                className="cursor-pointer gap-3 rounded-none px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5"
                            >
                                <UserIcon
                                    size={14}
                                    className="text-primary/60"
                                />
                                Public_View
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="m-0" />

                        <div className="p-2">
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer gap-3 rounded-none px-3 py-2 text-[10px] font-black uppercase tracking-widest text-destructive transition-colors hover:bg-destructive/5 focus:bg-destructive focus:text-white"
                            >
                                <Power size={14} />
                                Terminate_Session
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
