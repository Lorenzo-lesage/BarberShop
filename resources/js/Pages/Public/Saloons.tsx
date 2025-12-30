import { Head } from '@inertiajs/react';

// Layout
import AppShell from '@/Layouts/Appshell';

// Page
import SaloonsComponent from '@/components/publicPagesComponents/saloon/SaloonsComponents';

export default function Saloons() {
    return (
        <AppShell>
            <Head title="Saloons" />
            <div className="relative flex min-h-screen flex-col items-center justify-center">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <SaloonsComponent />
                </div>
            </div>
        </AppShell>
    );
}
