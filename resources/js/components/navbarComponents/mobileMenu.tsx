'use client';

import type { AuthProps } from '@/interfaces/auth';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Icons
import {
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    Settings,
    Terminal,
    UserPlus,
} from 'lucide-react';

// Toast
import { toast } from 'sonner';

export default function MobileMenu() {
    const { auth } = usePage<AuthProps>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const loadingToast = toast.loading('Terminating_Session...');

        router.post(
            route('logout'),
            {},
            {
                onSuccess: () => {
                    toast.success('Session_Closed', { id: loadingToast });
                },
            },
        );
    };

    const NavLink = ({ href, icon: Icon, children, active }: any) => (
        <a
            href={href}
            className={cn(
                'group flex items-center justify-between border-b border-border/50 py-5 transition-all',
                active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                router.get(href);
            }}
        >
            <div className="flex items-center gap-4">
                <Icon
                    size={18}
                    className={cn(
                        active
                            ? 'text-primary'
                            : 'text-muted-foreground/40 group-hover:text-primary',
                    )}
                />
                <span className="text-xl font-black uppercase italic tracking-tighter">
                    {children}
                </span>
            </div>
            {active && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#fff]" />
            )}
        </a>
    );

    return (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="border-l border-border bg-background p-0 sm:w-[350px]"
            >
                {/* --- HEADER TECNICO --- */}
                <div className="flex h-20 items-center justify-between border-b border-border bg-muted/20 px-6">
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                            System_Nav
                        </span>
                    </div>
                </div>

                <div className="flex h-full flex-col justify-between px-6 pb-24 pt-10">
                    <div>
                        {/* --- USER STATUS --- */}
                        <div className="mb-12 space-y-1">
                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary">
                                Identity_Context
                            </p>
                            <h2 className="truncate text-3xl font-black uppercase italic tracking-tighter">
                                {auth?.user
                                    ? auth.user.name.replace(' ', '_')
                                    : 'Guest_User'}
                            </h2>
                            <p className="font-mono text-[10px] text-muted-foreground/60">
                                {auth?.user
                                    ? auth.user.email
                                    : 'Authentication_Required'}
                            </p>
                        </div>

                        {/* --- NAVIGATION --- */}
                        <nav className="flex flex-col">
                            {auth?.user ? (
                                <>
                                    <NavLink
                                        href={route('dashboard')}
                                        icon={LayoutDashboard}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        href={route('profile.edit')}
                                        icon={Settings}
                                        active={route().current('profile.edit')}
                                    >
                                        Settings
                                    </NavLink>

                                    <button
                                        onClick={handleLogout}
                                        className="group mt-10 flex items-center gap-4 py-4 text-muted-foreground transition-colors hover:text-destructive"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center border border-border group-hover:border-destructive/30 group-hover:bg-destructive/5">
                                            <LogOut size={16} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">
                                            Terminate_Session
                                        </span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        href={route('login')}
                                        icon={LogIn}
                                        active={route().current('login')}
                                    >
                                        Access_Log
                                    </NavLink>
                                    <NavLink
                                        href={route('register')}
                                        icon={UserPlus}
                                        active={route().current('register')}
                                    >
                                        Join_Registry
                                    </NavLink>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* --- FOOTER MENU --- */}
                    <div className="space-y-4">
                        <div className="h-px w-12 bg-primary" />
                        <p className="text-[8px] font-bold uppercase leading-relaxed tracking-[0.2em] text-muted-foreground/40">
                            Artisan_Booking_System v2.0 <br />
                            All_Systems_Operational
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
