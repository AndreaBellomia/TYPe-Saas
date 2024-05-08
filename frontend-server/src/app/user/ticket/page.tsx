"use client";
import { useEffect, useState } from "react";
import { Pagination, Button, Box, Grid } from "@mui/material";

import TicketCard from "@/app/user/ticket/components/TicketCard";
import { useRouter } from "next/navigation";

import { DjangoApi, useDjangoApi } from "@/libs/fetch";

import { Ticket } from "@/models/Ticket";

import { useSession } from "next-auth/react"

export default function _() {
  const api = useDjangoApi();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState<Ticket[]>([]);

  const session = useSession()

  console.log(session)

  useEffect(() => {
    const url: string = DjangoApi.buildURLparams("/ticket/", [{ param: "page", value: String(page) }]);
    api.get(
      url,
      (response) => {
        setData(response.data.results);
        setPageCount(response.data.num_pages);
      },
      (e) => {
        console.error(e);
      },
    );
  }, [page]);

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => router.push("ticket/crea")}>
            Nuova richiesta
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Pagination
              count={Number(pageCount)}
              shape="rounded"
              onChange={(e, page) => {
                setPage(page);
              }}
              color="primary"
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ my: 2 }} />

      {data &&
        data.map((e, index) => (
          <Box
            key={index}
            sx={{ mb: 2 }}
            onClick={() => {
              router.push(`/user/ticket/${e.id}`);
            }}
          >
            <TicketCard data={e} />
          </Box>
        ))}
    </>
  );
}
