'use client';

import { Head, Link, usePage } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Icons
import {
    Activity,
    ArrowUpRight,
    Clock,
    MapPin,
    Terminal,
    User as UserIcon,
} from 'lucide-react';

// Interfaces
import { User } from '@/interfaces/auth';
import type { DashboardProps } from '@/interfaces/saloon';

export default function DashboardClient({
    nextAppointment,
    history,
}: DashboardProps) {
    /*
    |---------------------------------------------------------------------------
    | Data
    |---------------------------------------------------------------------------
    */

    const { auth } = usePage().props;
    const user = auth.user as User;

    /*
    |---------------------------------------------------------------------------
    | Methods
    |---------------------------------------------------------------------------
    */

    const getPreferredBarber = () => {
        if (!history || history.length === 0) return 'NONE';

        // Contiamo le occorrenze di ogni barbiere
        const counts = history.reduce((acc: Record<string, number>, curr) => {
            acc[curr.barber] = (acc[curr.barber] || 0) + 1;
            return acc;
        }, {});

        // Troviamo quello con il valore più alto
        return Object.entries(counts).reduce((a, b) =>
            a[1] > b[1] ? a : b,
        )[0];
    };

    const preferredBarber = getPreferredBarber();

    /*
    |---------------------------------------------------------------------------
    | Render
    |---------------------------------------------------------------------------
    */

    return (
        <Dashboard
            breadcrumbs={[{ label: 'USER_TERMINAL', href: '/dashboard' }]}
        >
            <Head title="CLIENT_DASHBOARD" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 md:p-10">
                {/* --- HEADER SEZIONALE --- */}
                <div className="flex flex-col gap-6 border-b border-border/60 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                            <Activity size={12} /> System_Ready
                        </div>
                        <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter sm:text-6xl">
                            Welcome,{' '}
                            <span className="text-primary">
                                {auth.user.name.split(' ')[0]}
                            </span>
                        </h1>
                        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                            ID_AUTH: {auth.user.id.toString().padStart(5, '0')}{' '}
                            {'//'} Access_Level: Client
                        </p>
                    </div>
                    <Button
                        asChild
                        className="h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:skew-x-2"
                    >
                        <Link href={route('saloons.dashboard.index')}>
                            Explore_Network{' '}
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* --- CONTENT SEZIONALE --- */}
                <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-8 md:grid-cols-3">
                    {[
                        {
                            label: 'Total_Sessions',
                            value: history.length.toString().padStart(2, '0'),
                        },
                        {
                            label: 'Preferred_Operator',
                            value: preferredBarber
                                .toUpperCase()
                                .replace(' ', '_'),
                        },
                        {
                            label: 'Last_Profile_Update',
                            value: user?.updated_at
                                ? new Date(user.updated_at).toLocaleString([], {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : user?.created_at
                                  ? new Date(user.created_at).toLocaleString(
                                        [],
                                        {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        },
                                    )
                                  : '--',
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-1 text-center"
                        >
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                {stat.label}
                            </span>
                            <span className="font-mono text-xs font-bold text-foreground">
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* --- PREFERRED_NODES (Accesso Rapido ai tuoi Saloni) --- */}
                {history && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-1 w-1 animate-pulse bg-primary" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                Quick_Access_Registry
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Questa sezione filtrerebbe i saloni dalla history per mostrare i più frequentati */}
                            {history.slice(0, 3).map((item, i) => (
                                <Link
                                    key={`fav-${i}`}
                                    href={route(
                                        'saloons.dashboard.show',
                                        item.saloon.id,
                                    )}
                                    className="group relative flex items-center gap-4 border border-border/40 bg-muted/5 p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                                >
                                    <div className="h-12 w-12 shrink-0 overflow-hidden border border-border/60">
                                        <Avatar className="h-full w-full rounded-none">
                                            <AvatarImage
                                                src={`/storage/${item.saloon.main_photo?.path}`}
                                                className="object-cover grayscale transition-all group-hover:grayscale-0"
                                            />
                                            <AvatarFallback className="rounded-none text-xs font-black">
                                                {item.saloon.name.substring(
                                                    0,
                                                    2,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex flex-col overflow-hidden">
                                        <span className="truncate text-xs font-black uppercase italic tracking-tight">
                                            {item.saloon.name}
                                        </span>
                                        <span className="text-[9px] font-bold uppercase text-muted-foreground/60">
                                            {item.saloon.city}
                                        </span>
                                    </div>

                                    <ArrowUpRight
                                        size={14}
                                        className="ml-auto text-primary opacity-0 transition-all group-hover:opacity-100"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {nextAppointment ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* --- NEXT APPOINTMENT (STATUS CARD) --- */}
                        <Card className="group relative overflow-hidden rounded-none border-2 border-primary bg-primary/5">
                            <div className="absolute right-0 top-0 bg-primary px-2 py-1 text-[8px] font-black uppercase tracking-widest text-primary-foreground">
                                Live_Status
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    Scheduled_Session
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-4xl font-black uppercase italic tracking-tighter">
                                        {nextAppointment.date}
                                    </div>
                                    <div className="flex items-center gap-4 border-t border-primary/20 pt-4">
                                        <div className="flex items-center text-[11px] font-black uppercase">
                                            <Clock className="mr-2 h-3.5 w-3.5 text-primary" />
                                            {nextAppointment.time}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* --- SALOON & BARBER INFO (MERGED LOOK) --- */}
                        {[
                            {
                                title: 'Operator_Registry',
                                name: nextAppointment?.barber,
                                sub: `Salon: ${nextAppointment?.saloon?.name}`,
                                icon: UserIcon,
                                photo: nextAppointment?.barber_photo,
                            },
                            {
                                title: 'Location_Terminal',
                                name: nextAppointment?.saloon?.name,
                                sub: `${nextAppointment?.saloon?.city}, ${nextAppointment?.saloon?.province}`,
                                icon: MapPin,
                                photo: nextAppointment?.saloon?.main_photo
                                    ?.path,
                            },
                        ].map((info, i) => (
                            <Card
                                key={i}
                                className="group rounded-none border-border/40 bg-muted/5 transition-colors hover:border-primary/40"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        {info.title}
                                    </CardTitle>
                                    <info.icon className="h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <div className="text-xl font-black uppercase italic tracking-tight">
                                                {info.name || 'N/A'}
                                            </div>
                                            <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground opacity-60">
                                                {info.sub}
                                            </div>
                                        </div>
                                        <div className="h-20 w-20 overflow-hidden">
                                            <Avatar className="h-full w-full rounded-none">
                                                <AvatarImage
                                                    src={
                                                        info.photo
                                                            ? `/storage/${info.photo}`
                                                            : undefined
                                                    }
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <AvatarFallback className="rounded-none bg-background text-2xl font-black">
                                                    {info.name
                                                        ? info.name
                                                              .substring(0, 2)
                                                              .toUpperCase()
                                                        : 'N/A'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Link
                        href={route('saloons.dashboard.index')}
                        className="group"
                    >
                        <Card className="relative h-full overflow-hidden rounded-none border-2 border-dashed border-muted-foreground/30 bg-transparent transition-all group-hover:border-primary group-hover:bg-primary/5">
                            <div className="absolute right-0 top-0 bg-muted-foreground/20 px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                                Idle_Status
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary">
                                    System_Ready
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="text-2xl font-black uppercase italic leading-none tracking-tighter text-muted-foreground/60 group-hover:text-foreground">
                                    No_Active_Session
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                    Find_Saloon{' '}
                                    <ArrowUpRight
                                        size={14}
                                        className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                                    />
                                </div>
                            </CardContent>

                            <Terminal
                                size={60}
                                className="absolute -bottom-4 -right-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]"
                            />
                        </Card>
                    </Link>
                )}

                {/* --- RECENT HISTORY (LOG STYLE) --- */}
                <Card className="rounded-none border-border/40 shadow-none">
                    <CardHeader className="border-b border-border/40 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">
                                    Session_Logs (last_5)
                                </CardTitle>
                                <CardDescription className="mt-1 text-[9px] uppercase tracking-wider">
                                    Registry_Depth: {history.length}_Items
                                </CardDescription>
                            </div>
                            <Terminal
                                size={16}
                                className="text-muted-foreground/30"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/40">
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex flex-col justify-between p-4 transition-colors hover:bg-muted/30 md:flex-row md:items-center"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="hidden font-mono text-[10px] italic text-muted-foreground/40 md:block">
                                                #
                                                {item.id
                                                    .toString()
                                                    .padStart(4, '0')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-widest transition-colors group-hover:text-primary">
                                                    {item.saloon.name}
                                                </span>
                                                <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground opacity-50">
                                                    Op: {item.barber} {'//'}{' '}
                                                    {item.saloon.city}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-8 md:mt-0 md:justify-end">
                                            <div className="text-right">
                                                <div className="text-[11px] font-black uppercase tracking-tighter">
                                                    {item.date}
                                                </div>
                                                <div className="font-mono text-[9px] opacity-40">
                                                    {item.time}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="h-8 rounded-none border-border/60 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
                                            >
                                                <Link
                                                    href={route(
                                                        'saloons.dashboard.show',
                                                        item.saloon.id,
                                                    )}
                                                >
                                                    Repeat_Order
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[10px] font-bold uppercase italic tracking-[0.3em] text-muted-foreground/30">
                                    No_History_Found_In_Local_Buffer
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Dashboard>
    );
}
