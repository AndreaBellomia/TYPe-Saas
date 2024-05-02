"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Chip,
  Paper,
  Link,
} from "@mui/material";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Avatar from "@/components/Avatar";

import { useDjangoApi, FetchDispatchError } from "@/libs/fetch";
import { Ticket } from "@/models/Ticket";
import { UserTicketLabel } from "@/constants";
import { dateParser, dateTimeParser } from "@/libs/utils";

import MessageBox from "@/app/user/ticket/[id]/components/MessageBox"

function TicketDetail() {
  const api = useDjangoApi();
  const params = useParams();
  const [data, setData] = useState<Ticket | null>(null);

  useEffect(() => {
    api.get(
      `ticket/${params.id}/`,
      (response) => {
        setData(response.data);
      },
      () => {
        throw new FetchDispatchError("Si è verificato un errore");
      },
    );
  }, [params]);


  return (
    <>
      {data && (
        <>
          <Link href="/user/ticket" underline="none" variant="subtitle1" alignItems="center" display="flex">
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
            Torna ai tuoi ticket
          </Link>

          <Box marginY={1} />

          <Paper sx={{ padding: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <ConfirmationNumberIcon fontSize="large" sx={{ mr: 1 }} color="primary" />
                <Typography variant="h4">
                  Richiesta {data.id} del {dateParser(data.created_at)}
                </Typography>
              </Box>

              <Typography variant="h6" color="text.secondary">
                <Chip label={UserTicketLabel[data.status]} variant="filled" />
              </Typography>
            </Box>
          </Paper>

          <Box marginY={2} />

          <Grid container spacing={2}>
            <Grid item xs={12} lg={8} display="flex">
              <Paper sx={{ padding: 2, width: "100%" }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Titolo della richiesta
                </Typography>
                <Typography variant="h6">{data.label}</Typography>

                <Box my={2} />

                <Typography variant="subtitle1" color="text.secondary">
                  Descrizione
                </Typography>
                <Typography variant="body2">{data.description || "nessuna descrizione"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} boxSizing="border-box">
              <Paper sx={{ padding: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Categoria
                </Typography>
                <Chip label={data.type.name} variant="filled" color="primary" />
                <Box my={2} />
                <Typography variant="subtitle2" color="text.secondary">
                  Data di consegna richiesta
                </Typography>
                <Chip label={dateParser(data.expiring_date)} variant="outlined" />

                <Box my={2} />

                <Typography variant="subtitle2" color="text.secondary">
                  Responsabile
                </Typography>
                <Avatar user={data.assigned_to} dimension={24} />

                <Box my={2} />

                <Typography variant="subtitle2" color="text.secondary">
                  Creato il
                </Typography>
                <Chip label={"Creato: " + dateTimeParser(data.created_at)} variant="outlined" />

                <Box my={2} />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      <Box mt={2} />

      <Typography variant="h6" color="initial">
        Messaggi
      </Typography>

      <Box mt={1} />

      <MessageBox id={params.id} />
    </>
  );
}

export default TicketDetail;
