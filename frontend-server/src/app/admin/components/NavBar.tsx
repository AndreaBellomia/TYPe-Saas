"use client";
import React, { useRef, useState, useEffect } from "react";

import { useSelector, useDispatch } from 'react-redux';

import { UserType } from "@/types";
import { RootState } from "@/redux/store"

import { styled } from "@mui/material/styles";

import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  CssBaseline,
  Toolbar,
  IconButton,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';


const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  marginTop: 64,
  padding: theme.spacing(2),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<CustomAppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  color: "white",
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
  backgroundColor: theme.palette.neutral.main
}));

const navBarUrl = [
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

export default function _({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: UserType;
}>) {


  const collapsed = useSelector((state: RootState) => state.navbar.collapsed);
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    dispatch({type: "OPEN"})
  };

  const handleDrawerClose = () => {
    dispatch({type: "CLOSE"})
  };

  return (
    <>
      <Box sx={{ display: "flex", flexGrow: 1, height: "100%" }}>
        <CssBaseline />

        <AppBar color="neutral" position="fixed" open={collapsed}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                widows: "100%",
              }}
            >
              <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(collapsed && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                widows: "100%",
              }}
            >
              <Box>
                <Typography variant="h6" noWrap component="div">
                  {user && user.email}
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={collapsed}
          PaperProps={{
            sx: {border: 0},
            elevation: 5
          }}
        >
          <DrawerHeader>
            <Typography variant="h6" noWrap color="white">
                Admin
            </Typography>
            <IconButton onClick={handleDrawerClose} color="primary">
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>

          <List>
            {navBarUrl &&
              navBarUrl.map((e, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton href={e.url}>
                    <ListItemIcon >{e.icon}</ListItemIcon>
                    <ListItemText primary={e.name} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Drawer>
        <Main open={collapsed}>{children}</Main>
      </Box>
    </>
  );
}
