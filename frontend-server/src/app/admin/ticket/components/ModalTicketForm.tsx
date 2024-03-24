"use-client";
import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";
import { TICKET_STATUSES } from "@/constants";
import DatePicker, { parseDateValue } from "@/components/DatePicker";
import { Autocomplete, TextField } from "@/components/forms";

const API = new DjangoApi();

interface FormFields {
  label: string;
  expiring_date: string;
  description: string;
  status: string;
  created_by: number | null;
  type: number | null;
  assigned_to?: number | null;
}

export default function _({
  partial,
  setModal,
}: {
  partial: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
    created_by: null,
    type: null,
  };

  let validation = Yup.object().shape({
    label: Yup.string()
      .min(10, "Troppo breve!")
      .max(100, "Troppo lunga")
      .required("Campo obbligatorio"),
    expiring_date: Yup.date()
      .min(new Date(), "La data deve essere nel futuro")
      .required("Campo obbligatorio"),
    description: Yup.string().max(5000, "Descrizione troppo lunga"),
    status: Yup.mixed().oneOf(Object.values(TICKET_STATUSES)),
    type: Yup.mixed()
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

    formFields.assigned_to = null;
  }

  return (
    <Formik
      initialValues={formFields}
      validationSchema={validation}
      onSubmit={(values, helpers) => {
        console.log(values);

        API.post(
          "/ticket/admin/tickets/list",
          (response) => {
            helpers.resetForm();
            snack.success("created");
            setModal(false);
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
            name="label"
            type="text"
            label="Tipo"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <Box sx={{ my: 2 }} />

          <TextField
            name="description"
            type="text"
            label="Descrizione"
            values={values}
            errors={errors}
            touched={touched}
            maxRows={10}
            handleChange={handleChange}
            handleBlur={handleBlur}
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

          <Autocomplete
            name="type"
            label="Tipo"
            values={values}
            options={types}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />

          <Box sx={{ my: 2 }} />

          <Autocomplete
            name="created_by"
            label="Creato da"
            values={values}
            options={users}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />

          {partial && (
            <>
              <Box sx={{ my: 2 }} />

              <Autocomplete
                name="assigned_to"
                label="Assegnato a"
                values={values}
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
