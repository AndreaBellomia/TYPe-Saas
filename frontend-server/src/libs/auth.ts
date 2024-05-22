import { NextAuthOptions, User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserModel, PermissionGroup } from "@/models/User";
import { URLS } from "@/libs/fetch";
import { Dispatch } from "react";
import { UnknownAction } from "@reduxjs/toolkit";

class NonTrackableError extends Error {
  public omit: boolean;

  constructor(message: string, omit: boolean = false) {
    super(message);
    this.name = this.constructor.name;
    this.omit = omit;
    Object.setPrototypeOf(this, NonTrackableError.prototype);
  }
}

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

export function hasGroupPermission(user: UserModel | null | undefined, permissionName: PermissionGroup) {
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
    signIn: "/authentication/login",
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

        try {
          const response = await fetch(
            ( process.env.NEXT_API_URL || process.env.NEXTCLIENT_API_URL ) + "/authentication/login/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (response.status === 400) {
            throw new NonTrackableError("WrongCredentials", true);
          }

          if (!response.ok) {
            console.log(response)
            throw new NonTrackableError("ConnectionError " + JSON.stringify(response));
          }

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
            user_data: data.user
          } as User;
        } catch (err) {
          const error = err as NonTrackableError;
          if (error.omit) throw error;
        }
        return null;
      },
    }),
  ],
};
