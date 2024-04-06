"use client"
import { useRouter } from "next/navigation";
import { Paper, Box, Grid, Chip, Button } from "@mui/material";
import Avatar from "@/components/Avatar";
import { GROUPS_MAPS } from "@/constants";
import { User } from "@/types";

import TextField from "@/components/forms/TextField";

import { useFormik } from "formik";
import * as Yup from "yup";
import { snack } from "@/libs/SnakClient";

import { DjangoApi, FetchDispatchError } from "@/libs/fetch";
import { useEffect } from "react";

const API = new DjangoApi();

export interface ProfileCardProps {
  user: User | null;
}

function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter()

  const formValidation = Yup.object().shape({
    first_name: Yup.string()
      .max(100, "Nome troppo lungo")
      .required("Campo obbligatorio"),
    last_name: Yup.string()
      .max(100, "Nome troppo corto")
      .required("Campo obbligatorio"),
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
      API.put(
        "/authentication/profile",
        () => {
          // helpers.resetForm();
          snack.success("Informazioni cambiata correttamente!");
          router.push("/user/profile")
        },

        (error) => {
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
    if (user !== null && user.user_info !== null) {
      Object.keys(user.user_info).forEach((key: string) => {
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
              {user && (
                <Avatar
                  user={user}
                  dimension={60}
                  typographyProps={{ variant: "h4" }}
                />
              )}
            </Grid>
            <Grid item xs={6} textAlign="end" alignSelf="center">
              {user &&
                (user.is_active ? (
                  <Chip label="Attivo" color="success" />
                ) : (
                  <Chip label="Non attivo" color="warning" />
                ))}

              {user && user.is_staff && <Chip label="Staff" color="info" />}

              {user &&
                user.groups.map((e, i) => (
                  <Chip label={GROUPS_MAPS[e]} color="secondary" key={i} />
                ))}
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                label="Nome"
                name="first_name"
                type="text"
                errors={formik.errors}
                touched={formik.touched}
                values={formik.values}
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Cognome"
                name="last_name"
                type="text"
                errors={formik.errors}
                touched={formik.touched}
                values={formik.values}
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Numero di telefono"
                name="phone_number"
                type="text"
                errors={formik.errors}
                touched={formik.touched}
                values={formik.values}
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} textAlign="end">
              {/* @ts-ignore */}
              <Button
                variant="contained"
                disabled={!(formik.isValid && formik.dirty)}
                onClick={formik.handleSubmit}
              >
                Aggiorna
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}

export default ProfileCard;
