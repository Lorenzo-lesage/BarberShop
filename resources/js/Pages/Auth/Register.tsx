import { SignupForm } from '@/components/auth/signup-form';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Register() {
    return (
        <GuestLayout>
            <Head title="Register" />

            <SignupForm />
        </GuestLayout>
    );
}
