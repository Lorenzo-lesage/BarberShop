import { CalendarCheck, CalendarPlus, Scissors, Store } from 'lucide-react';

export const clientItems = [
    {
        label: 'My Reservations',
        href: '/dashboard/my-reservations',
        icon: CalendarCheck,
    }, // Per visualizzare le prenotazioni esistenti
    {
        label: 'Book appointment',
        href: '/dashboard/book',
        icon: CalendarPlus,
    }, // Per crearne una nuova
    { label: 'My Barbers', href: '/dashboard/my-barbers', icon: Scissors },
    { label: 'Barbers', href: '/dashboard/barbers', icon: Scissors }, // Per visualizzare i Barbieri
    { label: 'Saloons', href: '/dashboard/saloons', icon: Store }, // Per visualizzare i Saloni
    {
        label: 'Clients',
        href: '/dashboard/clients',
        icon: CalendarPlus,
    },
];
