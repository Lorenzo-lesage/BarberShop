import { SignupForm } from '@/components/auth/signup-form';
import GuestLayout from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function BecomeBarberPage({
    isBarber = true,
    submitRoute = 'become.barber.register',
}: PageProps<{ isBarber?: boolean; submitRoute?: string }>) {
    return (
        <GuestLayout>
            <Head title="Become a Barber" />
            <SignupForm isBarber={isBarber} submitRoute={submitRoute} />
        </GuestLayout>
    );
}
