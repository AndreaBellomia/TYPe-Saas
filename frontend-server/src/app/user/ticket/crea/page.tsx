"use client";
import { useEffect, useState } from "react";

import { Formik } from "formik";
import { snack } from "@/libs/SnakClient";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";

import * as Yup from "yup";

import {
  TextField,
  Button,
  Autocomplete,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import DatePicker, { parseDateValue } from "@/components/DatePicker";

const apiService = new DjangoApi();

export default function _() {
  const [type, setType] = useState<{ label: string; id: number }[]>([]);

  useEffect(() => {
    apiService.get(
      "ticket/types/list",
      (response) => {
        const data: Array<any> = response.data;
        setType(data.map((e) => ({ label: e.name, id: e.id })));
      },
      () => {},
    );
  }, []);

  return (
    <>
      <Container>
        <Formik
          initialValues={{
            label: "",
            description: "",
            type_id: "",
            date: "",
          }}
          validationSchema={Yup.object().shape({
            label: Yup.string()
              .min(10, "Troppo breve!")
              .max(100, "Troppo lunga")
              .required("Campo obbligatorio"),
            description: Yup.string().max(5000, "Troppo lunga"),
            type_id: Yup.string().required("Campo obbligatorio"),
          })}
          onSubmit={(values, helpers) => {
            apiService.post(
              "/ticket/tickets/list",
              (response) => {
                helpers.resetForm();
                snack.success("created");
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
            handleReset,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">Crea un ticket</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  options={type}
                  onChange={(
                    _,
                    value: { id: number; label: string } | null,
                  ) => {
                    value === null
                      ? setFieldValue("type_id", "")
                      : setFieldValue("type_id", value.id);
                  }}
                  onBlur={() => setFieldTouched("type_id", true)}
                  renderInput={(params) => (
                    <TextField
                      error={!!(errors.type_id && touched.type_id)}
                      {...params}
                      label="Tipo"
                      helperText={touched.type_id && errors.type_id}
                      value="ciao"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Data di scadenza"
                  onChange={(e) => {
                    setFieldValue("date", parseDateValue(e));
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Titolo"
                  variant="outlined"
                  name="label"
                  type="text"
                  error={!!(errors.label && touched.label)}
                  helperText={touched.label && errors.label}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.label}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={4}
                  sx={{ width: "100%" }}
                  label="Descrizione"
                  variant="outlined"
                  name="description"
                  type="text"
                  error={!!(errors.description && touched.description)}
                  helperText={touched.description && errors.description}
                  onChange={handleChange}
                  value={values.description}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "end" }}>
                {/* @ts-ignore */}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!(isValid && dirty)}
                >
                  Crea ticket
                </Button>
              </Grid>
            </Grid>
          )}
        </Formik>
      </Container>
    </>
  );
}
