"use client";
import React, { useEffect, useState } from "react";

import {
  Pagination,
  Grid,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip
} from "@mui/material";

import { DjangoApi } from "@/libs/fetch";
import { InputField } from "@/components/filters";

const API = new DjangoApi();

function userCard(data) {
  const userInfo = data.user_info;

  const avatarName: string | null = userInfo
    ? userInfo.first_name[0] + userInfo.last_name[0]
    : null;

  return (
    <Paper elevation={5} sx={{ height: "100%", padding: 3 }}>
      <Box sx={{ display: "flex" , justifyContent: "space-between", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              mr: 1,
              width: 30,
              height: 30,
              fontSize: 15,
            }}
          >
            {avatarName}
          </Avatar>

          <Typography variant="body1" color="text.secondary">
            {data.email}
          </Typography>
        </Box>
        
        <Chip label={data.is_active ? "Attivo" : "Non attivo"} color={data.is_active ? "primary" : "error"} />
      </Box>

    
      <Box my={1} />

      <Typography variant="subtitle1">
        {userInfo && userInfo.first_name || "--"} {userInfo && userInfo.last_name || "--"}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary">
        Numero di telefono: {userInfo && userInfo.phone_number || "--"}
      </Typography>
    </Paper>
  );
}

export default function _() {
  const [userList, setUserList] = useState<[any]>([{}]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url: string = DjangoApi.buildURLparams("/authentication/users/list", [
      { param: "search", value: search },
      { param: "page", value: String(page) },
    ]);
    API.get(
      url,
      (response) => {
        const data = response.data;
        setUserList(data.results);
        setPageCount(data.num_pages);
      },
      () => {},
    );
  }, [page, search]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={6}>
        <InputField setterValue={setSearch} placeholder="Cerca" />
        </Grid>
        <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
          <Pagination
            count={Number(pageCount)}
            shape="rounded"
            onChange={(e, page) => {
              setPage(page);
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {userList &&
              userList.map((e, index) => (
                <Grid item xs={4} key={index}>
                  {userCard(e)}
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
