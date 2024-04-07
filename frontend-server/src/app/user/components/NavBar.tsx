"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { UserType, SmallUser } from "@/types";

import { StyledAvatar } from "@/components/Avatar";

import { AuthUtility } from "@/libs/auth";

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.neutral.dark,
}));
const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  padding: "0 !important",
}));

function NavBar({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserType | undefined;
}) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlerLogOut = async () => {
    const response = await AuthUtility.logoutUser();
    router.push("/authentication/login");
  };

  return (
    <>
      <CustomAppBar position="static">
        <Container>
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
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/admin/ticket/board");
                  }}
                >
                  Admin
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/user/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handlerLogOut}>
                  <Typography variant="body1" color="error">
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
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
