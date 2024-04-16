"use client";
import { useEffect, useState } from "react";

import { Formik, useFormik } from "formik";
import { snack } from "@/libs/SnakClient";
import { DjangoApi, FetchDispatchError } from "@/libs/fetch";

import * as Yup from "yup";

import {
  Button,
  Autocomplete,
  Typography,
  Container,
  Grid,
} from "@mui/material";

import { TextField as MuiTextField } from "@mui/material";

import { TextField } from "@/components/forms";

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

  const validationSchema = Yup.object().shape({
    label: Yup.string()
      .min(10, "Troppo breve!")
      .max(100, "Troppo lunga")
      .required("Campo obbligatorio"),
    description: Yup.string().max(5000, "Troppo lunga"),
    type_id: Yup.string().required("Campo obbligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      label: "",
      description: "",
      type_id: "",
      date: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values, helpers) => {
      apiService.post(
        "/ticket/",
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
    },
  });

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Crea un ticket</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              sx={{ width: "100%" }}
              options={type}
              onChange={(_, value: { id: number; label: string } | null) => {
                value === null
                  ? formik.setFieldValue("type_id", "")
                  : formik.setFieldValue("type_id", value.id);
              }}
              onBlur={() => formik.setFieldTouched("type_id", true)}
              renderInput={(params) => (
                <MuiTextField
                  error={!!(formik.errors.type_id && formik.touched.type_id)}
                  {...params}
                  label="Tipo"
                  helperText={formik.touched.type_id && formik.errors.type_id}
                  value="ciao"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Data di scadenza"
              onChange={(e: any) => {
                formik.setFieldValue("expiring_date", parseDateValue(e));
              }}
              error={!!(formik.errors.date && formik.touched.date)}
              helperText={formik.touched.date && formik.errors.date}
              onBlur={() => formik.setFieldTouched("expiring_date", true)}
              name="expiring_date"
              value={formik.values.date}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Titolo"
              name="label"
              type="text"
              formik={formik}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              maxRows={4}
              label="Descrizione"
              name="description"
              type="text"
              formik={formik}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end" }}>
            {/* @ts-ignore */}
            <Button
              variant="contained"
              onClick={formik.handleSubmit}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Crea ticket
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
