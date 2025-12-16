import { Head } from '@inertiajs/react';

// Layout
import AppShell from '@/Layouts/Appshell';

// Page
import { SignupForm } from '@/components/auth/signup-form';

export default function Register() {
    return (
        <AppShell>
            <Head title="Register" />

            <SignupForm submitRoute={'register'} />
        </AppShell>
    );
}
