export interface Appointment {
    id: number;
    appointment_time: string;
    status: 'confirmed' | 'cancelled' | 'pending';

    // Foreign Keys (Sempre presenti nel DB, aggiungile qui)
    client_id: number;
    saloon_id: number;
    barber_id: number;

    // Relazioni (Opzionali, caricate tramite .with() in Laravel)
    client?: { id: number; name: string; email: string };
    saloon?: { id: number; name: string };
    barber?: { id: number; name: string; email: string };
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

export interface Saloon {
    id: number;
    name: string;
    address: string;
    opening_hours: Record<string, OpeningHour>;
    exceptions: Exception[];
    appointments?: Appointment[];
    barber?: { id: number; name: string };
    user_id: number;
}
