import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableSortLabel,
  TableBody,
} from "@mui/material";

interface TableState {
  page: number;
  pageCount: number;
  order: string;
  search: string;
  state: string;
}

interface TableAction {
  type:
    | "SET_PAGE"
    | "SET_ORDER"
    | "SET_COUNT"
    | "SET_SEARCH"
    | "SET_STATE"
    | "GET_TABLE_SORT";
  payload?: any;
}

export function tableReducer(state: TableState, action: TableAction) {
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

export interface ServerSideTable<T> {
  data: Array<T>;
  columns: Array<ColumnDef<T, any>>;
  setState: React.Dispatch<TableAction>;
}

export function ServerSideTable<T>({
  data,
  columns,
  setState,
}: ServerSideTable<T>) {
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  useEffect(() => {
    if (sorting[0]) {
      const { id, desc } = sorting[0];
      setState({ type: "SET_ORDER", payload: `${desc ? "-" : ""}${id}` });
    }
  }, [sorting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const logDebug = (value: any) => {
    console.log(value);
  };

  return (
    <>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  sx={{ width: `${header.getSize()}px` }}
                  align={header.column.columnDef.meta?.align}
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <TableSortLabel
                      active={
                        header.column.getIsSorted() === false ? false : true
                      }
                      direction={header.column.getIsSorted() || undefined}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableSortLabel>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  align={cell.column.columnDef.meta?.align}
                  sx={{
                    ...(cell.column.columnDef.meta?.padding && { p: 0 }),
                    width: cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default ServerSideTable;
