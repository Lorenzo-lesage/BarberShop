// In @/interfaces/saloon.ts
export interface OpeningHour {
    open: string;
    close: string;
    is_closed: boolean;
}

export interface Saloon {
    name: string;
    address: string;
    opening_hours: Record<string, OpeningHour>; // es: { 'monday': {open: '09:00', ...} }
}

export interface SaloonProps {
    saloon: Saloon | null;
}
