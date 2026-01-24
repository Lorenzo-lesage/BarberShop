import { History, Search, ShieldCheck } from 'lucide-react';

export const clientItems = [
    {
        label: 'Session_History',
        href: '/dashboard/appointments',
        icon: History,
    },
    {
        label: 'Explore_Network',
        href: '/dashboard/saloons',
        icon: Search,
    },
    {
        label: 'Affiliated_Saloons',
        href: '/dashboard/my-saloons',
        icon: ShieldCheck,
    },
];
