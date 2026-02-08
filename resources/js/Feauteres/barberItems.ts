import {
    Activity,
    CalendarClock,
    ClipboardList,
    Users,
    Warehouse,
} from 'lucide-react';

export const barberItems = [
    {
        label: 'OPERATIONAL_CORE',
        href: '/dashboard',
        icon: Activity,
    },
    {
        label: 'Saloon_Registry',
        href: '/dashboard/my-saloon',
        icon: Warehouse,
    },
    {
        label: 'Appointment_Log',
        href: '/dashboard/appointments',
        icon: CalendarClock,
    },
    {
        label: 'Client_Database',
        href: '/dashboard/clients',
        icon: Users,
    },
    {
        label: 'Global_Network',
        href: '/dashboard/saloons',
        icon: ClipboardList,
    },
];
