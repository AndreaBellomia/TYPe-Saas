import { NextResponse, type NextRequest } from "next/server";

import { USER_INFO_TOKEN } from "@/libs/auth";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const unescapedUserData: string | undefined =
    request.cookies.get(USER_INFO_TOKEN)?.value;

  if (typeof unescapedUserData === "undefined") {
    console.warn("no cookies for user");

    if (request.nextUrl.pathname.startsWith("/authentication/login")) {
      return response
    }
    return Response.redirect(new URL("/authentication/login", request.url));
  }

  const userData = JSON.parse(
    JSON.parse(unescapedUserData.replace(/\\054/g, ",")),
  );

  console.log(request.nextUrl.pathname)
  
  // if (
  //   !userData["is_active"] &&
  //   request.nextUrl.pathname !== "/user/profile"
  // ) {
  //   return Response.redirect(new URL("/user/profile/", request.url));
  // }

  if (
    !userData["is_staff"] &&
    !request.nextUrl.pathname.startsWith("/admin")
  ) {
    return Response.redirect(new URL("/user/ticket", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
