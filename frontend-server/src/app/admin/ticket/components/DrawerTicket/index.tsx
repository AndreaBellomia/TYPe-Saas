import React from "react";

import { Drawer } from "@mui/material";

import Form from "@/app/admin/ticket/components/DrawerTicket/From";
import Messages from "@/app/admin/ticket/components/DrawerTicket/Messages";

export interface DrawerTicketProps {
  open: boolean;
  onClose: () => void;
  id: string | null;
}

export function DrawerTicket({ open, onClose, id }: DrawerTicketProps) {
  return (
    <Drawer open={open} onClose={onClose} anchor={"right"} PaperProps={{ sx: { width: "100%", maxWidth: "65rem" } }}>
      <Form handlerCloseDrawer={onClose} id={id} />
      <Messages id={id} />
    </Drawer>
  );
}

export default DrawerTicket;
