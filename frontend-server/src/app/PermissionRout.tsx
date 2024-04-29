"use client";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { DjangoApi } from "@/libs/fetch";
import { AuthUtility } from "@/libs/auth";
import { User } from "@/types";
import { snack } from "@/libs/SnakClient";


const ADMIN_PATH = [
  ""
]

export default function CustomUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const pathname = usePathname()
  const user: User | null = useSelector((state: RootState) => state.user.user);

  if (user === null) {
    AuthUtility.logoutUser()
    router.push("/authentication/login")
    return
  }

  if (pathname.startsWith("/admin") && !user.is_staff) {
    router.push("/user/ticket")
    snack.warning("Permesso negato")
  }

  return <>{children}</>;
}
