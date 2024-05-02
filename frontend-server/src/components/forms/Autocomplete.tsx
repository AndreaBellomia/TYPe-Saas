import { TextField, Autocomplete } from "@mui/material";

import { FormikHelpers } from "formik";

interface ComponentsProps {
  name: string;
  options: Array<any>;
  errors: { [key: string]: any };
  touched: { [key: string]: any };
  label?: string;
  values: { [key: string]: any };
  setFieldValue: FormikHelpers<any>["setFieldValue"];
  setFieldTouched: FormikHelpers<any>["setFieldTouched"];
}

export default function _({
  name,
  options,
  errors,
  touched,
  label,
  values,
  setFieldValue,
  setFieldTouched,
}: ComponentsProps) {
  const filedValue = options.find((option) => option.id === values[name]);
  return (
    <Autocomplete
      sx={{ width: "100%" }}
      options={options}
      onChange={(_, value: { id: number; label: string } | null) => {
        value === null ? setFieldValue(name, null) : setFieldValue(name, value.id);
      }}
      value={filedValue || null}
      onBlur={() => setFieldTouched(name, true)}
      renderInput={(params) => (
        <TextField
          error={!!(errors[name] && touched[name])}
          {...params}
          label={label}
          helperText={touched[name] && errors[name]}
        />
      )}
    />
  );
}
