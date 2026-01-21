'use client';

import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Layout e Interfaces
import { AuthProps } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Appointment } from '@/interfaces/saloon';
import Dashboard from '@/Layouts/Dashboard';

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentTable } from './Components/AppointmentTable';

// Icons
import { CalendarDays, History, LayoutDashboard } from 'lucide-react';

interface Props {
    appointments: PaginationData<Appointment>;
    pastAppointments: PaginationData<Appointment>;
    breadcrumbs: BreadcrumbItemType[];
}

const Index = ({ appointments, pastAppointments, breadcrumbs }: Props) => {
    /*
    |-----------------------------------------------------------------------
    | Data
    |-----------------------------------------------------------------------
    */

    const { auth } = usePage<AuthProps>().props;
    const isBarber = auth.user.is_barber;
    const [tabValue, setTabValue] = useState('upcoming');

    /*
    |-----------------------------------------------------------------------
    | Render
    |-----------------------------------------------------------------------
    */

    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="min-h-screen space-y-12 px-6 py-12 lg:px-12"
        >
            <Head title="Appointments Registry" />

            {/* --- HEADER TECNICO --- */}
            <header className="relative flex flex-col gap-4 border-l-4 border-primary pl-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">
                        Operational_Dashboard
                    </div>
                    <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter text-foreground">
                        {isBarber ? 'Appointment_Log' : 'My_Schedule'}
                    </h1>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    <LayoutDashboard size={14} />
                    Status: <span className="text-primary">System_Online</span>
                </div>
            </header>

            <Tabs
                defaultValue="upcoming"
                value={tabValue}
                onValueChange={setTabValue}
                className="w-full space-y-8"
            >
                <div className="flex flex-col gap-6 border-b border-border pb-2 md:flex-row md:items-center md:justify-between">
                    <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0 md:w-auto">
                        <TabsTrigger
                            value="upcoming"
                            className="relative rounded-none border-b-2 border-transparent bg-transparent px-6 pb-4 pt-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                        >
                            <CalendarDays size={14} className="mr-2" />
                            Active_Queue
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            className="relative rounded-none border-b-2 border-transparent bg-transparent px-6 pb-4 pt-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                        >
                            <History size={14} className="mr-2" />
                            Archive_History
                        </TabsTrigger>
                    </TabsList>

                    {/* Quick Stats (Esempio per dare più corpo alla dashboard) */}
                    <div className="flex gap-8 text-right">
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                Total_Entries
                            </p>
                            <p className="text-xl font-black italic tracking-tighter">
                                {tabValue === 'upcoming'
                                    ? appointments.data.length
                                    : pastAppointments.data.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- TAB CONTENT: ACTIVE QUEUE --- */}
                <TabsContent
                    value="upcoming"
                    className="m-0 space-y-10 outline-none"
                >
                    <div className="relative border border-border bg-card/30 backdrop-blur-sm">
                        <AppointmentTable
                            appointments={appointments}
                            isBarber={isBarber}
                        />

                        {appointments.data.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-dashed border-border opacity-20">
                                    <CalendarDays size={24} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                    No entries found in active queue
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <MyPagination links={appointments.links} />
                    </div>
                </TabsContent>

                {/* --- TAB CONTENT: ARCHIVE --- */}
                <TabsContent
                    value="past"
                    className="m-0 space-y-10 outline-none"
                >
                    <div className="relative border border-border bg-card/30 backdrop-blur-sm">
                        <AppointmentTable
                            appointments={pastAppointments}
                            isBarber={isBarber}
                            showActions={false}
                        />

                        {pastAppointments.data.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-dashed border-border opacity-20">
                                    <History size={24} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                    No records found in system archive
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <MyPagination links={pastAppointments.links} />
                    </div>
                </TabsContent>
            </Tabs>
        </Dashboard>
    );
};

export default Index;
