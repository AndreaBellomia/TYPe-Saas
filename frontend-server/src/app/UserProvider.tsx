"use client";
// @ts-ignore
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { DjangoApi } from "@/libs/fetch";
import { AuthUtility } from "@/libs/auth";
import { User } from "@/types";

const API = new DjangoApi();

export default function CustomUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const getUser = () => {
    API.get(
      "/authentication/profile",
      (response) => {
        dispatch({ type: "USER_SET", payload: response.data });
      },
      () => {},
    );
  };

  useEffect(() => {
    const cookiesUser = AuthUtility.getUserDataFromCookies(Cookies.get("user"));

    if (user === null || cookiesUser === null) {
      getUser();
      return;
    }

    const cookiesDate = new Date(cookiesUser.updated_at);
    const userDate = new Date(user.updated_at);

    if (cookiesDate.toISOString() !== userDate.toISOString()) {
      getUser();
    }
  }, [user]);

  return <>{children}</>;
}
