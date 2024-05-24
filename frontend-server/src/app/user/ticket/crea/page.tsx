"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Typography, Container, Grid, Paper, Box, FormLabel } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import * as Yup from "yup";
import { useFormik } from "formik";

import { snack } from "@/libs/SnakClient";
import { FetchDispatchError, useDjangoApi } from "@/libs/fetch";
import { TextField, Autocomplete, ResponsiveButton } from "@/components/forms";
import DatePicker, { parseDateValue } from "@/components/DatePicker";

export default function _() {
  const api = useDjangoApi();
  const router = useRouter();
  const [type, setType] = useState<{ label: string; id: number }[]>([]);
  const today = new Date();

  let minDate = new Date()
  minDate.setDate(today.getDate() + 4)
  let maxDate = new Date()
  maxDate.setDate(today.getDate() + 61)

  useEffect(() => {
    api.get(
      "ticket/types/list",
      (response) => {
        const data: Array<any> = response.data;
        setType(data.map((e) => ({ label: e.name, id: e.id })));
      },
      () => {},
    );
  }, []);

  const validationSchema = Yup.object().shape({
    label: Yup.string().min(10, "Troppo breve!").max(100, "Troppo lunga").required("Campo obbligatorio"),
    description: Yup.string().max(5000, "Troppo lunga"),
    type_id: Yup.string().required("Campo obbligatorio"),
    expiring_date: Yup.date().min(
      minDate,
      "La data di scadenza deve essere minimo tra 5 giorni",
    )
    .max(
      maxDate,
      "La data di scadenza non può superare i 60 giorni",
    ),
  });

  const formik = useFormik({
    initialValues: {
      label: "",
      description: "",
      type_id: "",
      expiring_date: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values, helpers) => {
      api.post(
        "/ticket/",
        (response) => {
          helpers.resetForm();
          snack.success("created");
          router.push(`/user/ticket/${response.data.id}`);
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
        <Paper sx={{ padding: 2 }}>
          <Box display="flex" alignItems="middle">
            <ConfirmationNumberIcon fontSize="large" sx={{ mr: 1 }} color="primary" />
            <Typography variant="h4">Crea una richiesta</Typography>
          </Box>
          <Typography variant="subtitle1">Qui puoi creare una nuova richiesta per inoltrare una richiesta.</Typography>

          <Typography variant="body2" color="initial">
            Assicurati di inserire un titolo chiaro e una descrizione dettagliata per una migliore comprensione. Una
            volta inviata la richiesta, sarà presa in carico da un amministratore per una rapida risoluzione. Grazie per
            la tua collaborazione!
          </Typography>
          <br />
          <Typography variant="body2" color="error">
            La <strong>Data di consegna</strong> è solo una stima, tieni presente che potrebbe variare.
          </Typography>
        </Paper>

        <Box py={2} />

        <Paper sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormLabel>Tipo di richiesta</FormLabel>
              <Autocomplete
                name="type_id"
                values={formik.values}
                options={type}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormLabel>Data di consegna</FormLabel>
              <DatePicker
                onChange={(e: any) => {
                  formik.setFieldValue("expiring_date", parseDateValue(e));
                }}
                error={!!(formik.errors.expiring_date && formik.touched.expiring_date)}
                helperText={formik.touched.expiring_date && formik.errors.expiring_date}
                onBlur={() => formik.setFieldTouched("expiring_date", true)}
                name="expiring_date"
                value={formik.values.expiring_date}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Titolo della richiesta</FormLabel>
              <TextField name="label" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Descrizione della richiesta</FormLabel>
              <TextField maxRows={4} name="description" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "end" }}>
              <ResponsiveButton
                type="submit"
                variant="contained"
                onClick={() => formik.handleSubmit()}
                disabled={!(formik.isValid && formik.dirty)}
              >
                Invia richiesta
              </ResponsiveButton>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
