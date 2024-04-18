"use client";
import React, { useEffect, useRef, useState } from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";

import ColumnBoard from "@/app/admin/ticket/board/components/Column";
import DrawerTicket from "@/app/admin/ticket/components/DrawerTicket"

import { TICKET_STATUSES } from "@/constants";

import { DjangoApi } from "@/libs/fetch";

const API = new DjangoApi();

function handlerMoveCard(data: any) {
  const oldStatus = data.targetData.node.data.value.status;
  const newStatus = data.targetData.parent.data.config.name;

  if (oldStatus !== newStatus) {
    API.put(
      "/ticket/admin/update_board/",
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
  const [modalTicket, setModalTicket] = useState(false)
  const [modalTicketDetail, setModalTicketDetail] = useState<null | string>(null)
  const [boardItems, setBoardItems] = useState({
    todo: [],
    progress: [],
    blocked: [],
    done: [],
  });

  useEffect(() => {
    API.get(
      "/ticket/admin/board/",
      (response) => {
        // console.log(response)
        setBoardItems(response.data);
      },
      (e) => {
        console.error(e);
      },
    );
  }, []);


  const handlerOpenModal = (id: string | null): void => {
    console.log(id)
    if (id) {
      setModalTicketDetail(id)
    } else {
      setModalTicketDetail(null)
    }
    setModalTicket(true)
  }

  return (
    <>
      <DrawerTicket open={modalTicket} onClose={() => setModalTicket(false)} id={modalTicketDetail}/>
      {/* <ModalTicketBasic modalStatus={[modalTicket, setModalTicket]} detailId={modalTicketDetail} /> */}
      <Box
        sx={{
          display: "flex",
          height: "100%",
          position: "relative",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h4" color="initial">
          
        </Typography>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="To Do"
              name={TICKET_STATUSES.TODO}
              columnData={boardItems.todo}
              handleEnd={handlerMoveCard}
              handleCard={handlerOpenModal}
            />
          </Grid>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="Progress"
              name={TICKET_STATUSES.PROGRESS}
              columnData={boardItems.progress}
              handleEnd={handlerMoveCard}
              handleCard={handlerOpenModal}
            />
          </Grid>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="Blocked"
              name={TICKET_STATUSES.BLOCKED}
              columnData={boardItems.blocked}
              handleEnd={handlerMoveCard}
              handleCard={handlerOpenModal}
            />
          </Grid>
          <Grid item xs={3}>
            <ColumnBoard
              groupName="board"
              header="Completed"
              name={TICKET_STATUSES.DONE}
              columnData={boardItems.done}
              handleEnd={handlerMoveCard}
              handleCard={handlerOpenModal}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
