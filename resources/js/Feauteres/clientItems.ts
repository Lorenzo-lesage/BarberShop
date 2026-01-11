import { Clock, Store } from 'lucide-react';

export const clientItems = [
    {
        label: 'My Appointments',
        href: '/dashboard/appointments',
        icon: Clock,
    },

    //  { label: 'Barbers', href: '/dashboard/barbers', icon: Scissors }, // Per visualizzare i Barbieri
    { label: 'Saloons', href: '/dashboard/saloons', icon: Store }, // Per visualizzare i Saloni
    { label: 'My Saloons', href: '/dashboard/my-saloons', icon: Store },
];
