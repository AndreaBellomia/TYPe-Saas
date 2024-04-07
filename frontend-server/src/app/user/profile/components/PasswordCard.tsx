import { Paper, Typography, Box, Grid, Button } from "@mui/material";

import TextField from "@/components/forms/TextField";

import { Formik } from "formik";
import * as Yup from "yup";
import { snack } from "@/libs/SnakClient";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";

const API = new DjangoApi();

function PasswordCard() {
  return (
    <Paper elevation={5} sx={{ width: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Formik
          initialValues={{
            old_password: "",
            new_password: "",
            confirm_new_password: "",
          }}
          validationSchema={Yup.object().shape({
            old_password: Yup.string().required("Campo obbligatorio"),
            new_password: Yup.string()
              .min(2, "Troppo breve!")
              .max(100, "Troppo lunga")
              .required("Campo obbligatorio"),
            confirm_new_password: Yup.string()
              .required("Campo obbligatorio")
              .oneOf(
                [Yup.ref("new_password")],
                "Le password non corrispondono",
              ),
          })}
          onSubmit={(values, helpers) => {
            console.log("data", values);
            API.post(
              "/authentication/user/change_password",
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
          }}
        >
          {({
            values,
            errors,
            touched,
            dirty,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
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
                  errors={errors}
                  touched={touched}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Nuova password"
                  name="new_password"
                  type="password"
                  errors={errors}
                  touched={touched}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Ripeti nuova password"
                  name="confirm_new_password"
                  type="password"
                  errors={errors}
                  touched={touched}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} textAlign="end">
                {/* @ts-ignore */}
                <Button
                  variant="contained"
                  disabled={!(isValid && dirty)}
                  onClick={handleSubmit}
                >
                  Aggiorna
                </Button>
              </Grid>
            </Grid>
          )}
        </Formik>
      </Box>
    </Paper>
  );
}

export default PasswordCard;