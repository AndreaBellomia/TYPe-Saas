import React from "react";
import { Paper, Typography, Box } from "@mui/material";

import Avatar from "@/components/Avatar";

export interface TicketCardProps {
  title: string;
  user: any;
  description: string;
}

export function TicketCard({ title, user, description }: TicketCardProps) {
  const formattedDesc = description && description.length >= 250 ? description.slice(0, 247) + "..." : description;

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2, cursor: "pointer", overflow: "hidden" }}>
        <Typography gutterBottom variant="h6" sx={{ textTransform: "capitalize" }}>
          {title}
        </Typography>
        <Typography variant="body2">{formattedDesc}</Typography>
        <Box sx={{ my: 2 }}></Box>
        <Avatar user={user} dimension={24} typographyProps={{ variant: "body1" }} />
      </Paper>
    </>
  );
}

export default TicketCard;
