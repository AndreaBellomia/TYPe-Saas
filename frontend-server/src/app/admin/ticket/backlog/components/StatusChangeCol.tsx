"use client"

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { StatusesType } from "@/models/Ticket";
import { TICKET_STATUSES } from "@/constants";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { useState } from "react";

export interface StatusChangeCol {
  initialValue: StatusesType;
  id: string;
}

export function StatusChangeCol({ initialValue, id }: StatusChangeCol) {
  const API = new DjangoApi();

  const [value, setValue] = useState(initialValue);

  const handlerChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as StatusesType;
    setValue(newValue);

    API.patch(
      `/ticket/admin/${id}/`,
      () => {
        initialValue = newValue;
      },
      (error) => {
        setValue(initialValue);
        throw new FetchDispatchError("Errore di aggiornamento");
      },
      {
        status: newValue,
      },
    );
  };

  return (
    <>
      <FormControl sx={{ m: 1, width: "100%" }}>
        <Select value={value} onChange={handlerChange} fullWidth>
          {Object.values(TICKET_STATUSES).map((value) => (
            <MenuItem value={value} key={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default StatusChangeCol;
