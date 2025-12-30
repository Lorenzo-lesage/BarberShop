export interface LaravelPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationData<T> {
    data: T[]; // <--- Qui "T" è un segnaposto. Se passi Saloon, diventa Saloon[]
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
}
