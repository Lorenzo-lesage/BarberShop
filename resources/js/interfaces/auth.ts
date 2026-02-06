import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Appointment } from './saloon';

export interface User {
    id: number;
    name: string;
    email: string;
    is_barber: boolean;
    avatar: string;
    appointments?: Appointment[];
    appointments_count?: number;
    created_at: string;
    updated_at: string;
    profile_photo: string | undefined;
    profile_photo_url: string | undefined;
    email_verified_at: string | undefined;
}

export interface ToastFlash {
    type: 'success' | 'error' | 'loading';
    message: string;
    description?: string;
}

export interface NotificationData {
    type: 'success' | 'error' | 'info';
    message: string;
    description?: string;
}

export interface DatabaseNotification {
    id: string;
    data: NotificationData;
    created_at: string;
    updated_at: string;
}

export interface AuthProps extends InertiaPageProps {
    auth: {
        user: User;
        notification?: DatabaseNotification | null;
    };
    flash?: {
        toast?: ToastFlash | undefined;
    };
    [key: string]: unknown;
}
