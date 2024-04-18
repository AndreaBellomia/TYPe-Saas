"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { styled, lighten } from "@mui/material/styles";

import { Typography, Box, List, ListItem } from "@mui/material";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Button, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";

const drawerWidth = 240;
const drawerMinWidth = 62;

interface MuiDrawer extends MuiDrawerProps {
  open?: boolean;
}
const AsideNavBar = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<MuiDrawer>(({ theme, open }) => ({
  zIndex: 100,
  width: drawerMinWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),

  "& .MuiPaper-root": {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),

    with: "100%",
    position: "relative",
  },

  ...(open && {
    width: drawerWidth,
  }),

  ...(!open && {
    "& .MuiListItemText-root": {
      opacity: 0,
      width: 0,
    },
    "& .MuiListItemIcon-root": {
      width: 24,
    },
  }),
}));

interface ButtonProps extends MuiButtonProps {
  open?: boolean;
  active?: boolean;
}
const AsideButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "active",
})<ButtonProps>(({ theme, open, active }) => ({
  width: "100%",
  textAlign: "start",
  justifyContent: "start",
  padding: "8px 8px",
  minWidth: "initial",
  textTransform: "initial",

  "& .MuiSvgIcon-root": {
    marginRight: 10,
  },

  "& .MuiTypography-root": {
    ...(open && {
      marginRight: 12,
    }),
    ...(!open && {
      overflow: "hidden",
    }),
  },

  ...(active && {
    backgroundColor: lighten(theme.palette.primary.main, 0.7),
    "&:hover": {
      backgroundColor: lighten(theme.palette.primary.main, 0.6),
    },
  }),
}));

const navBarUrl = [
  {
    name: "Utenti",
    url: "/admin/users",
    icon: <AssignmentIndRoundedIcon color="primary" />,
  },
  {
    name: "Board",
    url: "/admin/ticket/board",
    icon: <DashboardRoundedIcon color="primary" />,
  },
  {
    name: "Backlog",
    url: "/admin/ticket/backlog",
    icon: <StickyNote2RoundedIcon color="primary" />,
  },
];

export function AsideNavbar() {
  const pathname = usePathname();
  const collapsed = useSelector((state: RootState) => state.navbar.collapsed);

  return (
    <AsideNavBar variant="permanent" anchor="left" open={collapsed}>
      <Box sx={{ marginTop: "64px" }}></Box>

      <List>
        {navBarUrl &&
          navBarUrl.map((e, index) => (
            <ListItem key={index} sx={{ padding: "4px 10px" }}>
              <AsideButton
                href={e.url}
                open={collapsed}
                active={pathname === e.url}
              >
                {e.icon}
                <Typography variant="subtitle2" color="primary.dark">
                  {e.name}
                </Typography>
              </AsideButton>
            </ListItem>
          ))}
      </List>
    </AsideNavBar>
  );
}

export default AsideNavbar;
