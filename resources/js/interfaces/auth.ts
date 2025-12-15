export interface User {
    id: number;
    name: string;
    email: string;
    is_barber: boolean;
    avatar: string;
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
