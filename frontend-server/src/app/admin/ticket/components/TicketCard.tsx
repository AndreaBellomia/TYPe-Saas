import React from "react";
import { Paper, Typography } from '@mui/material';


export default function _({ title }: { title: string}) {
    return (
        <>
        <Paper elevation={5}>
        <Typography variant="h6">{title}</Typography>
        </Paper>
        
        </>
    )
}