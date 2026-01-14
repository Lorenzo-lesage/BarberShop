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
    TableCaption,
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

interface AppointmentTableProps {
    appointments: PaginationData<Appointment>;
    isBarber: boolean;
    showActions?: boolean; // Per nascondere i tasti nella tabella "Past"
}

export const AppointmentTable = ({
    appointments,
    isBarber,
    showActions = true,
}: AppointmentTableProps) => {
    return (
        <Table>
            <TableCaption>
                {appointments.total} appointment
                {appointments.total !== 1 ? 's' : ''} found.
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        #
                    </TableHead>
                    <TableHead>{isBarber ? 'Client' : 'Saloon'}</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Hour</TableHead>
                    <TableHead
                        className={cn(
                            'hidden sm:table-cell',
                            !showActions && 'text-end',
                        )}
                    >
                        Status
                    </TableHead>
                    {showActions && (
                        <TableHead className="text-center">Actions</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            Table
            <TableBody>
                {appointments.data.map((app, key) => (
                    <TableRow key={app.id}>
                        <TableCell className="hidden font-medium sm:table-cell">
                            {(appointments.current_page - 1) *
                                appointments.per_page +
                                (key + 1)}
                        </TableCell>
                        <TableCell>
                            {isBarber ? (
                                <div className="flex flex-col">
                                    <Link
                                        href={route(
                                            'clients.show',
                                            app.client?.id,
                                        )}
                                        className="font-bold text-primary hover:underline"
                                    >
                                        {app.client?.name}
                                    </Link>
                                    <p className="truncate text-[10px] text-muted-foreground">
                                        {app.client?.email}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <Link
                                        href={route(
                                            'saloons.show',
                                            app.saloon?.id,
                                        )}
                                        className="font-bold text-primary hover:underline"
                                    >
                                        <Badge variant="outline">
                                            {app.saloon?.name}
                                        </Badge>
                                    </Link>
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            <div className="text-xs uppercase text-muted-foreground">
                                {format(
                                    new Date(app.appointment_time),
                                    'eeee d MMMM yyyy',
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="text-lg font-bold">
                                {format(
                                    new Date(app.appointment_time),
                                    'HH:mm',
                                )}
                            </div>
                        </TableCell>
                        <TableCell
                            className={cn(
                                'hidden sm:table-cell',
                                !showActions && 'text-end',
                            )}
                        >
                            <Badge
                                variant={
                                    app.status === 'confirmed'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {app.status}
                            </Badge>
                        </TableCell>

                        {showActions && (
                            <TableCell className="text-center">
                                {app.status === 'confirmed' ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Cancel Appointment
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to
                                                    cancel the appointment on{' '}
                                                    <strong>
                                                        {format(
                                                            new Date(
                                                                app.appointment_time,
                                                            ),
                                                            'dd/MM',
                                                        )}
                                                    </strong>{' '}
                                                    at{' '}
                                                    <strong>
                                                        {format(
                                                            new Date(
                                                                app.appointment_time,
                                                            ),
                                                            'HH:mm',
                                                        )}
                                                    </strong>
                                                    ?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">
                                                        Indietro
                                                    </Button>
                                                </DialogClose>
                                                <Link
                                                    href={route(
                                                        'appointments.destroy',
                                                        app.id,
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    preserveScroll={true}
                                                >
                                                    <Button variant="destructive">
                                                        Yes, Cancel
                                                    </Button>
                                                </Link>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <span className="text-xs italic text-muted-foreground">
                                        Cancelled
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
