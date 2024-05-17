import React from "react";
import { Paper, Typography, Box } from "@mui/material";

import Avatar from "@/components/Avatar";

export interface TicketCardProps {
  title: string;
  user: any;
  description: string;
  category: string;
}

export function TicketCard({ title, user, description, category }: TicketCardProps) {
  const formattedDesc = description && description.length >= 50 ? description.slice(0, 47) + "..." : description;

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2, cursor: "pointer", overflow: "hidden" }}>
        <Typography variant="caption">{category}</Typography>
        <Typography gutterBottom variant="subtitle1" sx={{ textTransform: "capitalize" }}>
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
