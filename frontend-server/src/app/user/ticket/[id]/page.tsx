"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import Avatar from "@/components/Avatar";

import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { Ticket } from "@/models/Ticket";
const API = new DjangoApi();

function dateTimeParser(date: string): string {
  // @ts-ignore
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").$d.toLocaleString("it");
}

function dateParser(date: string): string {
  // @ts-ignore
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").$d.toLocaleString("it", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function TicketDetail() {
  const params = useParams();
  const [data, setData] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<any[] | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    API.get(
      `ticket/${params.id}/`,
      (response) => {
        setData(response.data);
      },
      (e) => {
        throw new FetchDispatchError("Errore");
      },
    );
  }, [params]);

  useEffect(() => {
    
    if (messages === null) {
        API.get(
          `/ticket/${params.id}/message/`,
          (response) => {
            const data: any[] = response.data;
    
            setMessages(data);
          },
          () => {
            throw new FetchDispatchError(
              "Errore durante il recupero dei dati, riprova più tardi.",
            );
          },
        );
    }
  }, [messages, params]);

  const handlerMessageSubmit = () => {
    API.post(
      `/ticket/${params.id}/message/`,
      (response) => {
        setInputMessage("");
        setMessages(null);
      },
      () => {
        throw new FetchDispatchError(
          "Errore durante l'inserimento del messaggio",
        );
      },
      {
        message: inputMessage,
      },
    );
  };

  return (
    <>
      {data && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              <Chip label={data.status} variant="filled" sx={{ mr: 2 }} />
              {data.id}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} lg={8}>
              <Typography variant="subtitle1" color="text.secondary">
                Titolo
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {data.label}
              </Typography>

              <Box my={2} />

              <Typography variant="subtitle1" color="text.secondary">
                Descrizione
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {data.description || "nessuna descrizione"}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Categoria
              </Typography>
              <Chip label={data.type.name} variant="filled" color="primary" />

              <Box my={2} />
              <Typography variant="subtitle2" color="text.secondary">
                Data di consegna
              </Typography>
              <Chip label={dateParser(data.expiring_date)} variant="outlined" />

              <Box my={2} />

              <Typography variant="subtitle2" color="text.secondary">
                Assegnato a
              </Typography>
              {data.assigned_to ? (
                <Avatar user={data.assigned_to} dimension={24} />
              ) : (
                "Nessuno"
              )}

              <Box my={2} />

              <Typography variant="subtitle2" color="text.secondary">
                Creato il
              </Typography>
              <Chip
                label={"Creato: " + dateTimeParser(data.created_at)}
                variant="outlined"
              />
              <Box my={2} />
            </Grid>
          </Grid>
        </>
      )}

      <Typography variant="h6" color="initial">
        Messaggi
      </Typography>

      <Divider sx={{ my: 2 }} />

      <TextField
        label="Messaggio"
        id=""
        value={inputMessage}
        onChange={(e) => {
          setInputMessage(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handlerMessageSubmit}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
      />

      <Box sx={{ overflow: "auto", maxHeight: "50vh" }}>
            {messages &&
              messages.map((msg) => (
                <Paper elevation={2} key={msg.id} sx={{ mt: 2 }}>
                  <Box p={2}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2" color="initial">
                        {msg.author.first_name + " " + msg.author.last_name}
                      </Typography>
                      <Typography variant="subtitle2" color="initial">
                        {msg.author.email}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="initial">
                      {msg.message}
                    </Typography>

                    <Box sx={{ textAlign: "end" }}>
                      <Typography variant="caption" color="initial">
                        {new Date(msg.updated_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
          </Box>
        
    </>
  );
}

export default TicketDetail;
