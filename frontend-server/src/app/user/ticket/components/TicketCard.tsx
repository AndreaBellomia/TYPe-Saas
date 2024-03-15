

import {
    TextField,
    Button,
    Autocomplete,
    Typography,
    Container,
    Grid,
    Paper,
} from "@mui/material";


export enum TicketStatus {
    TODO = "Non incominciato",
    INPROGRESS = "In lavorazione",
    BLOCKED = "Bloccato",
    COMPLETED = "Completato"
}

interface ComponentProps {
    label : string
    description: string
    status: TicketStatus
}

export default function _({ label, description, status }: ComponentProps) {

    let descriptionCut = description

    if (descriptionCut.length > 100) {
        descriptionCut = descriptionCut.slice(0, 99)
    }

    return (
        <>
            <Paper elevation={4}>
                <Typography variant="h5" color="initial">{label}</Typography>
                <Typography variant="body1" color="initial">{descriptionCut}</Typography>
                <Typography variant="h5" color="initial">{status}</Typography>
            </Paper>
        </>
    )
}