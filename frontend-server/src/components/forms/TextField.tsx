import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

import { FormikHandlers, useFormik } from "formik";

interface ComponentsProps extends Omit<TextFieldProps, 'formik'> {
  name: string;
  formik: ReturnType<typeof useFormik<any>>;
}

export default function _({ name, formik, ...rest }: ComponentsProps) {
  return (
    <TextField
      sx={{ width: "100%" }}
      variant="outlined"
      name={name}
      error={!!(formik.errors[name] && formik.touched[name])}
      // @ts-ignore
      helperText={formik.touched[name] && formik.errors[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
      {...rest}
    />
  );
}
