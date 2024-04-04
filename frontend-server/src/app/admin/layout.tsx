import { cookies } from "next/headers";

import NavBar from "@/app/admin/components/NavBar"

import { AuthUtility } from "@/libs/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies();
  const user = AuthUtility.parseServerSideJson(cookie.get("user").value);

  return (
    <>
      <NavBar user={user}>
        {children}
      </NavBar>
    </>
  );
}
