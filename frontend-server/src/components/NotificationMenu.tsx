"use client";

import { Menu, Typography, Box, List, ListItem, IconButton, Badge } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import { useDjangoApi, FetchDispatchError } from "@/libs/fetch";
import { useEffect, useMemo, useState } from "react";
import { NotificationModel } from "@/models/Notifications";
import { snack } from "@/libs/SnakClient";
import { timeElapsed } from "@/libs/utils";

export interface ProfileMenuProps {
  open: boolean;
  handlerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: Element | null;
}

export function ProfileMenu({ open, handlerOpen, anchorEl }: ProfileMenuProps) {
  const [notification, setNotifications] = useState([]);
  const notificationCount = useMemo(() => notification.length, [notification]);

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
        setNotifications([]);
      },
      (error) => {
        throw new FetchDispatchError("errore nel recupero delle notifiche ");
      },
    );
  };

  return (
    <>
      <IconButton aria-label="delete" onClick={() => handlerOpen(true)}>
        <Badge badgeContent={notificationCount} color="error" overlap="circular">
          {notification.length > 0 ? <NotificationsActiveIcon color="primary" /> : <NotificationsIcon />}
        </Badge>
      </IconButton>

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
        <Box paddingY={1}>
          <Box paddingX={2} marginBottom={1} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle1" color="text.secondary" marginRight={1}>
                Notifiche
              </Typography>
              {notificationCount > 0 && (
                <Typography variant="subtitle1" color="error">
                  {notificationCount}
                </Typography>
              )}
            </Box>

            <IconButton onClick={() => handlerDeleteNotification()} color="error" size="small">
              <CancelRoundedIcon />
            </IconButton>
          </Box>

          <List sx={{ minWidth: "15rem", maxWidth: "25rem", maxHeight: "18rem", overflow: "auto", padding: 0 }}>
            {notification.length > 0 ? (
              notification.map((e: NotificationModel, index) => (
                <ListItem
                  disablePadding
                  key={e.id}
                  sx={(theme) => ({
                    backgroundColor: theme.palette.grey[200],
                    ...(index !== 0 && { marginTop: 0.5 }),
                    ...(index !== notification.length - 1 && { marginBottom: 0.5 }),
                  })}
                >
                  <Box position="relative" height="100%" top="50%" padding={1}>
                    <ConfirmationNumberIcon color="primary" />
                  </Box>
                  <Box padding={1} width="100%">
                    <Box display="flex" height="100%">
                      <Typography variant="body2" color="initial">
                        {e.message}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="end">
                      <Typography variant="caption" color="error">
                        {timeElapsed(e.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Box textAlign="center" padding={2}>
                <Typography variant="body2" color="initial">
                  Non ci sono nuove notifiche
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      </Menu>
    </>
  );
}

export default ProfileMenu;
