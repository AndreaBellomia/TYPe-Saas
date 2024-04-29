"use client";
import React, { useEffect, useRef, useState, useReducer } from "react";

import {
  Pagination,
  Grid,
  Button,
  Box,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";

import { DjangoApi } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";
import { ServerSideTable, tableReducer } from "@/components/ServerSideTable";
import { InputField, StatusField } from "@/components/filters";

import DrawerTicket from "@/app/admin/ticket/components/DrawerTicket";

import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";

import { TICKET_STATUSES } from "@/constants";
import { createColumnHelper } from "@tanstack/react-table";
import { Ticket } from "@/models/Ticket";

import StatusChangeCol from "@/app/admin/ticket/backlog/components/StatusChangeCol";


export default function _() {
  const API = new DjangoApi();
  
  const [drawerTicket, setDrawerTicket] = useState(false);
  const drawerTicketID = useRef<string | null>(null);

  const handlerOpenModal = (id: string | null): void => {
    drawerTicketID.current = null;
    if (id) {
      drawerTicketID.current = id;
    }
    setDrawerTicket(true);
  };

  const [tableState, tableDispatch] = useReducer(tableReducer, {
    page: 1,
    pageCount: 1,
    order: "",
    search: "",
    state: Object.values(TICKET_STATUSES)
      .filter((e) => e === TICKET_STATUSES.BACKLOG)
      .reduce((acc, key) => acc + "," + key),
  });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const url: string = DjangoApi.buildURLparams("/ticket/admin/", [
      { param: "ordering", value: tableState.order },
      { param: "search", value: tableState.search },
      { param: "statuses", value: tableState.state },
      { param: "page", value: String(tableState.page) },
    ]);

    API.get(
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

  const columnHelper = createColumnHelper<Ticket>();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      size: 1,
      cell: (info) => (
        <Box display="flex" flexDirection="column" alignItems="start">
          <Typography variant="body1">{info.row.getValue("id")}</Typography>
          <Typography variant="body1">{info.row.original.label}</Typography>
        </Box>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Stato",
      cell: (info) => (
        <StatusChangeCol
          initialValue={info.getValue()}
          id={info.row.getValue("id")}
        />
      ),
      meta: {
        padding: "none",
      },
      size: 1,
    }),
    columnHelper.accessor("id", {
      header: "",
      id: "detail",
      enableSorting: false,
      size: 2,
      cell: (info) => (
        <IconButton onClick={() => handlerOpenModal(String(info.getValue()))}>
          <DragIndicatorRoundedIcon />
        </IconButton>
      ),
      meta: {
        align: "right",
      },
    }),
  ];

  return (
    <>
      <DrawerTicket
        open={drawerTicket}
        onClose={() => setDrawerTicket(false)}
        id={drawerTicketID.current}
      />
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
            <ServerSideTable
              data={tableData}
              columns={columns}
              setState={tableDispatch}
            />

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
