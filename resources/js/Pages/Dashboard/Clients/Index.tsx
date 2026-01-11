// Layout
import Dashboard from '@/Layouts/Dashboard';

// Components
import { MyPagination } from '@/components/publicPagesComponents/pagination/DataTablePagination';
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
import { User } from '@/interfaces/auth';
import type BreadcrumbItemType from '@/interfaces/breadcrumbs';
import { PaginationData } from '@/interfaces/pagination';

interface Props {
    clients: PaginationData<User>;
    breadcrumbs: BreadcrumbItemType[];
}

import { Head, Link } from '@inertiajs/react';

export default function Index({ clients, breadcrumbs }: Props) {
    return (
        <Dashboard
            breadcrumbs={breadcrumbs}
            className="h-100 flex-column flex justify-between px-4 py-12"
        >
            <Head title="Clients List" />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">My Clients</h1>
                <Table>
                    <TableCaption>Total clients: {clients.total}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">
                                Total Appointments
                            </TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.data.map((client: User) => (
                            <TableRow key={client.id}>
                                <TableCell className="font-medium">
                                    {client.name}
                                </TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell className="text-center">
                                    {client.appointments_count}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        href={route('clients.show', client.id)}
                                    >
                                        <Button variant="outline" size="sm">
                                            View Profile
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <MyPagination links={clients.links} />
            </div>
        </Dashboard>
    );
}
