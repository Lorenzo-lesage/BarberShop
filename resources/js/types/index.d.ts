export interface User {
    id: number;
    name: string;
    email: string;
    is_barber: boolean;
    email_verified_at?: string;
    avatar: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
