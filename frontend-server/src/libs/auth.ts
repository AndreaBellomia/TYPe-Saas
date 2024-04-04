// @ts-ignore
import Cookies from "js-cookie";
import { snack } from "@/libs/SnakClient";
import { GROUPS } from "@/constants";
import { cookies } from "next/headers";

import { UserType } from "@/types";
import { URLS } from "@/libs/fetch";

export const JWT_TOKEN = "auth";

export const USER_INFO_TOKEN = "user";

export class AuthUtility {
  public static getUserData(): UserType | undefined {
    let cookiesUser = undefined;

    if (typeof window !== 'undefined') {
      cookiesUser = Cookies.get(USER_INFO_TOKEN);
    }
  
    if (cookiesUser !== undefined) {
      return JSON.parse(cookiesUser);
    }
  
    return undefined;
  
  }

  static getAuthData(): string {
    return Cookies.get(JWT_TOKEN);
  }

  static async loginUser(email: string, password: string) {
    const resp = await fetch("login/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!resp.ok) {
      snack.error("Credenziali non corrette!");
    }

    return resp;
  }

  public static isManager() {
    const userData = this.getUserData();
    if (
      userData &&
      userData.is_staff &&
      userData.groups.includes(GROUPS.manager)
    ) {
      return true;
    }

    return false;
  }

  public static parseServerSideJson<T>(
    data: string,
  ): T | undefined {
    try {
      return JSON.parse(data);
    } catch (e) {
      return undefined;
    }
  }
}
