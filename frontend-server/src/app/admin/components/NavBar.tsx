"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "@/redux/store";

import { styled, lighten } from "@mui/material/styles";

import { Box, CssBaseline, Toolbar, ButtonBase, Backdrop, Typography, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import SortIcon from "@mui/icons-material/Sort";
import SettingsIcon from "@mui/icons-material/Settings";

import AsideNavbar from "@/app/admin/components/AsideNavbar";
import ProfileMenu from "@/app/admin/components/ProfileMenu";

import Avatar from "@/components/Avatar";
import NotificationMenu from "@/components/NotificationMenu";
import { useSession } from "next-auth/react";

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

const BlockBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function _({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.navbar.collapsed);
  const session = useSession();

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const [notificationMenu, setNotificationMenu] = React.useState(false);

  const [profileMenu, setProfileMenu] = React.useState(false);
  const appBarRef = useRef(null);

  const user = session.data?.user_data;

  const handlerSidebarToggle = () => {
    dispatch({ type: "TOGGLE_NAVBAR" });
  };

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              <Box display="flex">
                <NotificationMenu
                  open={notificationMenu}
                  handlerOpen={setNotificationMenu}
                  anchorEl={appBarRef.current}
                />

                <Box m={1} />

                <ProfileButton
                  onClick={() => {
                    setProfileMenu(true);
                  }}
                >
                  {user && <Avatar user={user} dimension={24} collapsed></Avatar>}

                  <Box m={0.5} />

                  <SettingsIcon color="primary" />
                </ProfileButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <ProfileMenu open={profileMenu} handlerOpen={setProfileMenu} anchorEl={appBarRef.current} />

        <AsideNavbar />

        <BlockBackdrop open={windowDimensions.width < 800}>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography variant="h4" color="white">
              Display non supportato
            </Typography>

            <Typography variant="subtitle2" color="white">
              Per funzionare correttamente <br /> è necessario uno schermo di almeno 800px
            </Typography>
          </Box>
        </BlockBackdrop>

        {windowDimensions.width > 800 && <Main open={collapsed}>{children}</Main>}
      </Box>
    </>
  );
}
