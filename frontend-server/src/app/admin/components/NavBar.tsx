"use client";
import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { User } from "@/types";
import { RootState } from "@/redux/store";

import { styled, lighten } from "@mui/material/styles";

import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  ButtonBase,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import SortIcon from "@mui/icons-material/Sort";
import SettingsIcon from "@mui/icons-material/Settings";

import AsideNavbar from "@/app/admin/components/AsideNavbar";
import ProfileMenu from "@/app/admin/components/ProfileMenu";

import Avatar from "@/components/Avatar";

const drawerWidth = 240;
const drawerMinWidth = 62;

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
  marginLeft: drawerMinWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
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
  backgroundColor: theme.palette.grey[800],
  color: "white",
  zIndex: 1000,
}));

const ProfileButton = styled(ButtonBase)<CustomAppBarProps>(({ theme }) => ({
  borderRadius: 1000,
  backgroundColor: lighten(theme.palette.primary.light, 0.6),
  padding: 5,
}));

export default function _({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.navbar.collapsed);
  const user: User | null = useSelector((state: RootState) => state.user.user);

  const [profileMenu, setProfileMenu] = React.useState(false);
  const appBarRef = useRef(null);

  const handlerSidebarToggle = () => {
    dispatch({ type: "TOGGLE_NAVBAR" });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexGrow: 1, height: "100%" }}>
        <CssBaseline />

        <AppBar position="fixed" open={collapsed} ref={appBarRef}>
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
                onClick={handlerSidebarToggle}
                edge="start"
                sx={{ mr: 2 }}
              >
                {collapsed ? <SortIcon /> : <MenuIcon />}
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
                <ProfileButton
                  onClick={() => {
                    setProfileMenu(true);
                  }}
                >
                  {user && (
                    <Avatar user={user} dimension={24} collapsed></Avatar>
                  )}

                  <Box m={0.5} />

                  <SettingsIcon color="primary" />
                </ProfileButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <ProfileMenu
          open={profileMenu}
          handlerOpen={setProfileMenu}
          anchorEl={appBarRef.current}
        />

        <AsideNavbar />
        <Main open={collapsed}>{children}</Main>
      </Box>
    </>
  );
}
