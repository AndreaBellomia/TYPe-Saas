import { NextAuthOptions, User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserModel, PermissionGroup } from "@/models/User";
import { URLS } from "@/libs/fetch";

export async function singOut(session: ReturnType<typeof useSession>) {
  if (typeof window === "undefined") {
    throw new Error("signOut can be use only in client side!");
  }

  if (session === null) {
    signOut();
  }

  const resp = await fetch(URLS.API_SERVER + "/authentication/logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + session.data?.djangoToken,
    },
  });

  signOut();
}

export function hasGroupPermission(user: UserModel | null, permissionName: PermissionGroup) {
  if (user && user.groups.find((p) => (p === permissionName) !== undefined)) {
    return true;
  }
  return false;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/authentication/login',
  },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/user/ticket";
    },
    async jwt({ token, user, account }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      return { ...token, ...session };
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
            djangoGroups: data.user.groups,
            id: data.user.id,
            name: data.user_info?.first_name,
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
