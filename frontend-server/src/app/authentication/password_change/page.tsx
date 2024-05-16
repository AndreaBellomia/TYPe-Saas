"use client";
import { useState } from "react";
import { useFormik } from "formik";

import * as Yup from "yup";

import { styled } from "@mui/material/styles";
import { Button, Box, Typography, Divider } from "@mui/material";
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
  const [emailSent, setEmailSent] = useState(false);

  const formValidation = Yup.object().shape({
    email: Yup.string().email("Email non valida").required("Campo obbligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: formValidation,
    onSubmit: async (values, helpers) => {
      const response = await fetch(URLS.API_SERVER + "/authentication/password_reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      if (!response.ok) {
        snack.error("Errore, se il problema persiste contattare un amministratore!");
        return;
      }

      setEmailSent(true);
    },
  });

  return (
    <>
      <CenterCard>
        {!emailSent ? (
          <Box textAlign="center" padding={3}>
            <form>
              <Typography variant="h3" gutterBottom>
                Password dimenticata
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Per recuperare la password, inserisci il tuo indirizzo email.
              </Typography>

              <Box sx={{ my: 3 }} />

              <TextField required label="Email" name="email" type="email" formik={formik} />

              <Box sx={{ my: 3 }} />

              <Button
                variant="contained"
                onClick={() => formik.handleSubmit()}
                disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
                fullWidth
              >
                Conferma
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" color="text.secondary">
              Se il tuo indirizzo email è stato registrato, riceverai un&apos;email con il link per ripristinare la
              password.
            </Typography>

            <Box sx={{ my: 3 }} />

            <Button href="/authentication/login" startIcon={<ArrowBackIosRoundedIcon />}>
              Torna al login
            </Button>
          </Box>
        ) : (
          <Box textAlign="center" padding={3}>
            <Typography variant="h3" gutterBottom>
              Password dimenticata
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Ti è stata inviata una email all&apos;indirizzo indicato, utilizza il link per ripristinare la password
            </Typography>

            <Box sx={{ my: 3 }} />

            <Button href="/authentication/login" startIcon={<ArrowBackIosRoundedIcon />}>
              Torna al login
            </Button>
          </Box>
        )}
      </CenterCard>
    </>
  );
}
