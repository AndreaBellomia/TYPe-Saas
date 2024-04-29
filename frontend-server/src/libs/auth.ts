import dayjs from "dayjs";

import { snack } from "@/libs/SnakClient";
import { GROUPS } from "@/constants";

import { User } from "@/types";
import { URLS } from "@/libs/fetch";
import { UserModel } from "@/models/User";

export const JWT_TOKEN = "token";
export const JWT_EXPIRE = "token_expire";

export const USER_INFO_TOKEN = "user";

export class AuthUtility {
  static getToken() {
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

  static async logoutUser() {
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

  public static isManager(user: User | UserModel | null) {
    if (
      user &&
      user.groups.find((x) => x === GROUPS["manager"]) !== undefined
    ) {
      return true;
    }

    return false;
  }
}
