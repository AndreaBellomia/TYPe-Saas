import { TextField, Autocomplete } from "@mui/material";

import { FormikHelpers } from "formik";

interface ComponentsProps {
  name: string;
  options: Array<any>;
  errors: { [key: string]: any };
  touched: { [key: string]: any };
  label: string;
  value: string;
  setFieldValue: FormikHelpers<any>["setFieldValue"];
  setFieldTouched: FormikHelpers<any>["setFieldTouched"];
}

export default function _({
  name,
  options,
  errors,
  touched,
  label,
  value,
  setFieldValue,
  setFieldTouched,
}: ComponentsProps) {
  return (
    <Autocomplete
      sx={{ width: "100%" }}
      options={options}
      onChange={(_, value: { id: number; label: string } | null) => {
        value === null
          ? setFieldValue(name, "")
          : setFieldValue(name, value.id);
      }}
      onBlur={() => setFieldTouched(name, true)}
      renderInput={(params) => (
        <TextField
          error={!!(errors[name] && touched[name])}
          {...params}
          label={label}
          helperText={touched[name] && errors[name]}
          value={value}
        />
      )}
    />
  );
}
