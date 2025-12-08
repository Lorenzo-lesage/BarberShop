import { PropsWithChildren } from 'react';

// Main Layout
import AppShell from '@/Layouts/Appshell';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <AppShell>
            <div className="min-h-screen">
                <div className="w-25 flex min-h-screen flex-col items-center sm:justify-center sm:pt-0">
                    <div className="w-50">{children}</div>
                </div>
            </div>
        </AppShell>
    );
}
