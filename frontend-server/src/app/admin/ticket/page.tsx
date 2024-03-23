"use client";
import React, { useEffect, useState } from "react";

import { DjangoApi } from "@/libs/fetch";
import Table, { TableHeaderMixin } from "@/components/Tables"
import { InputField } from "@/components/filters"

const API = new DjangoApi();

export default function _() {

  const [tableData, setTableData] = useState([])
  const [tableOrder, setTableOrder] = useState("")
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = DjangoApi.buildURLparams(
      "/ticket/admin/tickets/list",
      [
        { param: "ordering", value: tableOrder },
        { param: "search", value: search },
      ]
    )

    API.get(
      url,
      (response) => {
        console.log(response)
        setTableData(response.data.results)
      },
      (error) => {
        console.log(error);
      },
    );
  }, [tableOrder, search]);

  const tableHeaders = [
    new TableHeaderMixin({
      key: "id",
      label: "ID",
      orderable: true
    }),
    new TableHeaderMixin({
      key: "label",
      label: "Titolo"
    })
  ]

  return (
    <main>
      <InputField setterValue={setSearch} />
      <Table data={tableData} headers={tableHeaders} orderBy={[tableOrder, setTableOrder]}/>
    </main>
  );
}
