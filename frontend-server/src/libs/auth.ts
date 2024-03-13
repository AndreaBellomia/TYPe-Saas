import Cookies from "js-cookie";

export const JWT_TOKEN = "auth";

export const USER_INFO_TOKEN = "user";

export class AuthUtility {
  static getUserData(): any {
    Cookies.get(USER_INFO_TOKEN);
  }

  static getAuthData(): any {
    Cookies.get(JWT_TOKEN);
  }
}
