"use-client";
import React, { useEffect, useState } from "react";

import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";

import {
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  IconButton,
  Grid,
} from "@mui/material";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UTurnLeftRoundedIcon from "@mui/icons-material/UTurnLeftRounded";

import DatePicker, { parseDateValue } from "@/components/DatePicker";
import { Autocomplete, TextField } from "@/components/forms";

import { StatusesType, Ticket } from "@/models/Ticket";
import { UserModel, PermissionGroup } from "@/models/User";

import { snack } from "@/libs/SnakClient";
import { hasGroupPermission } from "@/libs/auth";
import { DjangoApi, FetchDispatchError, useDjangoApi } from "@/libs/fetch";
import { TICKET_STATUSES } from "@/constants";
import { useSession } from "next-auth/react";

function errorsHandler(helpers: FormikHelpers<any>, errors: { [key: string]: string }): void {
  Object.keys(errors).forEach((key) => {
    helpers.setFieldError(key, errors[key]);
  });
}

export interface DrawerFormProps {
  handlerCloseDrawer: () => void;
  initial: {
    id: string | null
    state: StatusesType | null
  };
}

export function DrawerForm({ handlerCloseDrawer, initial }: DrawerFormProps) {
  const api = useDjangoApi();

  const session = useSession()
  const user = session.data?.user_data;

  const partial = hasGroupPermission(user, PermissionGroup.MANAGER);
  const [types, setTypes] = useState<{ label: string; id: number }[]>([]);
  const [users, setUsers] = useState<{ label: string; id: number }[]>([]);
  const [admins, setAdmins] = useState<{ label: string; id: number }[]>([]);
  const [data, setData] = useState<Ticket | null>(null);

  const validation = Yup.object().shape({
    label: Yup.string().min(10, "Troppo breve!").max(100, "Troppo lunga").required("Campo obbligatorio"),
    expiring_date: Yup.date().required("Campo obbligatorio"),
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
        .nullable()
        .oneOf(
          admins.map((admin) => admin.id),
          "Il valore inserito non è valido!",
        ),
    }),
  });

  const formFields = {
    label: "",
    expiring_date: "",
    description: "",
    status: initial.state || TICKET_STATUSES.BACKLOG,
    created_by_id: null,
    type_id: null,
    ...(partial && { assigned_to_id: null }),
  };

  const formik = useFormik({
    initialValues: formFields,
    validationSchema: validation,
    onSubmit: (values, helpers) => {
      if (initial.id !== null) {
        api.put(
          `/ticket/admin/${initial.id}/`,
          () => {
            helpers.resetForm();
            snack.success(`Ticket numero ${initial.id} è stato aggiornato`);
            handlerCloseDrawer();
          },
          (error) => {
            console.error(error);
            errorsHandler(helpers, error.response.data);
            throw new FetchDispatchError("Errore, si prega di riprovare!");
          },
          values,
        );
      } else {
        api.post(
          "/ticket/admin/",
          () => {
            helpers.resetForm();
            snack.success("Nuovo ticket creato");
            handlerCloseDrawer();
          },
          (error) => {
            console.error(error);
            errorsHandler(helpers, error.response.data);
            throw new FetchDispatchError("Errore, si prega di riprovare!");
          },
          values,
        );
      }
    },
  });

  useEffect(() => {
    initial.id !== null &&
      api.get(
        `/ticket/admin/${initial.id}/`,
        (response) => {
          const data: Ticket = response.data;
          setData(data);
          Object.keys(formik.values).forEach((value: string) => {
            formik.setFieldValue(value as keyof Ticket, data[value as keyof Ticket]);
          });
        },
        () => {
          throw new FetchDispatchError("Errore durante il recupero dei dati, riprova più tardi.");
        },
      );
  }, [initial.id]);

  useEffect(() => {
    api.get(
      "ticket/types/list",
      (response) => {
        const data: Array<any> = response.data;
        setTypes(data.map((e) => ({ label: e.name, id: e.id })));
      },
      (e) => {
        throw new FetchDispatchError("Errore durante il recupero dei tipo, riprova più tardi.");
      },
    );

    api.get(
      "authentication/users/small/",
      (response) => {
        const data: Array<any> = response.data;
        setUsers(data.map((e) => ({ label: e.email, id: e.id })));
      },
      () => {
        throw new FetchDispatchError("Errore durante il recupero degli utenti, riprova più tardi.");
      },
    );

    partial &&
      api.get(
        DjangoApi.buildURLparams("authentication/users/small/", [{ param: "admin_only", value: "true" }]),
        (response) => {
          const data: Array<any> = response.data;
          setAdmins(data.map((e) => ({ label: e.email, id: e.id })));
        },
        (e) => {
          throw new FetchDispatchError("Errore durante il recupero degli amministratori, riprova più tardi.");
        },
      );
  }, [initial.id]);

  const handlerUndo = () => {
    if (data !== null) {
      Object.keys(formik.values).forEach((value: string) => {
        formik.setFieldValue(value as keyof Ticket, data[value as keyof Ticket]);
      });
    } else {
      formik.resetForm();
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" px={4} pt={2}>
        <Typography variant="h4">{data ? data.label : "Nuovo Ticket"}</Typography>

        <IconButton onClick={() => {}} color="error" disabled>
          <DeleteRoundedIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3, mt: 2 }} />

      <Box px={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField name="label" type="text" label="Tipo" formik={formik} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="description" type="text" label="Descrizione" formik={formik} maxRows={10} />
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={8}>
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
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
          {partial ? (
            <Grid item xs={12} md={6}>
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
            </Grid>
          ) : (
            <Grid xs={12} md={6}></Grid>
          )}
          <Grid item xs={6}>
            <IconButton onClick={handlerUndo} color="error">
              <UTurnLeftRoundedIcon sx={{ transform: "rotate(90deg)" }} />
            </IconButton>
          </Grid>
          {data ? (
            <Grid item xs={6} textAlign="end">
              <Button variant="contained" onClick={() => formik.handleSubmit()}>
                Salva
              </Button>
            </Grid>
          ) : (
            <Grid item xs={6} textAlign="end">
              <Button
                variant="contained"
                onClick={() => formik.handleSubmit()}
                disabled={!(formik.isValid && formik.dirty)}
              >
                Crea
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default DrawerForm;
