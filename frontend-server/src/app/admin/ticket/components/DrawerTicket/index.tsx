import React, { useEffect, useState } from "react";

import { Drawer } from "@mui/material";

import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { Message } from "@/models/Ticket";

import Form from "@/app/admin/ticket/components/DrawerTicket/From";
import Messages from "@/app/admin/ticket/components/DrawerTicket/Messages";

export interface DrawerTicketProps {
  open: boolean;
  onClose: () => void;
  id: string | null;
}

export function DrawerTicket({ open, onClose, id }: DrawerTicketProps) {
  const API = new DjangoApi();
  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    if (id) {
      updateMessages();
    }
  }, [id]);

  const updateMessages = () => {
    API.get(
      `/ticket/${id}/message/`,
      (response) => {
        const data: any[] = response.data;

        setMessages(data);
      },
      () => {
        throw new FetchDispatchError("Errore durante il recupero dei dati, riprova più tardi.");
      },
    );
  };

  return (
    <Drawer open={open} onClose={onClose} anchor={"right"} PaperProps={{ sx: { width: "100%", maxWidth: "65rem" } }}>
      <Form handlerCloseDrawer={onClose} id={id} />
      <Messages id={id} />
    </Drawer>
  );
}

export default DrawerTicket;
