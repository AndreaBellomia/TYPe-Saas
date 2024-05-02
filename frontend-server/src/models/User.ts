export enum PermissionGroup {
  MANAGER = "manager",
  EMPLOYER = "employer",
}

export interface SmallUser {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface UserInfoModel {
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface UserModel {
  id: number;
  last_login: Date;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  email: string;
  groups: Array<PermissionGroup>;
  user_permissions: Array<any>;
  updated_at: Date;
  user_info: UserInfoModel | null;
}
