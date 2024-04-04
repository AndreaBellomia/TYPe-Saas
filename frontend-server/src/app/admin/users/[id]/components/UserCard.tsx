import { Typography, Box, Paper, Divider } from "@mui/material";

import Avatar from "@/components/Avatar";

import { User, SmallUser } from "@/types";

function UserCardComponent ({ user }:{ user: User }) {
  const avatarUser: SmallUser = {
    email: user.email,
    id: user.id ,
    first_name: user.user_info?.first_name || null,
    last_name: user.user_info?.first_name || null,
  };

  return (
    <>
      <Paper elevation={5}>
        <Box sx={{ p:2 }}>
          <Avatar user={avatarUser} dimension={50} typography="h5"/>
          <Divider sx={{ my: 2 }}/>

          <Typography variant="subtitle1" color="initial">Nome: {user.user_info && user.user_info.first_name}</Typography>
          <Typography variant="subtitle1" color="initial">Cognome: {user.user_info && user.user_info.last_name}</Typography>
        </Box>
      </Paper>
    </>
  )
}

export default UserCardComponent