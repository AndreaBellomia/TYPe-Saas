"use client"
import { Paper, Typography, Box, Grid, Button } from "@mui/material";

import TextField from "@/components/forms/TextField";

import { useFormik } from "formik";
import * as Yup from "yup";
import { snack } from "@/libs/SnakClient";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";


export function PasswordCard() {
  const API = new DjangoApi();

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Campo obbligatorio"),
    new_password: Yup.string()
      .min(2, "Troppo breve!")
      .max(100, "Troppo lunga")
      .required("Campo obbligatorio"),
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
              <TextField
                required
                label="Password attuale"
                name="old_password"
                type="password"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Nuova password"
                name="new_password"
                type="password"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Ripeti nuova password"
                name="confirm_new_password"
                type="password"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12} textAlign="end">
              {/* @ts-ignore */}
              <Button
                variant="contained"
                disabled={!(formik.isValid && formik.dirty)}
                onClick={formik.handleSubmit}
              >
                Aggiorna
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
}

export default PasswordCard;
