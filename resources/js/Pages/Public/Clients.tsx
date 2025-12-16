import { Head } from '@inertiajs/react';

// Lyout
import AppShell from '@/Layouts/Appshell';

// Page
import ClientsComponent from '@/components/publicPagesComponents/ClientsComponent';

export default function Clients() {
    return (
        <AppShell>
            <Head title="Clients" />
            <div className="relative flex min-h-screen flex-col items-center justify-center">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <ClientsComponent />
                </div>
            </div>
        </AppShell>
    );
}
