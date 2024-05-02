"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { styled } from "@mui/material/styles";
import { Paper, Box, Grid, Chip, FormLabel } from "@mui/material";

import * as Yup from "yup";
import { useFormik } from "formik";

import Avatar from "@/components/Avatar";
import TextField from "@/components/forms/TextField";

import { snack } from "@/libs/SnakClient";
import { useDjangoApi, FetchDispatchError } from "@/libs/fetch";
import { UserModel, PermissionGroupTag } from "@/models/User";
import { ResponsiveButton } from "@/components/forms";

const TagContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "end",
  alignItems: "center",

  [theme.breakpoints.down("lg")]: {
    justifyContent: "start",
  },
}));

export interface ProfileCardProps {
  user: UserModel | null;
}

function ProfileCard({ user }: ProfileCardProps) {
  const api = useDjangoApi();
  const router = useRouter();

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
        "/authentication/update_profile/",
        () => {
          snack.success("Informazioni cambiata correttamente!");
          router.push("/user/profile");
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
            <Grid item xs={12} lg={6}>
              {user && <Avatar user={user} dimension={60} typographyProps={{ variant: "h4" }} />}
            </Grid>
            <Grid item xs={12} lg={6} component={TagContainer}>
              {user &&
                (user.is_active ? (
                  <Chip label="Attivo" color="success" />
                ) : (
                  <Chip label="Non attivo" color="warning" />
                ))}

              {user && user.is_staff && <Chip label="Staff" color="info" sx={{ ml: 1 }} />}

              {user &&
                user.groups.map((e, i) => (
                  <Chip sx={{ ml: 1 }} label={PermissionGroupTag[e]} color="secondary" key={i} />
                ))}
            </Grid>

            <Grid item xs={12}>
              <FormLabel>Nome</FormLabel>
              <TextField required name="first_name" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Cognome</FormLabel>
              <TextField required name="last_name" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Numero di telefono</FormLabel>
              <TextField required name="phone_number" type="text" formik={formik} />
            </Grid>
            <Grid item xs={12} textAlign="end">
              <ResponsiveButton
                variant="contained"
                disabled={!(formik.isValid && formik.dirty)}
                onClick={() => formik.handleSubmit()}
              >
                Salva
              </ResponsiveButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}

export default ProfileCard;
