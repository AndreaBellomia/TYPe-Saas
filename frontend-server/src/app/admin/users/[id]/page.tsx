"use client"
import React, { useEffect, useState } from "react"
import { useParams } from 'next/navigation'

import { Typography, Box, Paper, Chip, Grid } from "@mui/material";

import UserCard from "./components/UserCard"

import { User } from "@/types";


import { DjangoApi, FetchDispatchError } from "@/libs/fetch"
const API = new DjangoApi()

export default function MyComponent() {
  const params = useParams()

  const [user, setUser] = useState<null | User>(null)

  useEffect(() => {
    API.get(`authentication/users/${params.id}/`, (response) => {
      setUser(response.data)
    },
    (e) => {
      throw new FetchDispatchError("Errore")
    })
  }, [params])


  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          {
            user && <UserCard user={user} />
          }
          
        </Grid>
      </Grid>
    </>
  );
}