"use client";
import React, { useEffect, useState } from "react";

import { Pagination, Grid } from "@mui/material";

import { DjangoApi } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";
import Table, { TableHeaderMixin } from "@/components/Tables";
import { InputField, StatusField } from "@/components/filters";

import ModalTicketBasic from "@/app/admin/ticket/components/ModalTicketBasic"

import { TICKET_STATUSES } from "@/constants"

const API = new DjangoApi();

export default function _() {
  const [tableData, setTableData] = useState([]);
  const [tableOrder, setTableOrder] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [tablePageCount, setTablePageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [state, setState] = useState(Object.values(TICKET_STATUSES).filter(e => e !== TICKET_STATUSES.DONE).reduce((acc, key) => acc + "," + key));

  useEffect(() => {
    const url: string = DjangoApi.buildURLparams("/ticket/admin/tickets/list", [
      { param: "ordering", value: tableOrder },
      { param: "search", value: search },
      { param: "statuses", value: state },
      { param: "page", value: String(tablePage) },
    ]);

    API.get(
      url,
      (response) => {
        setTableData(response.data.results);
        setTablePageCount(response.data.num_pages);
      },
      (error) => {
        snack.error("Errore interno del server");
        console.error(error);
      },
    );
  }, [tableOrder, tablePage, search, state]);

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
  ];

  return (
    <>
      <ModalTicketBasic/>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <InputField setterValue={setSearch} placeholder="Cerca" />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatusField state={[state, setState]} />
        </Grid>
        <Grid item xs={12}>
          <Table
            data={tableData}
            headers={tableHeaders}
            orderBy={[tableOrder, setTableOrder]}
          />
        </Grid>
        <Grid item xs={12}>
          <Pagination
            count={Number(tablePageCount)}
            shape="rounded"
            onChange={(e, page) => {
              setTablePage(page);
            }}
          />
        </Grid>
      </Grid>
    </>
      
  );
}