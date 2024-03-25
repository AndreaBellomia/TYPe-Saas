"use-client";
import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";

import {
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';

import Modal from "@/components/Modal";
import { AuthUtility } from "@/libs/auth";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";

import ModalTicketForm from "@/app/admin/ticket/components/ModalTicketForm";

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
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").$d.toLocaleString("it");
}

function dateParser(date: string): string {
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").$d.toLocaleString("it", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function _({ modalStatus, detailId }: ComponentProps) {
  const [open, setOpen] = modalStatus;
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const [editable, setEditable] = useState(false);
  const isManager = useRef(AuthUtility.isManager());

  useEffect(() => {
    if (detailId) {
      API.get(
        `/ticket/admin/tickets/update/${detailId}`,
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
    }

    setEditable(detailId === null);
  }, [open]);

  return (
    <>
      <Modal state={[open, setOpen]}>
        <>
          {editable ? (
            <ModalTicketForm
              partial={isManager.current}
              setModal={setOpen}
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
                    <EditIcon/>
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} lg={9}>
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
        </>
      </Modal>
    </>
  );
}
