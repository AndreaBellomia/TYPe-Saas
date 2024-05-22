import NextAuth from "next-auth";
import { UserModel } from "@/models/User"

declare module "next-auth" {
    interface DefaultSession {
      djangoToken: string;
      djangoExpire: string;
      djangoGroups: Array<PermissionGroup>;
      is_staff: boolean;
      is_active: boolean;
      user_data: UserModel | null
    }
    interface DefaultJWT {
      djangoToken: string;
      djangoExpire: string;
      djangoGroups: Array<PermissionGroup>;
      is_staff: boolean;
      is_active: boolean;
    }
    interface DefaultUser {
      djangoToken: string;
      djangoExpire: string;
      djangoGroups: Array<PermissionGroup>;
      is_staff: boolean;
      is_active: boolean;
      user_data: UserModel | null
    }
  }
