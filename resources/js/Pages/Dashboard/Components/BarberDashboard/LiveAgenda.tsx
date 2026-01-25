import { cn } from '@/lib/utils';

// Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AppointmentCountdown } from './AppointmentCountdown';

// Icons

// Interfaces
interface Appointment {
    time: string;
    client: string;
    client_id: number;
    photo?: string;
    status: string;
}

interface LiveAgendaProps {
    appointments: Appointment[];
}

export function LiveAgenda({ appointments }: LiveAgendaProps) {
    /*
    |----------------------------------------------------------------------------
    | Methods
    |----------------------------------------------------------------------------
    */

    /**
     *  Check if an appointment time is in the past
     * @param timeStr
     * @returns
     */
    const checkIfPast = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        const aptTime = new Date();
        aptTime.setHours(hours, minutes, 0);
        return aptTime < now;
    };

    const nextAppointmentIdx = appointments.findIndex(
        (apt) => !checkIfPast(apt.time),
    );

    /*
    |----------------------------------------------------------------------------
    | Render
    |----------------------------------------------------------------------------
    */

    return (
        <div className="p-0 md:col-span-8">
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/5 p-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Live_Agenda_Stream
                </h2>
                <Badge className="rounded-none border-primary/20 bg-primary/10 font-mono text-[9px] text-primary">
                    {appointments.length}_NODES
                </Badge>
            </div>
            <div className="divide-y divide-border/40">
                {appointments.length > 0 ? (
                    appointments.map((apt, idx) => {
                        const isPast = checkIfPast(apt.time);
                        const isNext = idx === nextAppointmentIdx;

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    'group flex items-center gap-6 p-6 transition-all',
                                    isPast
                                        ? 'opacity-30 grayscale'
                                        : 'hover:bg-muted/10',
                                    isNext && 'bg-primary/[0.02]', // Un tocco di luce per il prossimo
                                )}
                            >
                                <div className="w-16 font-mono text-xs font-black italic text-primary">
                                    {apt.time}
                                </div>

                                <div className="flex flex-1 items-center gap-4">
                                    <Avatar className="h-8 w-8 rounded-none border border-border/60">
                                        <AvatarImage
                                            src={
                                                apt.photo
                                                    ? `/storage/${apt.photo}`
                                                    : undefined
                                            }
                                            alt={apt.client}
                                        />
                                        <AvatarFallback className="rounded-none bg-primary/5 text-[10px] font-black">
                                            {apt.client
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-black uppercase tracking-widest transition-colors group-hover:text-primary">
                                                {apt.client}
                                            </div>

                                            {/* --- IL COUNTDOWN --- */}
                                            {isNext && (
                                                <AppointmentCountdown
                                                    targetTime={apt.time}
                                                />
                                            )}
                                        </div>
                                        <div className="text-[8px] font-bold uppercase italic tracking-[0.2em] text-muted-foreground/40">
                                            ID: #
                                            {apt.client_id
                                                .toString()
                                                .padStart(4, '0')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div
                                        className={cn(
                                            'h-1.5 w-1.5 rounded-full',
                                            isPast
                                                ? 'bg-muted-foreground'
                                                : 'animate-pulse bg-primary',
                                        )}
                                    />
                                    {/* ... Tooltip e Button uguale ... */}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-10 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
                        No_Appointments_Today
                    </div>
                )}
            </div>
        </div>
    );
}
