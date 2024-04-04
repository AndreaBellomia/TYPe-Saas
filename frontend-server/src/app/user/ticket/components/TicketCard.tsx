

import {
    Typography,
    Box,
    Paper,
    Chip
} from "@mui/material";

import { Ticket } from "@/types";


export enum TicketStatus {
    TODO = "Non incominciato",
    INPROGRESS = "In lavorazione",
    BLOCKED = "Bloccato",
    COMPLETED = "Completato"
}

function getStatusChip(status: string) {
  switch (status) {
    case "todo":
    case "backlog":
      return <Chip label="Programmato" color="secondary" />
    case "progress":
      return <Chip label="In lavorazione" color="info" />
    case "blocked":
      return <Chip label="Bloccato" color="warning" />
    case "done":
      return <Chip label="Completato" color="success" />
    default:
      return <Chip label="Errore" color="error" />
  }
    
}

interface ComponentProps {
    label : string
    description: string
    status: Ticket["status"]
}

export default function _({ label, description, status }: ComponentProps) {

    let descriptionCut = description

    if (descriptionCut.length > 50) {
        descriptionCut = descriptionCut.slice(0, 99)
    }

    return (
        <>
            <Paper elevation={4}>
                <Box sx={{ p:2 }}>
                  <Typography variant="h5" color="initial">{label}</Typography>
                  <Typography variant="body1" color="initial">{descriptionCut || "--"}</Typography>
                  {getStatusChip(status)}
                </Box>
            </Paper>
        </>
    )
}