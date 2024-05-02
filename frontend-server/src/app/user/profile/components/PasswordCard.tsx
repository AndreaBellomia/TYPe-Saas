"use client";
import { Paper, Typography, Box, Grid, FormLabel } from "@mui/material";

import TextField from "@/components/forms/TextField";

import { useFormik } from "formik";
import * as Yup from "yup";
import { snack } from "@/libs/SnakClient";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { ResponsiveButton } from "@/components/forms";

export function PasswordCard() {
  const API = new DjangoApi();

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Campo obbligatorio"),
    new_password: Yup.string().min(2, "Troppo breve!").max(100, "Troppo lunga").required("Campo obbligatorio"),
    confirm_new_password: Yup.string()
      .required("Campo obbligatorio")
      .oneOf([Yup.ref("new_password")], "Le password non corrispondono"),
  });

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, helpers) => {
      console.log("data", values);
      API.post(
        "/authentication/change_password/",
        () => {
          helpers.resetForm();
          snack.success("Password cambiata correttamente!");
        },

        (error) => {
          const data = error.response.data;
          Object.keys(data).forEach((key) => {
            helpers.setFieldError(key, data[key]);
          });
          throw new FetchDispatchError("Errore, si prega di riprovare!");
        },
        values,
      );
    },
  });

  return (
    <Paper elevation={5} sx={{ width: "100%" }}>
      <form>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h4" color="initial">
                Password
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Password</FormLabel>
              <TextField required name="old_password" type="password" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Nuova password</FormLabel>
              <TextField required name="new_password" type="password" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Ripeti nuova password</FormLabel>
              <TextField required name="confirm_new_password" type="password" formik={formik} />
            </Grid>
            <Grid item xs={12} textAlign="end">
              <ResponsiveButton
                variant="contained"
                disabled={!(formik.isValid && formik.dirty)}
                onClick={() => formik.handleSubmit()}
              >
                Aggiorna
              </ResponsiveButton>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
}

export default PasswordCard;
