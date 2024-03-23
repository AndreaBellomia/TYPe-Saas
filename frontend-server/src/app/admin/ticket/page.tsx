"use client";
import React, { useEffect, useState } from "react";

import { Pagination } from '@mui/material';


import { DjangoApi } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";
import Table, { TableHeaderMixin } from "@/components/Tables";
import { InputField, StatusField } from "@/components/filters";

const API = new DjangoApi();

export default function _() {
  const [tableData, setTableData] = useState([]);
  const [tableOrder, setTableOrder] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [tablePageCount, setTablePageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("backlog,todo,progress,blocked");

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
        console.log(response);
        setTableData(response.data.results);
        setTablePageCount(response.data.num_pages)
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
    <main>
      <InputField setterValue={setSearch} />
      <StatusField state={[state, setState]} />
      <Table
        data={tableData}
        headers={tableHeaders}
        orderBy={[tableOrder, setTableOrder]}
      />

      <Pagination
        count={Number(tablePageCount)}
        shape="rounded"
        onChange={(e, page) => {
          setTablePage(page);
        }}
      />
    </main>
  );
}
