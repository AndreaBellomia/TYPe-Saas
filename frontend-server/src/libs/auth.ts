import Cookies from "js-cookie";

export interface UserData {
  id: number;
  last_login: Date;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  email: string;
  groups: Array<any>;
  user_permissions: Array<any>;
}

export const JWT_TOKEN = "auth";

export const USER_INFO_TOKEN = "user";

export class AuthUtility {
  static getUserData(): UserData {
    return JSON.parse(Cookies.get(USER_INFO_TOKEN));
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
      return false;
    }

    return true;
  }
}
