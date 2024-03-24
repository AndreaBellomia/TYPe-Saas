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
} from "@mui/material";

import { DjangoApi } from "@/libs/fetch";
import { TICKET_STATUSES } from "@/constants";
import DatePicker, { parseDateValue } from "@/components/DatePicker";
import FormikAutocomplete from "@/components/forms/Autocomplete";

const API = new DjangoApi();

interface FormFields {
  label: string;
  expiring_date: string;
  description: string;
  status: string;
  created_by: string;
  type_id: string;
  assigned_to?: string;
}

export default function _({ partial }: { partial: boolean }) {
  const [types, setTypes] = useState<{ label: string; id: number }[]>([]);
  const [users, setUsers] = useState<{ label: string; id: number }[]>([]);
  const [admins, setAdmins] = useState<{ label: string; id: number }[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      await API.get(
        "ticket/types/list",
        (response) => {
          const data: Array<any> = response.data;
          setTypes(data.map((e) => ({ label: e.name, id: e.id })));
        },
        () => {},
      );
    };

    const fetchUsers = async () => {
      await API.get(
        "authentication/users/list",
        (response) => {
          const data: Array<any> = response.data;
          setUsers(data.map((e) => ({ label: e.email, id: e.id })));
        },
        () => {},
      );
    };

    const fetchAdmin = async () => {
      const url = DjangoApi.buildURLparams("authentication/users/list", [
        { param: "admin_only", value: "true" },
      ]);

      await API.get(
        url,
        (response) => {
          const data: Array<any> = response.data;
          setAdmins(data.map((e) => ({ label: e.email, id: e.id })));
        },
        () => {},
      );
    };

    fetchTypes();
    fetchUsers();
    partial && fetchAdmin();
  }, []);

  let formFields: FormFields = {
    label: "",
    expiring_date: "",
    description: "",
    status: TICKET_STATUSES.BACKLOG,
    created_by: "",
    type_id: "",
  };

  let validation = Yup.object().shape({
    label: Yup.string()
      .min(20, "Troppo breve!")
      .max(100, "Troppo lunga")
      .required("Campo obbligatorio"),
    expiring_date: Yup.date()
      .min(new Date(), "La data deve essere nel futuro")
      .required("Campo obbligatorio"),
    description: Yup.string().max(5000, "Descrizione troppo lunga"),
    status: Yup.mixed().oneOf(Object.values(TICKET_STATUSES)),
    type_id: Yup.mixed()
      .oneOf(
        types.map((type) => type.id),
        "Il valore inserito non è valido!",
      )
      .required("Campo obbligatorio"),
    created_by: Yup.mixed()
      .oneOf(
        users.map((type) => type.id),
        "Il valore inserito non è valido!",
      )
      .required("Campo obbligatorio"),
  });

  if (partial) {
    validation = validation.shape({
      assigned_to: Yup.mixed()
        .oneOf(
          admins.map((admin) => admin.id),
          "Il valore inserito non è valido!",
        )
        .required("Campo obbligatorio"),
    });

    formFields.assigned_to = "";
  }

  return (
    <Formik
      initialValues={formFields}
      validationSchema={validation}
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
            onChange={(e: any) => {
              setFieldValue("expiring_date", parseDateValue(e));
            }}
            error={!!(errors.expiring_date && touched.expiring_date)}
            helperText={touched.expiring_date && errors.expiring_date}
            onBlur={() => setFieldTouched("expiring_date", true)}
            name="expiring_date"
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

          <FormikAutocomplete
            name="type_id"
            label="Tipo"
            value="tipo"
            options={types}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />

          <Box sx={{ my: 2 }} />

          <FormikAutocomplete
            name="created_by"
            label="Creato da"
            value="creato da"
            options={users}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />

          {partial && (
            <>
              <Box sx={{ my: 2 }} />

              <FormikAutocomplete
                name="assigned_to"
                label="Assegnato a"
                value="assegnato a"
                options={admins}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
            </>
          )}

          <Box sx={{ my: 2 }} />
          {/*  @ts-ignore */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!(isValid && dirty)}
          >
            Crea
          </Button>
        </Box>
      )}
    </Formik>
  );
}
