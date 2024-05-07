"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { UserModel } from "@/models/User";
import { RootState } from "@/redux/store";

import { Menu, Typography, Box, Button, Divider, List, ListItem, ListItemText, ListItemButton } from "@mui/material";

import { useDjangoApi, FetchDispatchError } from "@/libs/fetch";
import { useEffect, useState } from "react";
import { NotificationModel } from "@/models/Notifications";
import { snack } from "@/libs/SnakClient";

export interface ProfileMenuProps {
  open: boolean;
  handlerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: Element | null;
}

export function ProfileMenu({ open, handlerOpen, anchorEl }: ProfileMenuProps) {
  const user: UserModel | null = useSelector((state: RootState) => state.user.user);
  const [notification, setNotifications] = useState([]);

  const router = useRouter();

  const api = useDjangoApi();

  useEffect(() => {
    api.get(
      "/notification/to_read/",
      (response) => {
        setNotifications(response.data);
      },
      (error) => {
        throw new FetchDispatchError("errore nel recupero delle notifiche ");
      },
    );
  }, []);

  const handlerDeleteNotification = () => {
    api.post(
      "/notification/set_read/",
      (response) => {
        snack.success("Notifiche lette");
        setNotifications([])
      },
      (error) => {
        throw new FetchDispatchError("errore nel recupero delle notifiche ");
      },
    );
  }

  return (
    <>
      <Menu
        id="basic-menu"
        open={open}
        onClose={() => handlerOpen(false)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
      >
        <Box>
          <Box textAlign="center">
            <Typography variant="h6" color="initial">Notifiche</Typography>
          </Box>

          <List sx={{ width:  "18rem" }}>
            {notification.length > 0 ? notification.map((e: NotificationModel) => (
              <ListItem disablePadding key={e.id} >
                <Box sx={{ paddingY: 1, paddingX: 2 }}>
                  <Typography variant="body2" color="initial">{e.message}</Typography>
                </Box>
              </ListItem>
            )) : 
            <Box textAlign="center">
              <Typography variant="body2" color="initial">Nessuna notifica da visualizzare</Typography>
            </Box>
            }

            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary="Segna come lette" onClick={() => handlerDeleteNotification()} />
              </ListItemButton>
            </ListItem>
          </List>
          
        </Box>
      </Menu>
    </>
  );
}

export default ProfileMenu;
