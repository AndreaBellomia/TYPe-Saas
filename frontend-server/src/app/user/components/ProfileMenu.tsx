"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { UserModel } from "@/models/User";
import { RootState } from "@/redux/store";

import { Menu, Typography, Box, Button, Divider } from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { logoutUser } from "@/libs/auth";

export interface ProfileMenuProps {
  open: boolean;
  handlerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: Element | null;
}

export function ProfileMenu({ open, handlerOpen, anchorEl }: ProfileMenuProps) {
  const user: UserModel | null = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const handlerAdmin = () => {
    router.push("/admin/ticket/board");
    handlerOpen(false);
  };

  const handlerSettings = () => {
    router.push("/user/profile");
    handlerOpen(false);
  };

  const handlerLogOut = async () => {
    const response = await logoutUser();
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
        transformOrigin={{
          vertical: "top",
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

          {user?.is_staff && (
            <Button fullWidth onClick={handlerAdmin} sx={{ justifyContent: "start", mb: 1 }}>
              <AdminPanelSettingsIcon sx={{ mr: 2 }} />
              Admin
            </Button>
          )}
          <Button fullWidth onClick={handlerSettings} sx={{ justifyContent: "start", mb: 1 }}>
            <SettingsIcon sx={{ mr: 2 }} />
            Impostazioni
          </Button>
          <Button fullWidth onClick={handlerLogOut} sx={{ justifyContent: "start" }}>
            <LogoutRoundedIcon sx={{ mr: 2 }} />
            Logout
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default ProfileMenu;
