'use client';

import { Head, usePage } from '@inertiajs/react';

// Layout e Interfaces
import { AuthProps } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Appointment } from '@/interfaces/saloon';
import Dashboard from '@/Layouts/Dashboard'; // Assicurati che il path sia corretto

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
import { AppointmentTable } from './Components/AppointmentTable';

interface Props {
    appointments: PaginationData<Appointment>;
    pastAppointments: PaginationData<Appointment>;
    breadcrumbs: BreadcrumbItemType[];
}

const Index = ({ appointments, pastAppointments, breadcrumbs }: Props) => {
    const { auth } = usePage<AuthProps>().props;
    const isBarber = auth.user.is_barber;

    return (
        <Dashboard breadcrumbs={breadcrumbs} className="px-4 py-12">
            <Head title="Dashboard Appointments" />

            <div className="flex flex-col gap-12">
                {/* TABELLA FUTURI */}
                <section className="space-y-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isBarber
                            ? 'Upcoming Received'
                            : 'My Upcoming Appointments'}
                    </h1>
                    <AppointmentTable
                        appointments={appointments}
                        isBarber={isBarber}
                    />
                    <MyPagination links={appointments.links} />
                </section>

                <hr className="border-t" />

                {/* TABELLA PASSATI / SBAGLIATI */}
                <section className="space-y-4 opacity-70">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isBarber
                            ? 'Past Appointments'
                            : 'My Appointment History'}
                    </h2>
                    <AppointmentTable
                        appointments={pastAppointments}
                        isBarber={isBarber}
                        showActions={false} // Qui non mostriamo il tasto Cancel
                    />
                    <MyPagination links={pastAppointments.links} />
                </section>
            </div>
        </Dashboard>
    );
};

export default Index;
