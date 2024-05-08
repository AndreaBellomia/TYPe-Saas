"use client";

import React, { useRef } from "react";

import { styled } from "@mui/material/styles";
import { Button, AppBar, Toolbar, Box, Container, ButtonBase, IconButton } from "@mui/material";

import { StyledAvatar } from "@/components/Avatar";
import ProfileMenu from "@/app/user/components/ProfileMenu";
import NotificationMenu from "@/components/NotificationMenu";

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
}));
const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  padding: "0 !important",
}));

function NavBar({ children }: { children: React.ReactNode }) {
  const [profileMenu, setProfileMenu] = React.useState(false);
  const [notificationMenu, setNotificationMenu] = React.useState(false);
  const appBarRef = useRef(null);

  const handleClickProfileMenu = () => {
    setProfileMenu(true);
  };
  return (
    <>
      <CustomAppBar position="fixed">
        <Container ref={appBarRef}>
          <CustomToolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Button color="inherit" href="/user/ticket">
                Ticket
              </Button>
            </Box>

            <Box display="flex">
              <NotificationMenu open={notificationMenu} handlerOpen={setNotificationMenu} anchorEl={appBarRef.current} />

              <Box m={1} />

              <ButtonBase onClick={() => handleClickProfileMenu()} sx={{ borderRadius: 100 }}>
                <StyledAvatar></StyledAvatar>
              </ButtonBase>
              <ProfileMenu open={profileMenu} handlerOpen={setProfileMenu} anchorEl={appBarRef.current} />
            </Box>
          </CustomToolbar>
        </Container>
      </CustomAppBar>
      <Box sx={{ mt: 10 }} />

      <Container>{children}</Container>
    </>
  );
}

export default NavBar;
