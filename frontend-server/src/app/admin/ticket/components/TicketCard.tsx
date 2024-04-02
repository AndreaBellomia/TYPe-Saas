import React from "react";
import { Paper, Typography, Box, Avatar } from '@mui/material';

function userAvatarComponent(user: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    id: string | number | null;
  }) {
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
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            mr: 1,
            width: 30,
            height: 30,
            fontSize: 15,
          }}
        >
          {avatarName}
        </Avatar>
  
        <Typography variant="body1" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
    );
  }
  


export default function _({ title, user }: { title: string, user: any}) {
    return (
        <>
        <Paper elevation={5} sx={{ p: 2 }}>
            <Typography variant="h6">{title}</Typography>
            {userAvatarComponent(user)}
        </Paper>
        
        </>
    )
}