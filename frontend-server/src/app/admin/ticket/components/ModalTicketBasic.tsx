"use-client";
import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";

import Modal from "@/components/Modal";
import DatePicker, { parseDateValue } from "@/components/DatePicker";
import { DjangoApi } from "@/libs/fetch";

import { TICKET_STATUSES } from "@/constants";
const API = new DjangoApi();

export default function _() {
  const [open, setOpen] = useState(false);
  const typesRef = useRef<{ label: string; id: number }[]>([]);

  const handlerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      API.get(
        "ticket/types/list",
        (response) => {
          const data: Array<any> = response.data;
          typesRef.current = data.map((e) => ({ label: e.name, id: e.id }));
        },
        () => {},
      );
    }
  }, [open]);

  return (
    <>
      <Button onClick={handlerToggle}>Open modal</Button>
      <Modal state={[open, setOpen]}>
        <Formik
          initialValues={{
            label: "",
            expiring_date: "",
            description: "",
            status: TICKET_STATUSES.BACKLOG,
            created_by: "",
            type_id: "",
          }}
          validationSchema={Yup.object().shape({
            label: Yup.string()
              .min(20, "Troppo breve!")
              .max(100, "Troppo lunga")
              .required("Campo obbligatorio"),
            expiring_date: Yup.date().required("Campo obbligatorio"),
            description: Yup.string().max(5000, "Descrizione troppo lunga"),
            status: Yup.mixed().oneOf(Object.values(TICKET_STATUSES)),
            type_id: Yup.mixed()
              .oneOf(typesRef.current.map((type) => type.id))
              .required("Campo obbligatorio"),
          })}
          onSubmit={(values, helpers) => {
            console.log(values);
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
            setFieldValue,
            handleSubmit,
            setFieldTouched,
          }) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Crea un nuovo ticket</Typography>

              <Box sx={{ my: 2 }} />

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

              <Box sx={{ my: 2 }} />

              <TextField
                sx={{ width: "100%" }}
                label="Descrizione"
                variant="outlined"
                name="description"
                maxRows={10}
                multiline
                type="text"
                error={!!(errors.description && touched.description)}
                helperText={touched.description && errors.description}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
              />

              <Box sx={{ my: 2 }} />

              <DatePicker
                label="Data di scadenza"
                onChange={(e) => {
                  setFieldValue("expiring_date", parseDateValue(e));
                }}
              />

              <Box sx={{ my: 2 }} />

              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="status-select-id-label">Stato</InputLabel>
                <Select
                  labelId="status-select-id-label"
                  id="status-select-id"
                  value={values.status}
                  name="status"
                  label="Stato"
                  onChange={handleChange}
                >
                  <MenuItem value={TICKET_STATUSES.BACKLOG}>Backlog</MenuItem>
                  <MenuItem value={TICKET_STATUSES.TODO}>Da fare</MenuItem>
                  <MenuItem value={TICKET_STATUSES.PROGRESS}>
                    In lavorazione
                  </MenuItem>
                  <MenuItem value={TICKET_STATUSES.BLOCKED}>Bloccato</MenuItem>
                  <MenuItem value={TICKET_STATUSES.DONE}>Completato</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ my: 2 }} />

              <Autocomplete
                sx={{ width: "100%" }}
                options={typesRef.current}
                onChange={(_, value: { id: number; label: string } | null) => {
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

              <Box sx={{ my: 2 }} />
              {/*  @ts-ignore */}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!(isValid && dirty)}
              >
                Login
              </Button>
            </Box>
          )}
        </Formik>
      </Modal>
    </>
  );
}
