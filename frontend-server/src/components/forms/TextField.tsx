import { TextField } from "@mui/material";
import React from "react";

import { FormikHandlers, useFormik } from "formik";

interface ComponentsProps {
  name: string;
  required?: boolean;
  type: React.InputHTMLAttributes<unknown>["type"];
  maxRows?: number;
  label: string;
  formik: ReturnType<typeof useFormik<any>>;
}

export default function _({ name, type, label, maxRows, required, formik }: ComponentsProps) {
  return (
    <TextField
      sx={{ width: "100%" }}
      label={label}
      variant="outlined"
      name={name}
      type={type}
      error={!!(formik.errors[name] && formik.touched[name])}
      // @ts-ignore
      helperText={formik.touched[name] && formik.errors[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
      maxRows={maxRows || undefined}
      multiline={!!maxRows}
      required={required || false}
    />
  );
}
