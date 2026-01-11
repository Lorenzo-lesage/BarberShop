'use client';

import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

// Layout e Interfaces
import { AuthProps } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Appointment } from '@/interfaces/saloon';
import Dashboard from '@/Layouts/Dashboard'; // Assicurati che il path sia corretto

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
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

interface Props {
    appointments: PaginationData<Appointment>;
    breadcrumbs: BreadcrumbItemType[];
}

const Index = ({ appointments, breadcrumbs }: Props) => {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const { auth } = usePage<AuthProps>().props;
    const isBarber = auth.user.is_barber;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="h-100 flex-column flex justify-between px-4 py-12"
        >
            <Head title="Dashboard Appointments" />

            <div className="flex flex-1 flex-col gap-4 p-4 pb-0 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isBarber ? 'Appointments Received' : 'My Appointments'}
                    </h1>
                </div>

                <Table>
                    <TableCaption>
                        Total Appointments: {appointments.total}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                #
                            </TableHead>
                            <TableHead>
                                {isBarber ? 'Client' : 'Saloon'}
                            </TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Hour</TableHead>
                            <TableHead className="hidden sm:table-cell">
                                Status
                            </TableHead>
                            <TableHead className="text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
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
                                        // Se è Barbiere, link al Profilo Cliente
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
                                        // Se è Cliente, link al Salone
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
                                    {' '}
                                    <div className="text-xs uppercase text-muted-foreground">
                                        {format(
                                            new Date(app.appointment_time),
                                            'eeee d MMMM yyyy',
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {' '}
                                    <div className="text-lg font-bold">
                                        {format(
                                            new Date(app.appointment_time),
                                            'HH:mm',
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
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
                                                        cancel the appointment
                                                        on{' '}
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
                                                        ? This action cannot be
                                                        undone.
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
                                                        prefetch
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
                                            This appointment is cancelled.
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {appointments.data.length === 0 && (
                    <div className="col-span-full py-10 text-center text-muted-foreground">
                        No appointments found.
                    </div>
                )}
            </div>
            <div>
                <MyPagination links={appointments.links} />
            </div>
        </Dashboard>
    );
};

export default Index;
