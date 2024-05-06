"use client";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Box, Paper, Grid, Chip } from "@mui/material";

import Avatar from "@/components/Avatar";
import TextField from "@/components/forms/TextField";
import { UserModel, PermissionGroupTag } from "@/models/User";

import { useDjangoApi, FetchDispatchError } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";

function UserCardComponent({ user }: { user: UserModel }) {
  const api = useDjangoApi();
  const formValidation = Yup.object().shape({
    first_name: Yup.string().max(100, "Nome troppo lungo").required("Campo obbligatorio"),
    last_name: Yup.string().max(100, "Nome troppo corto").required("Campo obbligatorio"),
    phone_number: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
    },
    validationSchema: formValidation,
    onSubmit: (values, helpers) => {
      api.put(
        `/authentication/users/${user.id}/`,
        () => {
          snack.success("Informazioni cambiata correttamente!");
        },
        (error) => {
          console.log(error);
          const data = error.response.data;
          Object.keys(data).forEach((key) => {
            helpers.setFieldError(key, data[key]);
          });
          throw new FetchDispatchError("Errore, si prega di riprovare!");
        },
        {
          user_info: { ...values },
        },
      );
    },
  });

  useEffect(() => {
    if (user !== null && typeof user.user_info === "object" && user.user_info !== null) {
      // @ts-ignore
      Object.keys(user.user_info).forEach((key: string) => {
        // @ts-ignore
        formik.setFieldValue(key, user.user_info[key]);
      });
    }
  }, [user]);

  return (
    <>
      <Paper elevation={5} sx={{ width: "100%" }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              {user && <Avatar user={user} dimension={60} typographyProps={{ variant: "h4" }} />}
            </Grid>
            <Grid item xs={6} textAlign="end" alignSelf="center">
              {user &&
                (user.is_active ? (
                  <Chip label="Attivo" color="success" />
                ) : (
                  <Chip label="Non attivo" color="warning" />
                ))}

              {user && user.is_staff && <Chip label="Staff" color="info" sx={{ ml: 1 }} />}

              {user &&
                user.groups.map((e, i) => (
                  <Chip label={PermissionGroupTag[e]} color="secondary" key={i} sx={{ ml: 1 }} />
                ))}
            </Grid>

            <Grid item xs={12}>
              <TextField required label="Nome" name="first_name" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <TextField required label="Cognome" name="last_name" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <TextField required label="Numero di telefono" name="phone_number" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12} textAlign="end">
              {/* @ts-ignore */}
              <Button variant="contained" disabled={!(formik.isValid && formik.dirty)} onClick={formik.handleSubmit}>
                Aggiorna
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}

export default UserCardComponent;
