import { CalendarCheck, CalendarPlus, Scissors, Store } from 'lucide-react';

export const clientItems = [
    { label: 'My Bookings', href: '/dashboard/bookings', icon: CalendarCheck }, // Per visualizzare le prenotazioni esistenti
    {
        label: 'Book appointment',
        href: '/dashboard/appointments',
        icon: CalendarPlus,
    }, // Per crearne una nuova
    { label: 'Barbers', href: '/dashboard/barbers', icon: Scissors }, // Per visualizzare i Barbieri
    { label: 'Saloons', href: '/dashboard/saloons', icon: Store }, // Per visualizzare i Saloni
];
