"use client";
import { useFormik } from "formik";

import * as Yup from "yup";

import { Button, Paper, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField from "@/components/forms/TextField";
import { URLS } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";
import { useState } from "react";

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
        <Paper elevation={4}>
          {!emailSent ? (
            <form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 5,
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">Password Reset</Typography>

                <Typography variant="body2">Se la tua email è registrata verrà inviata una email!</Typography>

                <Box sx={{ my: 2 }} />

                <TextField required label="Email" name="email" type="email" formik={formik} />

                <Box sx={{ my: 2 }} />

                {/*  @ts-ignore */}
                <Button variant="contained" onClick={formik.handleSubmit} disabled={!(formik.isValid && formik.dirty)}>
                  Conferma
                </Button>
              </Box>
            </form>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 5,
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography variant="h4">Password Reset</Typography>

              <Box my={2} />

              <Typography variant="body2">
                Utilizza il link che e stato inviata alla tua casella di posta elettronica per impostare una nuova
                password.
              </Typography>
            </Box>
          )}
        </Paper>
      </CenterCard>
    </>
  );
}
