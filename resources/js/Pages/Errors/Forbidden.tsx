import { Head, Link } from '@inertiajs/react';

// Layout
import AppShell from '@/Layouts/Appshell';

export default function Forbidden() {
    return (
        <AppShell>
            <Head title="403 – Access denied" />

            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h1 className="text-6xl font-bold text-red-500">403</h1>

                <p className="mt-4 text-xl font-semibold">Access denied</p>

                <p className="mt-2 max-w-md text-muted-foreground">
                    You don’t have permission to access this page.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                    Back to Homepage
                </Link>
            </div>
        </AppShell>
    );
}
