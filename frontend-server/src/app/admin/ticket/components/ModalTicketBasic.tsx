"use-client";
import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";

import {
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";

import Modal from "@/components/Modal";
import { AuthUtility } from "@/libs/auth";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";

import ModalTicketForm from "@/app/admin/ticket/components/ModalTicketForm";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Message } from "@/models/ticket";

const API = new DjangoApi();

interface ComponentProps {
  modalStatus: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  detailId: string | null;
}

function userAvatarComponent(user: {
  email: string;
  first_name: string | null;
  last_name: string | null;
  id: string | number | null;
}) {
  if (!user) {
    return (
      <Typography variant="body2" color="text.secondary">
        nessuno
      </Typography>
    );
  }

  const avatarName: string | null =
    user.first_name && user.last_name
      ? user.first_name[0] + user.last_name[0]
      : null;

  return (
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
        {user.email}
      </Typography>
    </Box>
  );
}

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

export default function _({ modalStatus, detailId }: ComponentProps) {
  const [open, setOpen] = modalStatus;
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [editable, setEditable] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (detailId) {
      API.get(
        `/ticket/admin/${detailId}/`,
        (response) => {
          const data: { [key: string]: any } = response.data;

          setData(data);
        },
        () => {
          throw new FetchDispatchError(
            "Errore durante il recupero dei dati, riprova più tardi.",
          );
        },
      );
    } else {
      setData(null);
      setMessages(null);
    }

    setEditable(detailId === null);
  }, [detailId]);

  useEffect(() => {
    if (detailId) {
      API.get(
        `/ticket/${detailId}/message/`,
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
  }, [messages, detailId]);

  const handlerMessageSubmit = () => {
    API.post(
      `/ticket/${detailId}/message/`,
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
      <Modal state={[open, setOpen]}>
        <>
          {editable ? (
            <ModalTicketForm
              partial={AuthUtility.isManager(user)}
              setModal={setOpen}
              setEditable={setEditable}
              objectData={data}
            />
          ) : (
            data && (
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
                  <IconButton onClick={() => setEditable(!editable)}>
                    <EditIcon />
                  </IconButton>
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
                    <Chip
                      label={data.type.name}
                      variant="filled"
                      color="primary"
                    />

                    <Box my={2} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Data di consegna
                    </Typography>
                    <Chip
                      label={dateParser(data.expiring_date)}
                      variant="outlined"
                    />

                    <Box my={2} />

                    <Typography variant="subtitle2" color="text.secondary">
                      Assegnato a
                    </Typography>
                    {userAvatarComponent(data.assigned_to)}

                    <Box my={2} />

                    <Typography variant="subtitle2" color="text.secondary">
                      Creato da
                    </Typography>
                    {userAvatarComponent(data.created_by)}

                    <Box my={2} />

                    <Typography variant="subtitle2" color="text.secondary">
                      Creato il
                    </Typography>
                    <Chip
                      label={"Creato: " + dateTimeParser(data.created_at)}
                      variant="outlined"
                    />
                    <Box my={2} />

                    <Typography variant="subtitle2" color="text.secondary">
                      Ultimo aggiornamento
                    </Typography>
                    <Chip
                      label={"Aggiornato: " + dateTimeParser(data.updated_at)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </>
            )
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
      </Modal>
    </>
  );
}
