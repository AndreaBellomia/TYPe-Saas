"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { User } from "@/types";
import { RootState } from "@/redux/store";

import {
  Menu,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import { AuthUtility } from "@/libs/auth";

export interface ProfileMenuProps {
  open: boolean;
  handlerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: Element | null;
}

export function ProfileMenu({ open, handlerOpen, anchorEl }: ProfileMenuProps) {
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const handlerLogout = () => {
    handlerOpen(false);
  };

  const handlerLogOut = async () => {
    const response = await AuthUtility.logoutUser();
    router.push("/authentication/login");
    handlerOpen(false);
  };

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
        anchorEl={anchorEl}
      >
        <Box p={2}>
          <Box display="flex">
            <Typography variant="subtitle1" color="initial" mr={1}>
              Benvenuto:{" "}
            </Typography>
            <Typography variant="subtitle1" color="initial" fontWeight={400}>
              {user?.user_info?.first_name} {user?.user_info?.last_name}
            </Typography>
          </Box>
          <Typography variant="overline" color="initial">
            {user?.is_staff && "admin"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            onClick={handlerLogout}
            sx={{ justifyContent: "start", mb: 1 }}
          >
            <SettingsIcon sx={{ mr: 2 }} />
            Impostazioni
          </Button>
          <Button
            fullWidth
            onClick={handlerLogOut}
            sx={{ justifyContent: "start" }}
          >
            <LogoutRoundedIcon sx={{ mr: 2 }} />
            Logout
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default ProfileMenu;