// @ts-ignore
import { snack } from "@/libs/SnakClient";
import { GROUPS } from "@/constants";

import { User } from "@/types";
import { URLS } from "@/libs/fetch";
import { UserModel } from "@/models/User";

export const JWT_TOKEN = "token";

export const USER_INFO_TOKEN = "user";

export class AuthUtility {
  static async loginUser(email: string, password: string) {
    const resp = await fetch(URLS.API_SERVER + "/authentication/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: "include",
    });

    if (!resp.ok) {
      snack.error("Credenziali non corrette!");
    }

    return resp;
  }

  static async logoutUser() {
    const resp = await fetch(URLS.API_SERVER + "/authentication/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!resp.ok) {
      snack.error("Logout non eseguito");
    }

    return resp;
  }

  public static isManager(user: User| UserModel | null) {
    if (
      user &&
      user.groups.find((x) => x === GROUPS["manager"]) !== undefined
    ) {
      return true;
    }

    return false;
  }

  public static getUserDataFromCookies(cookies: string): User | null {
    try {
      return JSON.parse(cookies.replace(/\\054/g, ",").replace(/\\/g, ""));
    } catch (e) {
      return null;
    }
  }
}
