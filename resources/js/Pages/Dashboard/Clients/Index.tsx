'use client';

import { Head, Link } from '@inertiajs/react';

// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Interfaces
import { User } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';

// Icons
import { ArrowUpRight, CalendarCheck, Mail, UserCircle } from 'lucide-react';

interface Props {
    clients: PaginationData<User>;
    breadcrumbs: BreadcrumbItemType[];
}

export default function Index({ clients, breadcrumbs }: Props) {
    console.log(clients);
    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="min-h-screen space-y-12 px-6 py-12 lg:px-12"
        >
            <Head title="Client Registry" />

            {/* --- HEADER TECNICO --- */}
            <header className="relative flex flex-col gap-4 border-l-4 border-primary pl-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">
                        Customer_Database
                    </div>
                    <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter text-foreground">
                        Client_Registry
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                            Total_Records
                        </p>
                        <p className="text-xl font-black italic tracking-tighter">
                            {clients.total}
                        </p>
                    </div>
                </div>
            </header>

            {/* --- TABELLA REGISTRO --- */}
            <div className="space-y-8">
                <div className="relative overflow-hidden border border-border bg-card/30 backdrop-blur-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="h-12 text-[9px] font-black uppercase tracking-widest">
                                    Identity_Subject
                                </TableHead>
                                <TableHead className="h-12 text-[9px] font-black uppercase tracking-widest">
                                    Contact_Details
                                </TableHead>
                                <TableHead className="h-12 text-center text-[9px] font-black uppercase tracking-widest">
                                    Appointment_Frequency
                                </TableHead>
                                <TableHead className="h-12 text-right text-[9px] font-black uppercase tracking-widest">
                                    Access_Profile
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.data.map((client: User) => (
                                <TableRow
                                    key={client.id}
                                    className="group border-b border-border/50 transition-colors hover:bg-muted/30"
                                >
                                    {/* Name & Avatar Icon */}
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary/50">
                                                {client.profile_photo ? (
                                                    <Avatar className="h-full w-full rounded-none">
                                                        <AvatarImage
                                                            src={
                                                                client.profile_photo
                                                                    ? `/storage/${client.profile_photo}`
                                                                    : undefined
                                                            }
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </Avatar>
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary/50">
                                                        <UserCircle
                                                            size={18}
                                                            className="text-muted-foreground/40 transition-colors group-hover:text-primary"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-tighter">
                                                    {client.name}
                                                </span>
                                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">
                                                    ID_
                                                    {client.id
                                                        .toString()
                                                        .padStart(4, '0')}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            <Mail
                                                size={12}
                                                className="opacity-40"
                                            />
                                            {client.email}
                                        </div>
                                    </TableCell>

                                    {/* Stats */}
                                    <TableCell className="py-6 text-center">
                                        <div className="inline-flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-2">
                                                <CalendarCheck
                                                    size={14}
                                                    className="text-primary/60"
                                                />
                                                <span className="font-mono text-lg font-black tracking-tighter">
                                                    {client.appointments_count}
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-muted-foreground/40">
                                                Entries_Log
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="py-6 text-right">
                                        <Link
                                            href={route(
                                                'clients.show',
                                                client.id,
                                            )}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 rounded-none border border-border px-4 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
                                            >
                                                Open_File
                                                <ArrowUpRight
                                                    size={12}
                                                    className="ml-2 opacity-50"
                                                />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* --- PAGINATION --- */}
                <div className="flex justify-center">
                    <MyPagination links={clients.links} />
                </div>
            </div>
        </Dashboard>
    );
}
