"use client";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { JWT_TOKEN, logoutUser } from "@/libs/auth";
import { UserModel } from "@/models/User";

export default function CustomUserProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user: UserModel | null = useSelector((state: RootState) => state.user.user);

  if (sessionStorage.getItem(JWT_TOKEN) == null && !pathname.startsWith("/authentication/login")) {
    window.location.href = "/authentication/login";
    return null;
  }

  if (user === null && !pathname.startsWith("/authentication/login")) {
    logoutUser();
    window.location.href = "/authentication/login";
    return null;
  }

  if (pathname.startsWith("/admin") && !user!.is_staff) {
    window.location.href = "/user/ticket";
    return null;
  }

  return <>{children}</>;
}
