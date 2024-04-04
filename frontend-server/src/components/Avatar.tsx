import { styled } from "@mui/material/styles";
import { Paper, Typography, Box, Avatar } from "@mui/material";

import { SmallUser } from "@/types";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  height: 30,
  width: 30,
  fontSize: theme.typography.body2.fontSize,
}));

export interface AvatarProps {
  user: SmallUser;
}

function CustomAvatar({ user }: AvatarProps) {
  if (!user) {
    return (
      <Typography variant="body2" color="text.secondary">
        nessuno
      </Typography>
    );
  }

  const avatarName: string | null =
    user.first_name && user.last_name
      ? user.first_name[0] + user.last_name[0]
      : null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <StyledAvatar
        sx={{
          mr: 1,
        }}
      >
        {avatarName}
      </StyledAvatar>
      <Box sx={{ overflow: "hidden" }}>
        <Typography variant="body1" color="text.primary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}

export default CustomAvatar;
