import React, { ElementType, useEffect, useState } from "react";
import { FilledTextFieldProps, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function CustomTextField(props: FilledTextFieldProps): React.ReactElement {
  const { error, ...other } = props;
  return <TextField {...other} sx={{ width: "100%" }} error={error ?? props.error} />;
}

export default function CustomDatePicker(props: any) {
  const { ...otherProps } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        slots={{
          // @ts-ignore
          textField: CustomTextField,
        }}
        format="DD/MM/YYYY"
        onChange={otherProps.onChange}
        slotProps={{
          textField: {
            error: otherProps.error,
            helperText: otherProps.helperText,
            label: otherProps.label,
            onBlur: otherProps.onBlur,
          },
          actionBar: { actions: ["clear"] },
        }}
        value={dayjs(otherProps.value) || null}
        name={otherProps.name}
        localeText={{
          clearButtonLabel: "CANCELLA",
        }}
      />
    </LocalizationProvider>
  );
}

export function parseDateValue(e: any): string {
  if (e === null) {
    return "";
  }
  const date: Date = e.$d;

  return date.toISOString();
}
