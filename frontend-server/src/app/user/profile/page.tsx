"use client";

import { Paper, Box, Grid } from "@mui/material";

import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { useEffect, useState } from "react";

import { UserModel } from "@/models/User";

import PasswordCard from "./components/PasswordCard";
import ProfileCard from "./components/ProfileCard";

export default function _() {
  const API = new DjangoApi();
  const [user, setUser] = useState<null | UserModel>(null);

  useEffect(() => {
    API.get(
      "/authentication/profile/",
      (response) => {
        setUser(response.data);
      },
      (error) => {
        throw new FetchDispatchError(error.detail);
      },
    );
  }, []);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProfileCard user={user} />
        </Grid>
        <Grid item xs={12}>
          <PasswordCard />
        </Grid>
      </Grid>
    </>
  );
}
