import { Typography, Box, Paper, Chip, Grid } from "@mui/material";
import { useRouter } from 'next/navigation';

import { styled } from "@mui/material/styles";

import Avatar from "@/components/Avatar";
import { User, SmallUser } from "@/types";



const ClickablePaper = styled(Paper)(({ theme }) => ({
  cursor: "pointer",
  "&:hover" : {
    backgroundColor: "#f1f1f4"
  },
  "&:active" : {
    backgroundColor: "#dcdfe4"
  }
}))

function UserCard({ user }: { user: User }) {
  const userInfo = user.user_info;
  const router = useRouter()

  const avatarUser: SmallUser = {
    email: user.email,
    id: user.id,
    first_name: user.user_info?.first_name || null,
    last_name: user.user_info?.first_name || null,
  };

  const avatarName: string | null = userInfo
    ? userInfo.first_name[0] + userInfo.last_name[0]
    : null;

  return (
    <ClickablePaper elevation={5} sx={{ height: "100%", padding: 2 }} onClick={() => {router.push(`/admin/users/${user.id}`)}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid container spacing={2} overflow="hidden">
          <Grid item md={6}>
            <Avatar user={avatarUser} dimension={30} typographyProps={{ variant: "body1" }} />
          </Grid>
          <Grid item md={6} textAlign="end">
            <Chip
              label={user.is_active ? "Attivo" : "Non attivo"}
              color={user.is_active ? "primary" : "error"}
            />
          </Grid>
        </Grid>
      </Box>

      <Box my={2} />

      <Grid container  spacing={0} overflow="hidden">
        <Grid item md={12}>
          <Typography variant="subtitle1">
            {(userInfo && userInfo.first_name) || "--"}{" "}
            {(userInfo && userInfo.last_name) || "--"}
          </Typography>
        </Grid>
        <Grid item md={12}>
          <Typography variant="subtitle1" color="text.secondary">
            Numero di telefono: {(userInfo && userInfo.phone_number) || "--"}
          </Typography>
        </Grid>
      </Grid>
    </ClickablePaper>
  );
}

export default UserCard;
