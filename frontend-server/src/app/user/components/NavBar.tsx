"use client";

import React, { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Typography, Button, AppBar, Toolbar, Box, Container, ButtonBase, Menu, MenuItem } from "@mui/material";

import { styled } from "@mui/material/styles";
import { UserModel } from "@/models/User";

import { StyledAvatar } from "@/components/Avatar";

import { logoutUser } from "@/libs/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import ProfileMenu from "@/app/user/components/ProfileMenu";

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
}));
const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  padding: "0 !important",
}));

function NavBar({ children }: { children: React.ReactNode }) {
  const user: UserModel | null = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const [profileMenu, setProfileMenu] = React.useState(false);
  const appBarRef = useRef(null);

  const handleClick = () => {
    setProfileMenu(true);
  };

  const handlerLogOut = async () => {
    const response = await logoutUser();
    router.push("/authentication/login");
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

            <Box>
              <ButtonBase onClick={() => handleClick()} sx={{ borderRadius: 100 }}>
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
