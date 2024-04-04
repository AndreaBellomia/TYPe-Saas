"use-client";
import React, { useEffect, useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";

import dayjs from "dayjs";

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

interface ComponentProps {
  partial: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  objectData: { [key: string]: any } | null;
}

export interface FormFields {
  label: string;
  expiring_date: string;
  description: string;
  status: string;
  created_by_id: number | null;
  type_id: number | null;
  assigned_to_id?: number | null;
}

function errorsHandler(
  helpers: FormikHelpers<any>,
  errors: { [key: string]: string },
): void {
  Object.keys(errors).forEach((key) => {
    helpers.setFieldError(key, errors[key]);
  });
}

export default function _({
  partial,
  setModal,
  objectData,
  setEditable,
}: ComponentProps) {
  const [types, setTypes] = useState<{ label: string; id: number }[]>([]);
  const [users, setUsers] = useState<{ label: string; id: number }[]>([]);
  const [admins, setAdmins] = useState<{ label: string; id: number }[]>([]);

  const validation = Yup.object().shape({
    label: Yup.string()
      .min(10, "Troppo breve!")
      .max(100, "Troppo lunga")
      .required("Campo obbligatorio"),
    expiring_date: Yup.date()
      .required("Campo obbligatorio"),
    description: Yup.string().max(5000, "Descrizione troppo lunga"),
    status: Yup.mixed().oneOf(Object.values(TICKET_STATUSES)),
    type_id: Yup.mixed()
      .oneOf(
        types.map((type) => type.id),
        "Il valore inserito non è valido!",
      )
      .required("Campo obbligatorio"),
    created_by_id: Yup.mixed()
      .oneOf(
        users.map((type) => type.id),
        "Il valore inserito non è valido!",
      )
      .required("Campo obbligatorio"),
    ...(partial && {
      assigned_to_id: Yup.mixed()
        .oneOf(
          admins.map((admin) => admin.id),
          "Il valore inserito non è valido!",
        )
        .required("Campo obbligatorio"),
    }),
  });

  const formFields: FormFields = {
    label: "",
    expiring_date: "",
    description: "",
    status: TICKET_STATUSES.BACKLOG,
    created_by_id: null,
    type_id: null,
    ...(partial && { assigned_to_id: null }),
  };

  const formik = useFormik({
    initialValues: formFields,
    validationSchema: validation,
    onSubmit: (values, helpers) => {
      if (objectData) {
        API.put(
          `/ticket/admin/tickets/update/${objectData.id}`,
          (response) => {
            helpers.resetForm();
            snack.success(`Ticket numero ${objectData.id} è stato aggiornato`);
            setModal(false);
          },
          (error) => {
            console.error(error);
            errorsHandler(helpers, error.response.data);
            throw new FetchDispatchError("Errore, si prega di riprovare!");
          },
          // @ts-ignore
          values,
        );
      } else {
        API.post(
          "/ticket/admin/tickets/list",
          (response) => {
            helpers.resetForm();
            snack.success("Nuovo ticket creato");
            setModal(false);
          },
          (error) => {
            console.error(error);
            errorsHandler(helpers, error.response.data);
            throw new FetchDispatchError("Errore, si prega di riprovare!");
          },
          // @ts-ignore
          values,
        );
      }
    },
  });

  useEffect(() => {
    API.get(
      "ticket/types/list",
      (response) => {
        const data: Array<any> = response.data;
        setTypes(data.map((e) => ({ label: e.name, id: e.id })));
      },
      (e) => {
        throw new FetchDispatchError(
          "Errore durante il recupero dei tipo, riprova più tardi.",
        );
      },
    );

    API.get(
      "authentication/users/list/small",
      (response) => {
        const data: Array<any> = response.data;
        setUsers(data.map((e) => ({ label: e.email, id: e.id })));
      },
      () => {
        throw new FetchDispatchError(
          "Errore durante il recupero degli utenti, riprova più tardi.",
        );
      },
    );

    if (partial) {
      API.get(
        DjangoApi.buildURLparams("authentication/users/list/small", [
          { param: "admin_only", value: "true" },
        ]),
        (response) => {
          const data: Array<any> = response.data;
          setAdmins(data.map((e) => ({ label: e.email, id: e.id })));
        },
        () => {
          throw new FetchDispatchError(
            "Errore durante il recupero degli amministratori, riprova più tardi.",
          );
        },
      );
    }
  }, []);

  useEffect(() => {
    if (objectData) {
      console.log(objectData);
      Object.keys(formik.values).forEach((key) => {
        formik.setFieldValue(key, objectData[key]);
      });
    }
  }, [objectData]);

  return (
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
        values={formik.values}
        errors={formik.errors}
        touched={formik.touched}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />

      <Box sx={{ my: 2 }} />

      <TextField
        name="description"
        type="text"
        label="Descrizione"
        values={formik.values}
        errors={formik.errors}
        touched={formik.touched}
        maxRows={10}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />

      <Box sx={{ my: 2 }} />

      <DatePicker
        label="Data di scadenza"
        onChange={(e: any) => {
          formik.setFieldValue("expiring_date", parseDateValue(e));
        }}
        error={!!(formik.errors.expiring_date && formik.touched.expiring_date)}
        helperText={formik.touched.expiring_date && formik.errors.expiring_date}
        onBlur={() => formik.setFieldTouched("expiring_date", true)}
        name="expiring_date"
        value={formik.values.expiring_date}
      />

      <Box sx={{ my: 2 }} />

      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="status-select-id-label">Stato</InputLabel>
        <Select
          labelId="status-select-id-label"
          id="status-select-id"
          value={formik.values.status}
          name="status"
          label="Stato"
          onChange={formik.handleChange}
        >
          <MenuItem value={TICKET_STATUSES.BACKLOG}>Backlog</MenuItem>
          <MenuItem value={TICKET_STATUSES.TODO}>Da fare</MenuItem>
          <MenuItem value={TICKET_STATUSES.PROGRESS}>In lavorazione</MenuItem>
          <MenuItem value={TICKET_STATUSES.BLOCKED}>Bloccato</MenuItem>
          <MenuItem value={TICKET_STATUSES.DONE}>Completato</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ my: 2 }} />

      <Autocomplete
        name="type_id"
        label="Tipo"
        values={formik.values}
        options={types}
        errors={formik.errors}
        touched={formik.touched}
        setFieldValue={formik.setFieldValue}
        setFieldTouched={formik.setFieldTouched}
      />

      <Box sx={{ my: 2 }} />

      <Autocomplete
        name="created_by_id"
        label="Creato da"
        values={formik.values}
        options={users}
        errors={formik.errors}
        touched={formik.touched}
        setFieldValue={formik.setFieldValue}
        setFieldTouched={formik.setFieldTouched}
      />

      {partial && (
        <>
          <Box sx={{ my: 2 }} />

          <Autocomplete
            name="assigned_to_id"
            label="Assegnato a"
            values={formik.values}
            options={admins}
            errors={formik.errors}
            touched={formik.touched}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
          />
        </>
      )}

      <Box sx={{ my: 2 }} />
      {!objectData ? (
        // @ts-ignore
        <Button
          variant="contained"
          onClick={() => formik.handleSubmit()}
          disabled={!(formik.isValid && formik.dirty)}
        >
          Crea
        </Button>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%"  }}>
          <Button variant="contained" color="error" onClick={() => setEditable(false)}>
            Annulla
          </Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
          >
            Aggiorna
          </Button>
        </Box>
      )}
    </Box>
  );
}
