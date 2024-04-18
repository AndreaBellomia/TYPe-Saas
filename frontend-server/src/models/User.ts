


export interface SmallUser {
    id: number
    email: string
    first_name: string
    last_name: string
}


export interface UserModel {
    id: number;
    last_login: Date;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    email: string;
    groups: Array<number>;
    user_permissions: Array<any>;
    updated_at: Date;
  }