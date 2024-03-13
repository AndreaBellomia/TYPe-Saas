import { NextResponse, type NextRequest } from "next/server";

import { URLS } from "@/libs/fetch";
import { JWT_TOKEN, USER_INFO_TOKEN } from "@/libs/auth";

export async function middleware(request: NextRequest) {
  //@ts-ignore
  Date.prototype.addHours = function (h: number) {
    this.setHours(this.getHours() + h);
    return this;
  };

  const response = NextResponse.next();

  const tokenJWT: string | undefined = request.cookies.get(JWT_TOKEN)?.value;

  const userData: string | undefined =
    request.cookies.get(USER_INFO_TOKEN)?.value;

  if (
    typeof tokenJWT === "undefined" &&
    !request.nextUrl.pathname.startsWith("/login")
  ) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (typeof userData === "undefined") {
    const url: string = URLS.API_SERVER + "/authentication/authenticated";

    const userRequest = await fetch(url, {
      headers: {
        Authorization: "Token " + tokenJWT,
        "Content-Type": "application/json",
      },
    });

    if (userRequest.ok) {
      const data = await userRequest.json();

      response.cookies.set({
        name: USER_INFO_TOKEN,
        value: JSON.stringify(data),
        httpOnly: false,
        secure: true,
        //@ts-ignore
        expires: new Date().addHours(2),
      });
    } else {
      const data = await userRequest.json();
      !request.nextUrl.pathname.startsWith("/login") && console.error(data);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
