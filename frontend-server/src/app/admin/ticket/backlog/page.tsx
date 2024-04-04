"use client";
import React, { useEffect, useState } from "react";

import { Pagination, Grid, Button, Box } from "@mui/material";

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

  const [modalTicket, setModalTicket] = useState(false)
  const [modalTicketDetail, setModalTicketDetail] = useState<null | string>(null)

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
  }, [tableOrder, tablePage, search, state, modalTicket]);

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
      render: (value, row) => <Button variant="outlined" onClick={() => handlerOpenModal(value)}>dettaglio</Button>

    }),
  ];

  const handlerOpenModal = (id: string | null): void => {
    if (id) {
      setModalTicketDetail(id)
    } else {
      setModalTicketDetail(null)
    }
    setModalTicket(true)
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
        <Button variant="contained" onClick={() => handlerOpenModal(null)}>Crea un ticket</Button>
      </Box>
      <ModalTicketBasic modalStatus={[modalTicket, setModalTicket]} detailId={modalTicketDetail} />
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
            color="primary"
            onChange={(e, page) => {
              setTablePage(page);
            }}
          />
        </Grid>
      </Grid>
    </>
      
  );
}
