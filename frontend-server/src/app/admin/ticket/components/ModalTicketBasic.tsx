"use-client";
import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

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
import DatePicker, { parseDateValue } from "@/components/DatePicker";
import { AuthUtility } from "@/libs/auth";
import { DjangoApi } from "@/libs/fetch";

import ModalTicketForm from "@/app/admin/ticket/components/ModalTicketForm"


const API = new DjangoApi();

interface ComponentProps {
  modalStatus: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function _({ modalStatus }: ComponentProps) {
  const [open, setOpen] = modalStatus;
  const [editable, setEditable] = useState(true);
  const typesRef = useRef<{ label: string; id: number }[]>([]);

  useEffect(() => {
    if (open) {
      API.get(
        "ticket/types/list",
        (response) => {
          const data: Array<any> = response.data;
          typesRef.current = data.map((e) => ({ label: e.name, id: e.id }));
        },
        () => {},
      );
    }
  }, [open]);

  return (
    <>
      <Modal state={[open, setOpen]}>
        <>
          <Button onClick={() => setEditable(!editable)}>Modifica</Button>
          {editable ? <ModalTicketForm partial={AuthUtility.isManager()} setModal={setOpen} /> : 
          <>
          visualizza
          </>}
        </>
      </Modal>
    </>
  );
}
