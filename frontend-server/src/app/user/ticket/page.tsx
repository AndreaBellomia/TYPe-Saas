"use client";
import { useEffect, useState, useRef } from "react";
import {
  Container,
  Pagination,
  Button,
  Box,
  Grid
} from "@mui/material";

import TicketCard from "@/app/user/ticket/components/TicketCard";
import { useRouter } from 'next/navigation'

import InfiniteScroll from "./components/InfiniteScroll";

import { DjangoApi } from "@/libs/fetch";

import { Ticket } from "@/types";

const API = new DjangoApi();

export default function _() {
  const router = useRouter()
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0)


  const [data, setData] = useState<Ticket[]>([]);

  useEffect(() => {
    API.get(
      "ticket/tickets/list",
      (response) => {
        setData(response.data.results);
        setPageCount(response.data.num_pages)
        console.log(response.data);
      },
      (e) => {
        console.error(e);
      },
    );
  }, []);

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => router.push("ticket/crea")}>Nuovo ticket</Button>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center"}}>
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
          <Box key={index} sx={{ mb: 2 }}>
            <TicketCard
              label={e.label}
              description={e.description}
              status={e.status}
              key={index}
            />
          </Box>

        ))}
    </>
  );
}
