export interface Appointment {
    id: number;
    appointment_time: string;
    status: 'confirmed' | 'cancelled' | 'pending';

    // Foreign Keys (Sempre presenti nel DB, aggiungile qui)
    client_id: number;
    saloon_id: number;
    barber_id: number;

    // Relazioni (Opzionali, caricate tramite .with() in Laravel)
    client?: {
        id: number;
        name: string;
        email: string;
        profile_photo: string | null;
    };
    saloon?: {
        id: number;
        name: string;
        main_photo: { id: number; url: string; is_main: boolean; path: string };
    };
    barber?: {
        id: number;
        name: string;
        email: string;
        profile_photo: string | null;
    };
}
export interface OpeningHour {
    open: string;
    close: string;
    is_closed: boolean;
}

export interface Exception {
    id: number;
    start_date: string;
    end_date: string;
    reason?: string;
}

export interface SaloonPhoto {
    id: number;
    url: string;
    is_main: boolean;
    path: string;
}

export interface Saloon {
    id: number;
    name: string;
    address: string;
    opening_hours: Record<string, OpeningHour>;
    exceptions: Exception[];
    appointments?: Appointment[];
    barber?: { id: number; name: string; profile_photo: string | null };
    user_id: number;
    city: string;
    province: string;
    region: string;
    cap: string;
    main_photo?: { id: number; url: string; is_main: boolean; path: string };
    gallery?: string[];
    photos?: SaloonPhoto[];
}

export interface DashboardProps {
    nextAppointment: {
        date: string;
        time: string;
        service: string;
        barber: string;
        barber_photo: string | null;
        saloon: Saloon;
    } | null;
    history: Array<{
        id: number;
        date: string;
        time: string;
        barber: string;
        saloon: Saloon;
    }>;
}
