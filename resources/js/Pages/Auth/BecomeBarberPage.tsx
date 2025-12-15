import { SignupForm } from '@/components/auth/signup-form';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function BecomeBarberPage() {
    return (
        <GuestLayout>
            <Head title="Become a Barber" />
            <SignupForm submitRoute={'become.barber.register'} isBarber />
        </GuestLayout>
    );
}
