"use client";
import React, { useEffect, useState } from "react";

import { Pagination, Grid, Button } from "@mui/material";

import UserCard from "./components/UserCard";

import { DjangoApi } from "@/libs/fetch";
import { InputField } from "@/components/filters";

import CreateUserModal from "@/app/admin/users/components/CreateUserModal";

const API = new DjangoApi();

export default function _() {
  const [createUser, setCreateUser] = useState(false);
  const [userList, setUserList] = useState<[any]>([{}]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (createUser) {
      return
    }

    const url: string = DjangoApi.buildURLparams("/authentication/users/", [
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
  }, [page, search, createUser]);

  return (
    <>
      <Button
        onClick={() => {
          setCreateUser(true);
        }}
      >
        Crea utente
      </Button>
      <CreateUserModal state={[createUser, setCreateUser]} />
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <InputField setterValue={setSearch} placeholder="Cerca" />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
        >
          <Pagination
            count={Number(pageCount)}
            shape="rounded"
            onChange={(e, page) => {
              setPage(page);
            }}
            color="primary"
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            {userList &&
              userList.map((user, index) => (
                <Grid item xs={4} key={index}>
                  <UserCard user={user} />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
