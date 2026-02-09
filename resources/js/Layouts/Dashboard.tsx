'use client';

import { cn } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';

// Interfaces

// Interfaces
import { User } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import type { PageProps } from '@/types';

// Components
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { BreadcrumbNav } from '@/components/dashboard/breadcrumbNav';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';

// Icons

export default function DashboardLayout({
    children,
    breadcrumbs = [],
    className,
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItemType[];
    className?: string;
}) {
    /*
    |-----------------------------------------------------------------------
    | Data
    |-----------------------------------------------------------------------
    */

    const { auth } = usePage<PageProps>().props;
    const user = auth.user as User;

    /*
    |-----------------------------------------------------------------------
    | Effects
    |-----------------------------------------------------------------------
    */

    /*
    |-----------------------------------------------------------------------
    | Render
    |-----------------------------------------------------------------------
    */

    return (
        <SidebarProvider>
            <Head title="System_Dashboard" />

            {/* Sidebar con stile Artisan (assumendo che AppSidebar segua lo stile) */}
            <AppSidebar user={user} />

            <SidebarInset className="bg-background">
                {/* --- HEADER TECNICO --- */}
                <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md transition-all">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="hover:bg-muted" />

                        <Separator
                            orientation="vertical"
                            className="mx-2 h-4 bg-primary/20"
                        />

                        {/* Breadcrumbs con font più tecnico se possibile nel componente */}
                        <div className="hidden sm:block">
                            <BreadcrumbNav items={breadcrumbs} />
                        </div>
                    </div>

                    {/* STATUS BAR DESTRA */}
                    <div className="flex items-center gap-4 px-6">
                        <div className="hidden items-center gap-4 md:flex">
                            {/* System Status Indicator */}
                            <div className="flex items-center gap-2 border border-border/40 bg-muted/20 px-3 py-1">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    System_Active
                                </span>
                            </div>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

                        <div className="flex items-center gap-2">
                            <ThemeSwitcher />
                        </div>
                    </div>
                </header>

                {/* --- MAIN CONTENT AREA --- */}
                <main
                    className={cn(
                        'relative flex flex-1 flex-col overflow-x-hidden',
                        'before:absolute before:inset-0 before:z-0',
                        'before:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]',
                        'before:[background-size:20px_20px]',
                        'before:opacity-[0.05]',
                        'before:animate-space-float',
                        'dark:before:bg-[radial-gradient(#ffffff_1px,transparent_1px)]',
                        className,
                    )}
                >
                    <div className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-[1600px] space-y-8">
                            {children}
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
