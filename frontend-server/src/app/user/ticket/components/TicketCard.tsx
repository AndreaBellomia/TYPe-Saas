import { styled } from "@mui/material/styles";

import { Typography, Box, Paper, Chip, Grid } from "@mui/material";

import { dateParser } from "@/libs/utils";

import { Ticket } from "@/models/Ticket";

export enum TicketStatus {
  TODO = "Non incominciato",
  INPROGRESS = "In lavorazione",
  BLOCKED = "Bloccato",
  COMPLETED = "Completato",
}

const CustomPaper = styled(Paper)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}));

function getStatusChip(status: string) {
  switch (status) {
    case "todo":
    case "backlog":
      return <Chip label="Programmato" color="secondary" size="small" />;
    case "progress":
      return <Chip label="In lavorazione" color="warning" size="small" />;
    case "blocked":
      return <Chip label="Bloccato" color="error" size="small" />;
    case "done":
      return <Chip label="Completato" color="primary" size="small" />;
    default:
      return <Chip label="Errore" color="error" size="small" />;
  }
}

interface ComponentProps {
  data: Ticket;
}

export default function _({ data }: ComponentProps) {
  let descriptionCut = data.description;

  if (descriptionCut.length > 99) {
    descriptionCut = descriptionCut.slice(0, 99) + "...";
  }

  return (
    <>
      <CustomPaper elevation={4} sx={{ padding: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            {getStatusChip(data.status)}
          </Grid>
          <Grid item xs={6} textAlign="end">
            <Typography variant="caption" color="text.secondary">
              {dateParser(data.created_at)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" color="initial">
              {data.label}
            </Typography>
            <Typography variant="body2" color="initial">
              {descriptionCut || "--"}
            </Typography>
          </Grid>
        </Grid>
        {/* <Typography variant="body1" color="initial">{descriptionCut || "--"}</Typography>

                  <Typography variant="h5" color="initial">{label}</Typography>
                  <Typography variant="body2" color="text.secondary">Guarda il dettaglio</Typography> */}
      </CustomPaper>
    </>
  );
}
