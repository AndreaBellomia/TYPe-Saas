import { styled } from "@mui/material/styles";
import { Paper, Box } from "@mui/material";

import Avatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import Typography, { TypographyProps } from "@mui/material/Typography";

import { SmallUser } from "@/types";

interface CustomAvatarProps extends MuiAvatarProps {
  dimension?: number;
}

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "dimension",
})<CustomAvatarProps>(({ theme, dimension }) => ({
  backgroundColor: theme.palette.primary.light,
  ...(dimension && {
    height: dimension,
    width: dimension,
    fontSize: dimension / 1.9,
  }),
}));

export interface AvatarProps {
  user: SmallUser;
  dimension: number;
  typography?: TypographyProps["variant"]
}

function CustomAvatar({ user, dimension, typography }: AvatarProps) {
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
        dimension={dimension}
        sx={{
          mr: 1,
        }}
      >
        {avatarName}
      </StyledAvatar>
      <Box sx={{ overflow: "hidden" }}>
        <Typography variant={typography || "body1"} color="text.primary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}

export default CustomAvatar;
