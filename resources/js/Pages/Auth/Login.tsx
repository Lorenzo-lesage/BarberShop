import { Head } from '@inertiajs/react';

// Layout
import AppShell from '@/Layouts/Appshell';

// Page
import { LoginForm } from '@/components/auth/login-form';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    return (
        <AppShell>
            <Head title="Log in" />

            <LoginForm className="mb-8" canResetPassword={canResetPassword} />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AppShell>
    );
}
