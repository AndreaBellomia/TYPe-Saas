import { cookies } from "next/headers";

import NavBar from "@/app/user/components/NavBar";

import { AuthUtility } from "@/libs/auth";
import { UserType } from "@/types";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies();

  let user = undefined;

  const rawUser = cookie.get("user")?.value;

  if (rawUser) {
    user = AuthUtility.parseServerSideJson<UserType>(rawUser);
  }

  return (
    <>
      <NavBar user={user}>{children}</NavBar>
    </>
  );
}
