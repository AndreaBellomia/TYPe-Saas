import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Box,
  Typography,
} from "@mui/material";

interface TablesMixinProps {
  orderBy: string | null;
  headers: TableHeaderMixin[];
  data: any[];
}

interface RenderTableHeaderProps {
    headers:TableHeaderMixin[];
    orderingKey: string | null;
    ordering: string | undefined;
    setOrderBy: any
}

interface TablesHeader {
  key: string;
  label: string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  orderable?: boolean;
  accessor: string;
  sx?: { [key: string]: string };
  sxTh?: { [key: string]: string };
  render: (value: string, row: { [key: string]: string }) => string | React.ReactNode;
}

function getOrdering(currentOrder: string): "desc" | "asc"{
  return currentOrder.startsWith("-") ? "desc" : "asc";
}

function getOrderingKey(currentOrder: string): string {
  return currentOrder.startsWith("-")
    ? currentOrder.substring(1)
    : currentOrder;
}

function toggleOrderBy(orderKey:string, currentOrder:string): string {
  const currentKey = currentOrder.startsWith("-")
    ? currentOrder.substring(1)
    : currentOrder;

  if (currentKey === orderKey) {
    return currentOrder.startsWith("-") ? orderKey : `-${orderKey}`;
  }
  return orderKey;
}

export class TableHeaderMixin implements TablesHeader{
    key: TablesHeader["key"]
    label: TablesHeader["label"]
    align: TablesHeader["align"]
    orderable: TablesHeader["orderable"]
    accessor: TablesHeader["accessor"]
    sx: TablesHeader["sx"]
    sxTh: TablesHeader["sxTh"]
    render: TablesHeader["render"]
    


  constructor({
    key,
    label,
    align = "left",
    orderable = false,
    accessor = "",
    sx = {},
    sxTh = {},
    render = (value, row)  => value,
  }: TablesHeader) {
    this.key = key
    this.label = label
    this.align = align
    this.orderable = orderable
    this.orderable = orderable
    this.accessor = accessor || key;
    this.sx = sx;
    this.sxTh = sxTh;
    this.render = render;
  }
}

export default function TablesMixin({
  orderBy: orderByProp = null,
  headers: headersProp,
  data: dataProp,
}: TablesMixinProps) {
  const headers = headersProp;
  const bodies = dataProp;

  let ordering: "desc" | "asc" | undefined = undefined;
  let orderingKey: string | null = null;
  let [orderBy, setOrderBy] = [undefined, (e: any) => {}];

  if (orderByProp) {
    [orderBy, setOrderBy] = orderByProp;
    ordering = getOrdering(orderBy);
    orderingKey = getOrderingKey(orderBy);
  }

  function renderTableHeader({ headers, orderingKey, ordering, setOrderBy }: RenderTableHeaderProps) {
    return (
      <TableRow>
        {headers.map((header: TableHeaderMixin, index: number) => (
          <TableCell
            key={`${header.key}-${index}`}
            align={header.align}
            sx={{ ...header.sxTh }}
          >
            {header.orderable && ordering && orderingKey !== null ? (
              <TableSortLabel
                sx={{ width: "100%", ...header.sxTh }}
                active={orderingKey === header.accessor}
                direction={ordering}
                IconComponent={KeyboardArrowDownIcon}
                onClick={() =>
                  setOrderBy(toggleOrderBy(header.accessor, orderingKey))
                }
              >
                {header.label}
              </TableSortLabel>
            ) : (
              <Box sx={{ ...header.sxTh }}>{header.label}</Box>
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function renderTableBody(headers: TablesMixinProps["headers"], body: { [key: string]: string }, index: number) {
    
    
    const getAccessoValue = (render: TablesHeader["render"], body: { [key: string]: string }, accessor: TablesHeader["accessor"]): string | React.ReactNode => {
      
        const subAccess = accessor.split("__");

      if (subAccess.length > 1) {
        const getValue = (obj: { [key: string]: string }, keyList: Array<string>): string =>
          keyList.reduce(
            (a: any, k: string) =>
              a && a[k] !== "undefined" ? a[k] : undefined,
            obj,
          );

        return render(getValue(body, subAccess), body);
      }
      return render(body[accessor], body);
    };

    return (
      <TableRow key={index}>
        {headers.map((header: TablesHeader, rowIndex: number) => {
          const { key, accessor, align, render } = header;
          return (
            <TableCell component="th" scope="row" key={key} align={align}>
              {getAccessoValue(render, body, accessor)}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return (
    <>
      <TableContainer component={"div"}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>{renderTableHeader({headers, orderingKey, ordering, setOrderBy})}</TableHead>
          <TableBody>
            {bodies.length ? (
              bodies.map((body: { [key: string]: string }, index: number) => renderTableBody(headers, body, index))
            ) : (
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  colSpan={headers.length}
                >
                  <Typography variant="h6">
                    Nessun elemento da visualizzare
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
