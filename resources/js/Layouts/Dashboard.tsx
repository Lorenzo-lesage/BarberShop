import { cn } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';

// Interfaces
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

export default function Page({
    children,
    breadcrumbs = [],
    className,
}: {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItemType[];
    className?: string;
}) {
    /*
    |----------------------------------------------------------------------
    | Data
    |----------------------------------------------------------------------
    */

    const { auth } = usePage<PageProps>().props;

    /*
    |----------------------------------------------------------------------
    | Render
    |----------------------------------------------------------------------
    */

    return (
        <>
            <Head title="Dashboard" />

            <SidebarProvider>
                <AppSidebar user={auth.user} />
                <SidebarInset>
                    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <BreadcrumbNav items={breadcrumbs} />
                        </div>
                        <div className="ml-auto mr-4 flex items-center gap-4">
                            <ThemeSwitcher />
                        </div>
                    </header>
                    <div
                        className={cn(
                            'flex flex-1 flex-col gap-4 p-4 pt-0',
                            className,
                        )}
                    >
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
