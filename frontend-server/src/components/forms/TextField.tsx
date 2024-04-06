import { TextField } from "@mui/material";
import React from "react";

import { FormikHandlers } from "formik";

interface ComponentsProps {
  name: string;
  required?: boolean
  type: React.InputHTMLAttributes<unknown>['type'];
  maxRows?: number;
  errors: { [key: string]: any };
  touched: { [key: string]: any };
  label: string;
  values: { [key: string]: any };
  handleChange: FormikHandlers["handleChange"];
  handleBlur: FormikHandlers["handleBlur"];
}

export default function _({
  name,
  type,
  errors,
  touched,
  label,
  values,
  maxRows,
  handleChange,
  handleBlur,
  required
}: ComponentsProps) {
  return (
    <TextField
      sx={{ width: "100%" }}
      label={label}
      variant="outlined"
      name={name}
      type={type}
      error={!!(errors[name] && touched[name])}
      helperText={touched[name] && errors[name]}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values[name]}
      maxRows={maxRows || undefined}
      multiline={!!maxRows}
      required={required || false}
    />
  );
}
