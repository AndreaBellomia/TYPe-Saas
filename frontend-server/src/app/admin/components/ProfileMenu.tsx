"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Menu, Typography, Box, Button, Divider } from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { singOut } from "@/libs/auth";

export interface ProfileMenuProps {
  open: boolean;
  handlerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: Element | null;
}

export function ProfileMenu({ open, handlerOpen, anchorEl }: ProfileMenuProps) {
  const session = useSession()
  const user = session.data?.user_data;
  const router = useRouter();

  const handlerUser = () => {
    router.push("/user/ticket");
    handlerOpen(false);
  };

  const handlerSettings = () => {
    router.push("/user/profile");
    handlerOpen(false);
  };

  const handlerLogOut = async () => {
    singOut(session)
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

          <Button fullWidth onClick={handlerUser} sx={{ justifyContent: "start", mb: 1 }}>
            <SupervisedUserCircleIcon sx={{ mr: 2 }} />
            Utente
          </Button>
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
