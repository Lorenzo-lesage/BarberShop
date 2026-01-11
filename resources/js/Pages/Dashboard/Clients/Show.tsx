import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { useMemo } from 'react';

// Components
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Interfaces
import { User } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';

interface Props {
    client: User;
    breadcrumbs: BreadcrumbItemType[];
}

export default function Show({ client, breadcrumbs }: Props) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const previousAppointments = useMemo(() => {
        if (!client.appointments) return [];

        return client.appointments.filter(
            (a) => new Date(a.appointment_time) < new Date(),
        );
    }, [client.appointments]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Dashboard breadcrumbs={breadcrumbs}>
            <Head title={`Client: ${client?.name}`} />

            <div className="space-y-6 p-6">
                {/* Header Profilo */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {client.name}
                        </h1>
                        <p className="text-muted-foreground">{client.email}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        Client since{' '}
                        {format(new Date(client.created_at), 'MMMM yyyy')}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Card Informazioni */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Email:
                                </span>
                                <span className="font-medium">
                                    {client.email}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    User ID:
                                </span>
                                <span className="font-mono text-xs">
                                    #{client.id}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card Statistiche Rapide */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="border-r">
                                <p className="text-2xl font-bold">
                                    {client.appointments?.length || 0}
                                </p>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Total Visits
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-destructive">
                                    {client.appointments?.filter(
                                        (a) => a.status === 'cancelled',
                                    ).length || 0}
                                </p>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Cancellations
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sezione Note o Storico (Se vuoi implementarla dopo) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {previousAppointments?.length > 0 ? (
                            <>
                                {previousAppointments?.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="border-b py-2 last:border-0"
                                    >
                                        <p>
                                            - Date:{' '}
                                            <span className="font-medium">
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'dd/MM/yyyy',
                                                )}{' '}
                                            </span>
                                            <span>
                                                at{' '}
                                                {format(
                                                    new Date(
                                                        appointment.appointment_time,
                                                    ),
                                                    'HH:mm',
                                                )}
                                            </span>
                                        </p>
                                        <p>
                                            - Status:{' '}
                                            <span className="font-medium">
                                                {appointment.status}
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No past activity recorded.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Dashboard>
    );
}
