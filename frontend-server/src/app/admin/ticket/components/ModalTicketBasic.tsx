"use-client";
import React, { useEffect, useState, useRef } from "react";

import {
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";

import Modal from "@/components/Modal";
import { AuthUtility } from "@/libs/auth";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";

import ModalTicketForm from "@/app/admin/ticket/components/ModalTicketForm";

const API = new DjangoApi();

interface ComponentProps {
  modalStatus: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  detailId: string | null;
}

export default function _({ modalStatus, detailId }: ComponentProps) {
  const [open, setOpen] = modalStatus;
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const [editable, setEditable] = useState(true);
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
  }, [open]);

  return (
    <>
      <Modal state={[open, setOpen]}>
        <>
          <Button onClick={() => setEditable(!editable)}>Modifica</Button>
          {editable ? (
            <ModalTicketForm
              partial={isManager.current}
              setModal={setOpen}
              objectData={data}
            />
          ) : (
            <>visualizza</>
          )}
        </>
      </Modal>
    </>
  );
}
