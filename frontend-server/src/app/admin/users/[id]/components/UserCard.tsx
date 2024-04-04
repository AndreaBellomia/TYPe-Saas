import { Typography, Box, Paper, Divider, Grid, Chip } from "@mui/material";

import Avatar from "@/components/Avatar";

import { GROUPS_MAPS } from "@/constants"

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
          <Grid container>
            <Grid item xs={10}>
              <Avatar user={avatarUser} dimension={50} typographyProps={{ variant: "h5" }}/>
            </Grid>
            <Grid item xs={2} textAlign="end">
              <Chip
                label={user.is_active ? "Attivo" : "Non attivo"}
                color={user.is_active ? "primary" : "error"}
              />
            </Grid>
          </Grid>
          

          <Divider sx={{ my: 2 }}/>

          <Typography variant="subtitle1" color="initial">Nome: {user.user_info && user.user_info.first_name}</Typography>
          <Typography variant="subtitle1" color="initial">Cognome: {user.user_info && user.user_info.last_name}</Typography>

          <Box sx={{ my: 2 }}></Box>
          {
            user && user.groups.map((element) => <Chip
            label={GROUPS_MAPS[element]}
            color="secondary"
            key={element}
          />)
          }
          
        </Box>
      </Paper>
    </>
  )
}

export default UserCardComponent