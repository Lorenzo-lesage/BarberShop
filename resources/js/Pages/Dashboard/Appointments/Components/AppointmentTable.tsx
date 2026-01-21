'use client';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Interfaces
import { PaginationData } from '@/interfaces/pagination';
import { Appointment } from '@/interfaces/saloon';

// Utils
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Icons
import { Calendar, Clock, Store, User, XCircle } from 'lucide-react';

interface AppointmentTableProps {
    appointments: PaginationData<Appointment>;
    isBarber: boolean;
    showActions?: boolean;
}

export const AppointmentTable = ({
    appointments,
    isBarber,
    showActions = true,
}: AppointmentTableProps) => {
    return (
        <Table className="border-collapse">
            <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                    <TableHead className="hidden h-12 w-[80px] text-[9px] font-black uppercase tracking-widest sm:table-cell">
                        Ref_ID
                    </TableHead>
                    <TableHead className="h-12 text-[9px] font-black uppercase tracking-widest">
                        {isBarber ? 'Entity_Client' : 'Entity_Saloon'}
                    </TableHead>
                    <TableHead className="h-12 text-[9px] font-black uppercase tracking-widest">
                        Schedule_Data
                    </TableHead>
                    <TableHead className="h-12 text-[9px] font-black uppercase tracking-widest">
                        Status
                    </TableHead>
                    {showActions && (
                        <TableHead className="h-12 text-center text-[9px] font-black uppercase tracking-widest">
                            Management
                        </TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.data.map((app, key) => (
                    <TableRow
                        key={app.id}
                        className="group border-b border-border/50 hover:bg-muted/30"
                    >
                        {/* REF ID */}
                        <TableCell className="hidden py-6 sm:table-cell">
                            <span className="font-mono text-[10px] text-muted-foreground/50">
                                #
                                {(appointments.current_page - 1) *
                                    appointments.per_page +
                                    (key + 1)}
                            </span>
                        </TableCell>

                        {/* CLIENT / SALOON */}
                        <TableCell className="py-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center border border-border bg-background">
                                    {isBarber ? (
                                        <User size={14} />
                                    ) : (
                                        <Store size={14} />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <Link
                                        href={
                                            isBarber
                                                ? route(
                                                      'clients.show',
                                                      app.client?.id,
                                                  )
                                                : route(
                                                      'saloons.show',
                                                      app.saloon?.id,
                                                  )
                                        }
                                        className="text-xs font-black uppercase tracking-tighter transition-colors hover:text-primary"
                                    >
                                        {isBarber
                                            ? app.client?.name
                                            : app.saloon?.name}
                                    </Link>
                                    <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                                        {isBarber
                                            ? app.client?.email
                                            : 'Verified_Registry'}
                                    </p>
                                </div>
                            </div>
                        </TableCell>

                        {/* DATE & TIME */}
                        <TableCell className="py-6">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight">
                                    <Calendar
                                        size={12}
                                        className="text-primary"
                                    />
                                    {format(
                                        new Date(app.appointment_time),
                                        'dd MMM yyyy',
                                        { locale: it },
                                    )}
                                </div>
                                <div className="flex items-center gap-2 font-mono text-lg font-black leading-none tracking-tighter">
                                    <Clock
                                        size={14}
                                        className="text-muted-foreground/30"
                                    />
                                    {format(
                                        new Date(app.appointment_time),
                                        'HH:mm',
                                    )}
                                </div>
                            </div>
                        </TableCell>

                        {/* STATUS BADGE */}
                        <TableCell className="py-6">
                            <Badge
                                className={cn(
                                    'rounded-none border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-none',
                                    app.status === 'confirmed'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-muted-foreground/60',
                                )}
                            >
                                {app.status}
                            </Badge>
                        </TableCell>

                        {/* ACTIONS */}
                        {showActions && (
                            <TableCell className="py-6 text-center">
                                {app.status === 'confirmed' ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 rounded-none border border-border px-3 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-destructive hover:text-destructive-foreground"
                                            >
                                                Abort
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-none border-destructive/50 bg-background">
                                            <DialogHeader className="space-y-4">
                                                <div className="flex h-12 w-12 items-center justify-center border border-destructive/30 bg-destructive/5 text-destructive">
                                                    <XCircle size={24} />
                                                </div>
                                                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
                                                    Abort_Appointment
                                                </DialogTitle>
                                                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest">
                                                    Confirm cancellation for
                                                    slot{' '}
                                                    <span className="text-foreground">
                                                        {format(
                                                            new Date(
                                                                app.appointment_time,
                                                            ),
                                                            'HH:mm',
                                                        )}
                                                    </span>{' '}
                                                    on{' '}
                                                    <span className="text-foreground">
                                                        {format(
                                                            new Date(
                                                                app.appointment_time,
                                                            ),
                                                            'dd/MM',
                                                        )}
                                                    </span>
                                                    . This action is
                                                    irreversible.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="mt-6 gap-2">
                                                <DialogClose asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="rounded-none text-[10px] font-bold uppercase tracking-widest"
                                                    >
                                                        Back
                                                    </Button>
                                                </DialogClose>
                                                <Link
                                                    href={route(
                                                        'appointments.destroy',
                                                        app.id,
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    preserveScroll
                                                    className="w-full sm:w-auto"
                                                >
                                                    <Button
                                                        variant="destructive"
                                                        className="w-full rounded-none text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        Confirm_Abort
                                                    </Button>
                                                </Link>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <span className="text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/30">
                                        Terminated
                                    </span>
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
