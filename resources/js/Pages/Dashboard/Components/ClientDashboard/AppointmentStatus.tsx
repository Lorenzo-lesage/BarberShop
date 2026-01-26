import { Link } from '@inertiajs/react';

// Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Icons
import { ArrowUpRight, Clock, MapPin, Terminal, UserIcon } from 'lucide-react';

// Interfaces
import type { DashboardProps } from '@/interfaces/saloon';

export function AppointmentStatus({
    nextAppointment,
}: {
    nextAppointment: DashboardProps['nextAppointment'] | null;
}) {
    /*
    |---------------------------------------------------------------------------
    | Render
    |---------------------------------------------------------------------------
    */

    if (!nextAppointment) {
        return (
            <Link href={route('saloons.dashboard.index')} className="group">
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
        );
    }

    return (
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
                    photo: nextAppointment?.saloon?.main_photo?.path,
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
    );
}
