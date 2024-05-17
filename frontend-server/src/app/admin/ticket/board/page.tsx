"use client";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Typography, Box, Grid } from "@mui/material";

import ColumnBoard from "@/app/admin/ticket/board/components/Column";
import DrawerTicket from "@/app/admin/ticket/components/DrawerTicket";

import { useDjangoApi } from "@/libs/fetch";
import { Statuses, StatusesType } from "@/models/Ticket";

interface FormReducerState {
  id: string | null;
  state: StatusesType | null;
}

type FormReducerAction = { type: "SET"; payload: { key: keyof FormReducerState; value: any } } | { type: "CLEAR" };

function ticketFormReducer(state: FormReducerState, action: FormReducerAction): FormReducerState {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "CLEAR":
      return Object.keys(state).reduce((acc, key) => {
        acc[key as keyof FormReducerState] = null;
        return acc;
      }, {} as FormReducerState);
    default:
      return state;
  }
}

export default function _() {
  const api = useDjangoApi();

  function handlerMoveCard(data: any) {
    const oldStatus = data.targetData.node.data.value.status;
    const newStatus = data.targetData.parent.data.config.name;

    if (oldStatus !== newStatus) {
      api.put(
        "/ticket/admin/update_board/",
        (response) => {
          data.targetData.node.data.value.status = newStatus;
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

  const [drawerTicket, setDrawerTicket] = useState(false);
  const [initial, dispatch] = useReducer(ticketFormReducer, { id: null, state: null });
  const [boardItems, setBoardItems] = useState({
    [Statuses.TODO]: [],
    [Statuses.PROGRESS]: [],
    [Statuses.BLOCKED]: [],
    [Statuses.DONE]: [],
  });

  const columns: { header: string; name: Exclude<StatusesType, Statuses.BACKLOG> }[] = useMemo(
    () => [
      {
        header: "To Do",
        name: Statuses.TODO,
      },
      {
        header: "Progress",
        name: Statuses.PROGRESS,
      },
      {
        header: "Blocked",
        name: Statuses.BLOCKED,
      },
      {
        header: "Completed",
        name: Statuses.DONE,
      },
    ],
    [],
  );

  useEffect(() => {
    if (!drawerTicket)
      api.get(
        "/ticket/admin/board/",
        (response) => {
          setBoardItems(response.data);
        },
        (e) => {
          console.error(e);
        },
      );
  }, [drawerTicket]);

  const handlerCreateTicket = (state: StatusesType | null): void => {
    dispatch({ type: "CLEAR" });

    if (state) dispatch({ type: "SET", payload: { key: "state", value: state } });
    setDrawerTicket(true);
  };

  const handlerEditModal = (id: string | null): void => {
    dispatch({ type: "CLEAR" });

    if (id) dispatch({ type: "SET", payload: { key: "id", value: id } });
    setDrawerTicket(true);
  };

  return (
    <>
      <DrawerTicket open={drawerTicket} onClose={() => setDrawerTicket(false)} initial={initial} />
      <Box display="flex" height="100%" position="relative" flexDirection="column" boxSizing="border-box">
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h4" color="initial">
            Board
          </Typography>
        </Box>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          {columns.map((col) => (
            <Grid item xs={3} key={col.header}>
              <ColumnBoard
                groupName="board"
                header={col.header}
                name={col.name}
                columnData={boardItems[col.name]}
                handleEnd={handlerMoveCard}
                handleCard={handlerEditModal}
                handleCreate={handlerCreateTicket}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
