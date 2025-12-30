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
    barber?: { id: number; name: string };
    user_id: number;
}
