"use client";

import { Paper, Box, Grid } from "@mui/material";

import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { useEffect, useState } from "react";

import { User } from "@/types";

import PasswordCard from "./components/PasswordCard";
import ProfileCard from "./components/ProfileCard";

const API = new DjangoApi();

export default function _() {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    API.get(
      "/authentication/profile/",
      (response) => {
        setUser(response.data);
        console.log(response.data);
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
