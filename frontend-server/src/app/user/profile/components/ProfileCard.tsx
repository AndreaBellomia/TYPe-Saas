import { Paper, Box, Grid, Chip, TextField, Button } from "@mui/material";
import Avatar from "@/components/Avatar";
import { GROUPS_MAPS } from "@/constants";
import { User } from "@/types";

export interface ProfileCardProps {
  user: User | null;
}

function ProfileCard({ user }: ProfileCardProps) {
  return (
    <>
      <Paper elevation={5} sx={{ width: "100%" }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              {user && (
                <Avatar
                  user={user}
                  dimension={60}
                  typographyProps={{ variant: "h4" }}
                />
              )}
            </Grid>
            <Grid item xs={6} textAlign="end" alignSelf="center">
              {user &&
                (user.is_active ? (
                  <Chip label="Attivo" color="success" />
                ) : (
                  <Chip label="Non attivo" color="warning" />
                ))}

              {user && user.is_staff && <Chip label="Staff" color="info" />}

              {user &&
                user.groups.map((e, i) => (
                  <Chip label={GROUPS_MAPS[e]} color="secondary" key={i} />
                ))}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Nome"
                variant="outlined"
                sx={{ width: "100%" }}
                value={(user && user.user_info?.first_name) || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Cognome"
                variant="outlined"
                sx={{ width: "100%" }}
                value={(user && user.user_info?.last_name) || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Numero di telefono"
                variant="outlined"
                sx={{ width: "100%" }}
                value={(user && user.user_info?.phone_number) || ""}
              />
            </Grid>
            <Grid item xs={12} textAlign="end">
              <Button variant="contained"> Aggiorna </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}

export default ProfileCard;
