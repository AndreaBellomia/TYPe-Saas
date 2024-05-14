import dayjs from "dayjs";

import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { PermissionGroup } from "./models/User";

const accessConfig = [
  {
    matcher: (url: string) => url.startsWith("/admin"),
    permissions: [PermissionGroup.EMPLOYER, PermissionGroup.MANAGER],
  },
];

const publicPath = ["/authentication/login", "/api/auth", "/_next", "/authentication/password_change"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (publicPath.some((path) => request.nextUrl.pathname.startsWith(path))) return NextResponse.next();

  if (token === null) return NextResponse.redirect(new URL("/authentication/login", request.url));

  if (dayjs(token.djangoExpire as string).diff(new Date()) <= 0) {
    const response = NextResponse.redirect(new URL("/authentication/login", request.url));
    response.cookies.delete("next-auth.session-token");
    return response;
  }

  const groups = token.djangoGroups as PermissionGroup[];
  for (const conf of accessConfig) {
    if (conf.matcher(request.nextUrl.pathname) && groups.every((e) => !conf.permissions.includes(e))) {
      return NextResponse.redirect(new URL("/user/ticket", request.url));
    }
  }

  return NextResponse.next();
}
