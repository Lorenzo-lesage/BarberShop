import { Calendar, Clock, Scissors, Store, Users } from 'lucide-react';

export const barberItems = [
    { label: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
    {
        label: 'Appointments',
        href: '/dashboard/barber-appointments',
        icon: Clock,
    },
    { label: 'My Clients', href: '/dashboard/my-clients', icon: Users },
    { label: 'Barbers', href: '/dashboard/barbers', icon: Scissors },
    { label: 'Saloons', href: '/dashboard/saloons', icon: Store },
    { label: 'Clients', href: '/dashboard/clients', icon: Users },
];
