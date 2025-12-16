import { Head } from '@inertiajs/react';

// Layout
import AppShell from '@/Layouts/Appshell';

// Page
import BarbersComponent from '@/components/publicPagesComponents/BarbersComponent';

export default function Barbers() {
    return (
        <AppShell>
            <Head title="Barbers" />
            <div className="relative flex min-h-screen flex-col items-center justify-center">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <BarbersComponent />
                </div>
            </div>
        </AppShell>
    );
}
