import NextAuth from "next-auth";

declare module "next-auth" {
    interface DefaultSession {
      djangoToken: string;
      djangoExpire: string;
      djangoGroups: Array<PermissionGroup>;
      is_staff: boolean;
      is_active: boolean;
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
    }
  }
