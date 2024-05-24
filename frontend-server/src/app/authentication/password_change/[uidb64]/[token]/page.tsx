"use client";
import { useParams, useRouter } from "next/navigation";

import { useFormik } from "formik";
import * as Yup from "yup";

import { styled } from "@mui/material/styles";
import { Button, Paper, Box, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

import TextField from "@/components/forms/TextField";
import { URLS } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";

const CenterCard = styled(Box)(({ theme }) => ({
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
}));

export default function _() {
  const params = useParams();
  const router = useRouter();

  const formValidation = Yup.object().shape({
    password: Yup.string().min(2, "Troppo breve!").max(100, "Troppo lunga").required("Campo obbligatorio"),
    password2: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      password2: "",
    },
    validationSchema: formValidation,
    onSubmit: async (values, helpers) => {
      const response = await fetch(URLS.API_SERVER + "/authentication/password_reset_confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uidb64: params.uidb64,
          token: params.token,
          password1: values.password,
          password2: values.password2,
        }),
      });
      
      if (response.status === 400) {
        const data = await response.json();
        helpers.setFieldError("password2", data.non_field_errors);
        return;
      }

      if (response.status === 200) {
        snack.success("Password cambiata con successo!");
        router.push("/login");
        return;
      }

      snack.error("Errore, se il problema persiste contattare un amministratore!");
    },
  });

  return (
    <>
      <CenterCard>
        <form>
          <Box textAlign="center" padding={3}>
            <Typography variant="h3" gutterBottom>
              Password Reset
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              Inserisci la nuova password per il tuo account.
            </Typography>

            <Box sx={{ my: 3 }} />

            <TextField required label="Password" name="password" type="password" formik={formik} />

            <Box sx={{ my: 3 }} />

            <TextField required label="Conferma Password" name="password2" type="password" formik={formik} />

            <Box sx={{ my: 3 }} />

            <Button
              variant="contained"
              onClick={() => formik.handleSubmit()}
              disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
              fullWidth
            >
              Conferma
            </Button>

            <Box sx={{ my: 3 }} />

            <Button href="/authentication/login" startIcon={<ArrowBackIosRoundedIcon />}>
              Torna al login
            </Button>
          </Box>
        </form>
      </CenterCard>
    </>
  );
}
