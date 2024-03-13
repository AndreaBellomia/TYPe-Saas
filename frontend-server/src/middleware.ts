
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const now: Date = new Date();

  //@ts-ignore
  Date.prototype.addHours = function (h: number) {
    this.setHours(this.getHours() + h);
    return this;
  };

  const response = NextResponse.next();

  const tokenJWT: string | undefined = request.cookies.get("auth")?.value;

  const userData: string | undefined = request.cookies.get("user")?.value;

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
        name: "user",
        value: JSON.stringify(data),
        httpOnly: false,
        secure: true,
        //@ts-ignore
        expires: new Date().addHours(2),
      });
    } else {
      const data = await userRequest.json();
      console.error(data);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
