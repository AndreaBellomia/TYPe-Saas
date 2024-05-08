import dayjs from "dayjs";

import { snack } from "@/libs/SnakClient";
import { GROUPS } from "@/constants";

import { URLS } from "@/libs/fetch";
import { UserModel, PermissionGroup } from "@/models/User";

export const JWT_TOKEN = "token";
export const JWT_EXPIRE = "token_expire";

export async function logoutUser() {
  const resp = await fetch(URLS.API_SERVER + "/authentication/logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem(JWT_TOKEN),
    },
  });

  if (!resp.ok) {
    snack.error("Logout non eseguito");
  } else {
    sessionStorage.removeItem(JWT_TOKEN);
    sessionStorage.removeItem(JWT_EXPIRE);
  }

  return resp;
}

export function getToken() {
  const token = sessionStorage.getItem(JWT_TOKEN);

  const expire = dayjs(sessionStorage.getItem(JWT_EXPIRE));
  const now = new Date();

  if (expire.diff(now) <= 0) {
    sessionStorage.removeItem(JWT_TOKEN);
    sessionStorage.removeItem(JWT_EXPIRE);
    return undefined;
  }

  return token;
}

export function hasGroupPermission(user: UserModel | null, permissionName: PermissionGroup) {
  if (user && user.groups.find((p) => (p === permissionName) !== undefined)) {
    return true;
  }

  return false;
}

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface DefaultUser {
    djangoToken: string;
    djangoExpire: string;
    groups: Array<PermissionGroup>;
    is_staff: boolean;
    is_active: boolean;
  }

  interface DefaultSession {
    djangoToken: string;
    djangoExpire: string;
    groups: Array<PermissionGroup>;
    is_staff: boolean;
    is_active: boolean;
  }
  interface DefaultJWT {
    djangoToken: string;
    djangoExpire: string;
    groups: Array<PermissionGroup>;
    is_staff: boolean;
    is_active: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  secret: "process.env.NEXTAUTH_SECRET",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user.djangoToken) {
        return true;
      } else {
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect call");
      return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl);
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.djangoToken = user.djangoToken;
        token.djangoExpire = user.djangoExpire;
      }
      return token;
    },
    async session({ session, token }) {
      session.djangoToken = token.djangoToken as string;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        if (credentials === undefined) {
          return null;
        }

        const response = await fetch(URLS.API_SERVER + "/authentication/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            djangoToken: data.token,
            djangoExpire: data.expiry,
            id: data.user.id,
            name: data.user_info.first_name,
            email: data.user.email,
            is_staff: data.is_staff,
            is_active: data.is_active,
          } as User;
        }
        return null;
      },
    }),
  ],
};
