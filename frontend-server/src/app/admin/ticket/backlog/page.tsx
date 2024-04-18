"use client";
import React, { useEffect, useRef, useState, useReducer } from "react";

import { Pagination, Grid, Button, Box } from "@mui/material";

import { DjangoApi } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";
import Table, { TableHeaderMixin } from "@/components/Tables";
import { InputField, StatusField } from "@/components/filters";

import DrawerTicket from "@/app/admin/ticket/components/DrawerTicket";

import { TICKET_STATUSES } from "@/constants";

const API = new DjangoApi();

interface TableState {
  page: number;
  pageCount: number;
  order: string;
  search: string;
  state: string;
}

interface TableAction {
  type: string;
  payload?: any;
}

function tableReducer(state: TableState, action: TableAction) {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "SET_ORDER":
      return {
        ...state,
        order: action.payload,
      };
    case "SET_COUNT":
      return {
        ...state,
        pageCount: action.payload,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
      };
    case "SET_STATE":
      return {
        ...state,
        state: action.payload,
      };
    default:
      throw state;
  }
}

export default function _() {
  const [tableState, tableDispatch] = useReducer(tableReducer, {
    page: 1,
    pageCount: 1,
    order: "",
    search: "",
    state: Object.values(TICKET_STATUSES)
      .filter((e) => e !== TICKET_STATUSES.DONE)
      .reduce((acc, key) => acc + "," + key),
  });
  const [tableData, setTableData] = useState([]);
  const [drawerTicket, setDrawerTicket] = useState(false);
  const drawerTicketID = useRef<string | null>(null);

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

  const tableHeaders = [
    new TableHeaderMixin({
      key: "id",
      label: "ID",
      orderable: true,
    }),
    new TableHeaderMixin({
      key: "label",
      label: "Titolo",
    }),
    new TableHeaderMixin({
      key: "detail",
      accessor: "id",
      label: "",
      align: "right",
      render: (value, row) => (
        <Button variant="outlined" onClick={() => handlerOpenModal(value)}>
          dettaglio
        </Button>
      ),
    }),
  ];

  const handlerOpenModal = (id: string | null): void => {
    drawerTicketID.current = null;
    if (id) {
      drawerTicketID.current = id;
    }
    setDrawerTicket(true);
  };

  return (
    <>
      <DrawerTicket
        open={drawerTicket}
        onClose={() => setDrawerTicket(false)}
        id={drawerTicketID.current}
      />
      <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
        <Button variant="contained" onClick={() => handlerOpenModal(null)}>
          Crea un ticket
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <InputField
            setterValue={(value) => {
              tableDispatch({ type: "SET_SEARCH", payload: value });
            }}
            placeholder="Cerca"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatusField
            state={[
              tableState.state,
              (value) => {
                tableDispatch({ type: "SET_STATE", payload: value });
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Table
            data={tableData}
            headers={tableHeaders}
            orderBy={[
              tableState.order,
              (value) => {
                tableDispatch({ type: "SET_ORDER", payload: value });
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Pagination
            count={Number(tableState.pageCount)}
            shape="rounded"
            color="primary"
            onChange={(e, page) => {
              tableDispatch({ type: "SET_PAGE", payload: page });
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
