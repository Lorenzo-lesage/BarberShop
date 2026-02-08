'use client';

import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { useMemo } from 'react';

// Components
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Layout & Icons
import Dashboard from '@/Layouts/Dashboard';
import {
    Activity,
    AlertCircle,
    Clock,
    Mail,
    ShieldCheck,
    UserCircle,
} from 'lucide-react';

// Interfaces
import { User } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';

interface Props {
    client: User;
    breadcrumbs: BreadcrumbItemType[];
}

export default function Show({ client, breadcrumbs }: Props) {
    /*
    |-------------------------------------------------------------------
    | Data
    |-------------------------------------------------------------------
    */
    const isMobile = window.innerWidth < 768;

    /*
    |-------------------------------------------------------------------
    | Methods
    |-------------------------------------------------------------------
    */

    /**
     * Calculate previous appointments
     */
    const previousAppointments = useMemo(() => {
        if (!client.appointments) return [];
        return client.appointments
            .filter((a) => new Date(a.appointment_time) < new Date())
            .sort(
                (a, b) =>
                    new Date(b.appointment_time).getTime() -
                    new Date(a.appointment_time).getTime(),
            );
    }, [client.appointments]);

    /**
     * Calculate next appointments
     */
    const nextAppointments = useMemo(() => {
        if (!client.appointments) return [];
        return client.appointments
            .filter((a) => new Date(a.appointment_time) >= new Date())
            .sort(
                (a, b) =>
                    new Date(a.appointment_time).getTime() -
                    new Date(b.appointment_time).getTime(),
            )
            .slice(0, 5);
    }, [client.appointments]);

    /*
    |-------------------------------------------------------------------
    | Render
    |-------------------------------------------------------------------
    */

    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="min-h-screen space-y-12 py-12 md:px-6 lg:px-12"
        >
            <Head title={`Dossier: ${client?.name}`} />

            {/* --- HEADER PROFILO --- */}
            <header className="relative flex flex-col gap-6 border-l-4 border-primary pl-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">
                        Subject_Profile_File
                    </div>
                    <h1 className="text-3xl font-black uppercase italic leading-none tracking-tighter md:text-4xl">
                        {client.name}
                    </h1>
                    <div className="flex flex-col text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 md:flex-row md:items-center md:gap-4">
                        <span className="flex items-center gap-1">
                            <Mail size={12} /> {client.email}
                        </span>
                        <span className="hidden h-1 w-1 rounded-full bg-border md:block" />
                        <span>
                            Member_Since_
                            {format(new Date(client.created_at), 'yyyy')}
                        </span>
                    </div>
                </div>
                <Badge className="rounded-none bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-none">
                    Verified_Client
                </Badge>
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* --- COLONNA INFO (1/3) --- */}
                <div className="space-y-8">
                    <Card className="rounded-none border-border bg-card/30 shadow-none backdrop-blur-sm">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em]">
                                <ShieldCheck
                                    size={14}
                                    className="text-primary"
                                />{' '}
                                Identity_Specs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between pt-6">
                            <div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                        Internal_ID
                                    </p>
                                    <p className="font-mono text-sm font-black">
                                        #ID_
                                        {client.id.toString().padStart(5, '0')}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                        Primary_Email
                                    </p>
                                    <p className="text-xs font-bold uppercase tracking-tight">
                                        {client.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-28 w-28 items-center justify-center border border-border bg-background transition-colors hover:border-primary/50">
                                {client.profile_photo ? (
                                    <Avatar className="h-full w-full rounded-none p-0">
                                        <AvatarImage
                                            src={
                                                client.profile_photo
                                                    ? `/storage/${client.profile_photo}`
                                                    : undefined
                                            }
                                            className="object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                    </Avatar>
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors hover:border-primary/50">
                                        <UserCircle
                                            size={18}
                                            className="text-muted-foreground/40 transition-colors hover:text-primary"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-border bg-primary/5 shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em]">
                                Engagement_Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1 border-r border-primary/10">
                                <p className="text-3xl font-black italic leading-none tracking-tighter">
                                    {client.appointments?.length || 0}
                                </p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-primary/60">
                                    Sessions
                                </p>
                            </div>
                            <div className="space-y-1 pl-2">
                                <p className="text-3xl font-black italic leading-none tracking-tighter text-destructive">
                                    {client.appointments?.filter(
                                        (a) => a.status === 'cancelled',
                                    ).length || 0}
                                </p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-destructive/60">
                                    Aborted
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 lg:col-span-2">
                    <div className="flex items-center gap-4">
                        <Activity size={16} className="text-primary" />
                        <h3 className="text-[9px] font-black uppercase tracking-[0.4em] md:text-[11px]">
                            Chronological_Activity_Log
                        </h3>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>

                    {/* --- COLONNA PAST 5 ACTIVITY (2/3) --- */}
                    <div className="flex items-center gap-4">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.4em] md:text-[11px]">
                            Last 5_Appointments
                        </h3>
                    </div>

                    <div className="space-y-1">
                        {previousAppointments?.length > 0 ? (
                            previousAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="group flex items-center justify-between border-b border-border/40 px-2 py-5 transition-colors hover:bg-muted/30"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center border-r border-border pr-6 text-center">
                                            <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground md:text-[9px]">
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'MMM',
                                                )}
                                            </span>
                                            <span className="text-[15px] font-black italic leading-none tracking-tighter md:text-xl">
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'dd',
                                                )}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 font-mono text-[11px] font-black tracking-widest md:text-sm">
                                                <Clock
                                                    size={isMobile ? 10 : 12}
                                                    className="text-primary/40"
                                                />
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'HH:mm',
                                                )}
                                            </div>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60 md:text-[9px]">
                                                Service_Execution_Ref_
                                                {appointment.id}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'rounded-none border-none text-[7px] font-black uppercase tracking-[0.2em] md:text-[9px]',
                                            appointment.status === 'confirmed'
                                                ? 'bg-primary/5 text-primary'
                                                : 'bg-destructive/5 text-destructive',
                                        )}
                                    >
                                        {appointment.status}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-40 flex-col items-center justify-center border border-dashed border-border opacity-30">
                                <AlertCircle size={24} className="mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    Zero_Records_Stored
                                </p>
                            </div>
                        )}
                    </div>

                    {/* --- COLONNA NEXT 5 ACTIVITY (2/3) --- */}
                    <div className="flex items-center gap-4">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.4em] md:text-[11px]">
                            Next 5_Appointments
                        </h3>
                    </div>

                    <div className="space-y-1">
                        {nextAppointments?.length > 0 ? (
                            nextAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="group flex items-center justify-between border-b border-border/40 px-2 py-5 transition-colors hover:bg-muted/30"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center border-r border-border pr-6 text-center">
                                            <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground md:text-[9px]">
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'MMM',
                                                )}
                                            </span>
                                            <span className="text-[15px] font-black italic leading-none tracking-tighter md:text-xl">
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'dd',
                                                )}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 font-mono text-[11px] font-black tracking-widest md:text-sm">
                                                <Clock
                                                    size={isMobile ? 10 : 12}
                                                    className="text-primary/40"
                                                />
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'HH:mm',
                                                )}
                                            </div>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60 md:text-[9px]">
                                                Service_Execution_Ref_
                                                {appointment.id}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'rounded-none border-none text-[7px] font-black uppercase tracking-[0.2em] md:text-[9px]',
                                            appointment.status === 'confirmed'
                                                ? 'bg-primary/5 text-primary'
                                                : 'bg-destructive/5 text-destructive',
                                        )}
                                    >
                                        {appointment.status}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-40 flex-col items-center justify-center border border-dashed border-border opacity-30">
                                <AlertCircle size={24} className="mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    Zero_Records_Stored
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
