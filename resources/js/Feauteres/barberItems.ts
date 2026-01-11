import { Calendar, Clock, Store, Users } from 'lucide-react';

export const barberItems = [
    { label: 'My Saloon', href: '/dashboard/my-saloon', icon: Calendar },
    {
        label: 'Appointments',
        href: '/dashboard/appointments',
        icon: Clock,
    },
    { label: 'My Clients', href: '/dashboard/clients', icon: Users },
    { label: 'Saloons', href: '/dashboard/saloons', icon: Store },
];
