'use client';

import Dashboard from '@/Layouts/Dashboard';
import { Head, Link } from '@inertiajs/react';

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';
import { Saloon } from '@/interfaces/saloon';

interface Props {
    saloons: PaginationData<Saloon & { appointments_count: number }>;
    breadcrumbs: BreadcrumbItemType[];
}

export default function MySaloons({ saloons, breadcrumbs }: Props) {
    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="h-100 flex-column flex justify-between px-4 py-12"
        >
            <Head title="My Saloons" />

            <div className="flex flex-1 flex-col gap-4 p-4 pb-0 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        My Saloons
                    </h1>
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableCaption>
                            You have visited {saloons.total} different saloons.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Saloon</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Barber
                                </TableHead>
                                <TableHead className="text-center">
                                    Total Visits
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {saloons.data.length > 0 ? (
                                saloons.data.map((saloon) => (
                                    <TableRow key={saloon.id}>
                                        <TableCell>
                                            <div className="font-bold">
                                                {saloon.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground md:hidden">
                                                By {saloon.barber?.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {saloon.barber?.name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">
                                                {saloon.appointments_count}{' '}
                                                visits
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={route(
                                                    'saloons.show',
                                                    saloon.id,
                                                )}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    View & Book
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center"
                                    >
                                        No saloons visited yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4">
                    <MyPagination links={saloons.links} />
                </div>
            </div>
        </Dashboard>
    );
}
