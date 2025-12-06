import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
// Components
import { LoginForm } from '@/components/login-form';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    return (
        <GuestLayout>
            <Head title="Log in" />

            <LoginForm className="mb-8" canResetPassword={canResetPassword} />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </GuestLayout>
    );
}
