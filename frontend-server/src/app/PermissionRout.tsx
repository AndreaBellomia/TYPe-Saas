"use client";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { AuthUtility, JWT_TOKEN } from "@/libs/auth";
import { User } from "@/types";

export default function CustomUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user: User | null = useSelector((state: RootState) => state.user.user);

  if (
    sessionStorage.getItem(JWT_TOKEN) == null &&
    !pathname.startsWith("/authentication/login")
  ) {
    window.location.href = "/authentication/login";
    return null;
  }

  if (user === null && !pathname.startsWith("/authentication/login")) {
    AuthUtility.logoutUser();
    window.location.href = "/authentication/login";
    return null;
  }

  if (pathname.startsWith("/admin") && !user!.is_staff) {
    window.location.href = "/user/ticket";
    return null;
  }

  return <>{children}</>;
}
