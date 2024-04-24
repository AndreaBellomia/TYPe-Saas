"use client";

import React, { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  Box,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { User } from "@/types";

import { StyledAvatar } from "@/components/Avatar";

import { AuthUtility } from "@/libs/auth";
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
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const [profileMenu, setProfileMenu] = React.useState(false);
  const appBarRef = useRef(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenu(true);
  };

  const handlerLogOut = async () => {
    const response = await AuthUtility.logoutUser();
    router.push("/authentication/login");
  };

  return (
    <>
      <CustomAppBar position="static">
        <Container ref={appBarRef} >
          <CustomToolbar
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box>
              <Button color="inherit" href="/user/ticket">
                Ticket
              </Button>
            </Box>

            <Box>
              <StyledAvatar onClick={handleClick}></StyledAvatar>
              <ProfileMenu
                  open={profileMenu}
                  handlerOpen={setProfileMenu}
                  anchorEl={appBarRef.current}
                />
            </Box>
          </CustomToolbar>
        </Container>
      </CustomAppBar>
      <Box sx={{ my: 2 }} />

      <Container>{children}</Container>
    </>
  );
}

export default NavBar;
