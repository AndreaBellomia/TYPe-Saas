import { NextResponse, type NextRequest } from "next/server";

import { USER_INFO_TOKEN } from "@/libs/auth";

function getUserCookies(
  request: NextRequest,
): undefined | { [key: string]: any } {
  const unescapedUserData: string | undefined =
    request.cookies.get(USER_INFO_TOKEN)?.value;

  if (typeof unescapedUserData === "undefined") {
    console.warn("no cookies for user");

    return undefined;
  }
  return JSON.parse(JSON.parse(unescapedUserData.replace(/\\054/g, ",")));
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const nextPath = request.nextUrl.pathname;

  if (request.nextUrl.pathname.startsWith("/authentication/login")) {
    return response;
  }

  const userCookies = getUserCookies(request);

  if (userCookies === undefined) {
    return Response.redirect(new URL("/authentication/login", request.url));
  }

  if (!userCookies["is_staff"] && nextPath.startsWith("/admin")) {
    return Response.redirect(new URL("/user/ticket", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
