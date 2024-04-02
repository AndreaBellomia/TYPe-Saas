"use client";
import React, { useEffect, useRef, useState } from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";

import ColumnBoard from "@/app/admin/ticket/board/components/Column";

import { TICKET_STATUSES } from "@/constants";

import { DjangoApi } from "@/libs/fetch";

const API = new DjangoApi();

function handlerMoveCard(data: any) {
  const oldStatus = data.targetData.node.data.value.status;
  const newStatus = data.targetData.parent.data.config.name;

  if (oldStatus !== newStatus) {
    API.put(
      "/ticket/admin/tickets/board",
      (response) => {
        data.targetData.node.data.value.status = newStatus
      },
      (e) => {
        console.error(e);
      },
      {
        id: data.targetData.node.data.value.id,
        status: newStatus,
      },
    );
  }
}

export default function _() {
  const [boardItems, setBoardItems] = useState({
    todo: [],
    progress: [],
    blocked: [],
    done: [],
  });

  useEffect(() => {
    API.get(
      "/ticket/admin/tickets/board",
      (response) => {
        // console.log(response)
        setBoardItems(response.data);
      },
      (e) => {
        console.error(e);
      },
    );
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          boxSizing: "border-box",
          margin: 2,
        }}
      >
        <Typography variant="h1" color="initial">
          Board
        </Typography>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="To Do"
              name={TICKET_STATUSES.TODO}
              columnData={boardItems.todo}
              handleEnd={handlerMoveCard}
            />
          </Grid>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="Progress"
              name={TICKET_STATUSES.PROGRESS}
              columnData={boardItems.progress}
              handleEnd={handlerMoveCard}
            />
          </Grid>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="Blocked"
              name={TICKET_STATUSES.BLOCKED}
              columnData={boardItems.blocked}
              handleEnd={handlerMoveCard}
            />
          </Grid>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="Completed"
              name={TICKET_STATUSES.DONE}
              columnData={boardItems.done}
              handleEnd={handlerMoveCard}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
