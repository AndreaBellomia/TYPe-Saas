import React from "react";

import { Drawer } from "@mui/material";

import { DrawerForm, DrawerFormProps } from "@/app/admin/ticket/components/DrawerTicket/From";
import Messages from "@/app/admin/ticket/components/DrawerTicket/Messages";

export interface DrawerTicketProps {
  open: boolean;
  onClose: () => void;
  initial: DrawerFormProps["initial"]
}

export function DrawerTicket({ open, onClose, initial }: DrawerTicketProps) {
  return (
    <Drawer open={open} onClose={onClose} anchor={"right"} PaperProps={{ sx: { width: "100%", maxWidth: "65rem" } }}>
      <DrawerForm handlerCloseDrawer={onClose} initial={initial} />
      <Messages id={initial.id} />
    </Drawer>
  );
}

export default DrawerTicket;
