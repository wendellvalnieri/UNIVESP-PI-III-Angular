export interface Usuario {
    id?: string;
    password: string;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
}