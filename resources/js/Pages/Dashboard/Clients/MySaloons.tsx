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

// Icons
import { Store } from 'lucide-react';

// Interfaces
import BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Saloon } from '@/interfaces/saloon';

// Icons
import { ArrowRight, Bookmark, User, Zap } from 'lucide-react';

interface Props {
    saloons: PaginationData<Saloon & { appointments_count: number }>;
    breadcrumbs: BreadcrumbItemType[];
}

export default function MySaloons({ saloons, breadcrumbs }: Props) {
    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="min-h-screen space-y-12 py-12 md:px-6 lg:px-12"
        >
            <Head title="Visited Saloons" />

            {/* --- HEADER TECNICO --- */}
            <header className="relative flex flex-col gap-4 border-l-4 border-primary pl-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">
                        Client_Network
                    </div>
                    <h1 className="text-3xl font-black uppercase italic leading-none tracking-tighter text-foreground md:text-4xl">
                        My_Saloons
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        History of affiliated shops and barber stations.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    <Bookmark size={14} className="text-primary" />
                    Total_Visited:{' '}
                    <span className="text-foreground">{saloons.total}</span>
                </div>
            </header>

            {/* --- CONTENITORE REGISTRO --- */}
            <div className="space-y-8">
                <div className="relative overflow-hidden border border-border bg-card/30 backdrop-blur-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="h-12 text-[9px] font-black uppercase tracking-widest">
                                    Shop_Entity
                                </TableHead>
                                <TableHead className="hidden h-12 text-[9px] font-black uppercase tracking-widest md:table-cell">
                                    Lead_Barber
                                </TableHead>
                                <TableHead className="h-12 text-center text-[9px] font-black uppercase tracking-widest">
                                    Engagement
                                </TableHead>
                                <TableHead className="h-12 text-right text-[9px] font-black uppercase tracking-widest">
                                    Operations
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {saloons.data.length > 0 ? (
                                saloons.data.map((saloon) => (
                                    <TableRow
                                        key={saloon.id}
                                        className="group border-b border-border/50 transition-colors hover:bg-muted/30"
                                    >
                                        {/* Shop Info */}
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary/50">
                                                    {saloon.main_photo ? (
                                                        <Avatar className="h-full w-full rounded-none">
                                                            <AvatarImage
                                                                src={
                                                                    saloon.main_photo
                                                                        ? `/storage/${saloon.main_photo.path}`
                                                                        : undefined
                                                                }
                                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        </Avatar>
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary/50">
                                                            <Store
                                                                size={18}
                                                                className="text-muted-foreground/40 transition-colors group-hover:text-primary"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase tracking-tighter">
                                                        {saloon.name}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 md:hidden">
                                                        <User size={10} />{' '}
                                                        {saloon.barber?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Barber Info (Desktop) */}
                                        <TableCell className="hidden py-6 md:table-cell">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                <User
                                                    size={12}
                                                    className="opacity-40"
                                                />
                                                {saloon.barber?.name}
                                            </div>
                                        </TableCell>

                                        {/* Engagement Stats */}
                                        <TableCell className="py-6 text-center">
                                            <div className="inline-flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Zap
                                                        size={14}
                                                        className="text-primary/60"
                                                    />
                                                    <span className="font-mono text-lg font-black tracking-tighter">
                                                        {
                                                            saloon.appointments_count
                                                        }
                                                    </span>
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-[0.1em] text-muted-foreground/40">
                                                    Visits_Log
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="py-6 text-right">
                                            <Link
                                                href={route(
                                                    'saloons.dashboard.show',
                                                    saloon.id,
                                                )}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 rounded-none border border-border px-4 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
                                                >
                                                    Access_Shop
                                                    <ArrowRight
                                                        size={12}
                                                        className="ml-2"
                                                    />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-48 text-center"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
                                            No affiliation records found in
                                            database.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-center">
                    <MyPagination links={saloons.links} />
                </div>
            </div>
        </Dashboard>
    );
}
