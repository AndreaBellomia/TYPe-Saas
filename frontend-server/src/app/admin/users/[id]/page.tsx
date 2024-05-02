"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Typography, Box, Paper, Chip, Grid } from "@mui/material";

import UserCard from "@/app/admin/users/[id]/components/UserCard";
import AdministrationCard from "@/app/admin/users/[id]/components/AdministrationCard";

import { UserModel } from "@/models/User";

import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
const API = new DjangoApi();

export default function MyComponent() {
  const params = useParams();

  const [user, setUser] = useState<null | UserModel>(null);

  useEffect(() => {
    API.get(
      `authentication/users/${params.id}/`,
      (response) => {
        setUser(response.data);
      },
      (e) => {
        throw new FetchDispatchError("Errore");
      },
    );
  }, [params]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} xl={6}>
          {user && <UserCard user={user} />}
        </Grid>
        <Grid item xs={6}>
          {user && <AdministrationCard user={user} />}
        </Grid>
      </Grid>
    </>
  );
}
