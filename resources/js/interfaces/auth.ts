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
    profile_photo: string | null;
    profile_photo_url: string | undefined;
    email_verified_at: string | null;
}

export interface ToastFlash {
    type: 'success' | 'error' | 'loading';
    message: string;
    description?: string;
}

export interface AuthProps {
    auth: {
        user: User;
    };
    flash?: {
        toast?: ToastFlash;
    };
    [key: string]: unknown;
}
