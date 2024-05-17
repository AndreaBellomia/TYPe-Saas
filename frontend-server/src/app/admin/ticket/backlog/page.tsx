"use client";
import React, { useEffect, useRef, useState, useReducer, useMemo } from "react";

import { Pagination, Grid, Button, Box, Paper, Typography, IconButton } from "@mui/material";

import { DjangoApi, useDjangoApi } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";
import { ServerSideTable, tableReducer } from "@/components/ServerSideTable";
import { InputField, StatusField } from "@/components/filters";

import DrawerTicket from "@/app/admin/ticket/components/DrawerTicket";

import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";

import { TICKET_STATUSES } from "@/constants";
import { createColumnHelper } from "@tanstack/react-table";
import { StatusesType, Ticket } from "@/models/Ticket";

import StatusChangeCol from "@/app/admin/ticket/backlog/components/StatusChangeCol";

import { dateParser } from "@/libs/utils";

export default function _() {
  const drawerTicketID = useRef<{ id: string | null; state: StatusesType | null; }>({ id: null, state: null });
  const [drawerTicket, setDrawerTicket] = useState(false);
  const handlerOpenModal = (id: string | null): void => {
    drawerTicketID.current.id = null;
    if (id) {
      drawerTicketID.current.id = id;
    }
    setDrawerTicket(true);
  };

  const api = useDjangoApi();
  const [tableData, setTableData] = useState([]);
  const columnHelper = createColumnHelper<Ticket>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <Box display="flex" flexDirection="column" alignItems="start">
            <Typography variant="body1">{info.row.getValue("id")}</Typography>
            <Typography variant="body1">{info.row.original.label}</Typography>
          </Box>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Stato",
        cell: (info) => <StatusChangeCol initialValue={info.getValue()} id={info.row.getValue("id")} />,
        meta: {
          padding: "none",
        },
        size: 50,
      }),
      columnHelper.accessor("expiring_date", {
        header: "Data scadenza",
        cell: (info) => (
          <Typography variant="subtitle2" color="text.secondary">
            {dateParser(info.getValue())}
          </Typography>
        ),
        size: 10,
      }),
      columnHelper.accessor("id", {
        header: "",
        id: "detail",
        enableSorting: false,
        size: 1,
        cell: (info) => (
          <IconButton onClick={() => handlerOpenModal(String(info.getValue()))}>
            <DragIndicatorRoundedIcon />
          </IconButton>
        ),
        meta: {
          align: "right",
        },
      }),
    ],
    [tableData],
  );

  const [tableState, tableDispatch] = useReducer(tableReducer, {
    page: 1,
    pageCount: 1,
    order: "",
    search: "",
    state: Object.values(TICKET_STATUSES)
      .filter((e) => e === TICKET_STATUSES.BACKLOG)
      .reduce((acc, key) => acc + "," + key),
  });

  useEffect(() => {
    const url: string = DjangoApi.buildURLparams("/ticket/admin/", [
      { param: "ordering", value: tableState.order },
      { param: "search", value: tableState.search },
      { param: "statuses", value: tableState.state },
      { param: "page", value: String(tableState.page) },
    ]);

    api.get(
      url,
      (response) => {
        tableDispatch({ type: "SET_COUNT", payload: response.data.num_pages });
        setTableData(response.data.results);
      },
      (error) => {
        snack.error("Errore interno del server");
        console.error(error);
      },
    );
  }, [tableState.order, tableState.page, tableState.search, tableState.state]);

  return (
    <>
      <DrawerTicket open={drawerTicket} onClose={() => setDrawerTicket(false)} initial={drawerTicketID.current} />
      <Grid container spacing={2}>
        <Grid item xs={12} textAlign="end">
          <Button variant="contained" onClick={() => handlerOpenModal(null)}>
            Crea un ticket
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ boxSizing: "border-box" }}>
            <Grid container>
              <Grid item xs={12} md={6} padding={2}>
                <InputField
                  setterValue={(value) => {
                    tableDispatch({ type: "SET_SEARCH", payload: value });
                  }}
                  placeholder="Cerca"
                />
              </Grid>
              <Grid item xs={12} md={6} padding={2}>
                <StatusField
                  state={[
                    tableState.state,
                    (value) => {
                      tableDispatch({ type: "SET_STATE", payload: value });
                    },
                  ]}
                />
              </Grid>
            </Grid>
            <ServerSideTable data={tableData} columns={columns} setState={tableDispatch} />

            <Box p={2} display="flex" justifyContent="end">
              <Pagination
                count={Number(tableState.pageCount)}
                shape="rounded"
                color="primary"
                onChange={(e, page) => {
                  tableDispatch({ type: "SET_PAGE", payload: page });
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
