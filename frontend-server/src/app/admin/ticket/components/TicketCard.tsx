import React from "react";
import { Paper, Typography, Box } from "@mui/material";

import Avatar from "@/components/Avatar";

interface ComponentsProps {
  title: string;
  user: any;
  description: string;
}

export default function _({ title, user, description }: ComponentsProps) {
  const formattedDesc =
    description.length >= 40 ? description.slice(0, 48) + "..." : description;

  return (
    <>
      <Paper elevation={3} sx={{ p: 2, cursor: "pointer", overflow: "hidden" }}>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
          {title}
        </Typography>
        <Typography variant="body2">{formattedDesc}</Typography>
        <Box sx={{ my: 2 }}></Box>
        <Avatar user={user} dimension={30} typographyProps={{ variant: "body1" }}/>
      </Paper>
    </>
  );
}
