'use client';

import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Layout e Interfaces
import { AuthProps } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Appointment } from '@/interfaces/saloon';
import Dashboard from '@/Layouts/Dashboard'; // Assicurati che il path sia corretto

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentTable } from './Components/AppointmentTable';

interface Props {
    appointments: PaginationData<Appointment>;
    pastAppointments: PaginationData<Appointment>;
    breadcrumbs: BreadcrumbItemType[];
}

const Index = ({ appointments, pastAppointments, breadcrumbs }: Props) => {
    /*
    | -------------------------------------------------
    | Data
    | -------------------------------------------------
    */

    const { auth } = usePage<AuthProps>().props;
    const isBarber = auth.user.is_barber;
    const [tabValue, setTabValue] = useState('upcoming');

    /*
    | -------------------------------------------------
    | Render
    | -------------------------------------------------
    */

    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="min-h-[100vh-80px] justify-between px-4 py-12"
        >
            <Head title="Dashboard Appointments" />

            <Tabs defaultValue="upcoming" className="w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isBarber ? 'Manage Appointments' : 'My Appointments'}
                    </h1>
                    <TabsList>
                        <TabsTrigger
                            value="upcoming"
                            onClick={() => setTabValue('upcoming')}
                        >
                            Upcoming
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            onClick={() => setTabValue('past')}
                        >
                            History
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="upcoming" className="space-y-4">
                    <AppointmentTable
                        appointments={appointments}
                        isBarber={isBarber}
                    />

                    {appointments.data.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">
                            No upcoming appointments found.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    <AppointmentTable
                        appointments={pastAppointments}
                        isBarber={isBarber}
                        showActions={false}
                    />

                    {pastAppointments.data.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground">
                            No past appointments found.
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {tabValue === 'upcoming' && (
                <div className="flex w-full justify-center">
                    <MyPagination links={appointments.links} />
                </div>
            )}

            {tabValue === 'past' && (
                <div className="flex w-full justify-center">
                    <MyPagination links={pastAppointments.links} />
                </div>
            )}
        </Dashboard>
    );
};

export default Index;
