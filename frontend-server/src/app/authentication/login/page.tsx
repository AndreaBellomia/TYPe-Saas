"use client";
import { signIn } from "next-auth/react";

import { useFormik } from "formik";

import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, Divider, Link, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";

import TextField from "@/components/forms/TextField";
import { snack } from "@/libs/SnakClient";

const CenterCard = styled(Box)(({ theme }) => ({
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
}));

export default function _() {
  const router = useRouter();

  const formValidation = Yup.object().shape({
    password: Yup.string().min(2, "Troppo breve!").max(100, "Troppo lunga").required("Campo obbligatorio"),
    email: Yup.string().email("Email non valida").required("Campo obbligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formValidation,
    onSubmit: async (values, helpers) => {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response && response.ok) {
        router.push(response.url || "/user/ticket");
        return;
      }

      switch (response && response.error) {
        case "WrongCredentials":
          helpers.setFieldError("password", "Email o password non corretti.");
          break;
        default:
          snack.error("Errore, se il problema persiste contattare un amministratore!");
          helpers.setSubmitting(false);
          break;
      }
    },
  });

  return (
    <>
      <CenterCard>
        <Box padding={3} textAlign="center">
          <form>
            <Box textAlign="center">
              <Typography variant="h3">Benvenuto</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Inserisci le tue informazioni di accesso.
              </Typography>

              <Box my={3} />

              <TextField required label="Email" name="email" type="email" formik={formik} autoComplete="username" />

              <Box my={3} />

              <TextField
                required
                label="Password"
                name="password"
                type="password"
                formik={formik}
                autoComplete="current-password"
              />
              <Box display="flex" justifyContent="end">
                <FormHelperText>
                  <Link href="/authentication/password_change" underline="none">
                    Password dimenticata
                  </Link>
                </FormHelperText>
              </Box>

              <Box my={1} />

              <Button
                variant="contained"
                onClick={() => formik.handleSubmit()}
                disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
                fullWidth
              >
                Login
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" color="text.secondary">
            Se non hai un account, richiedi all&apos;amministratore di inviarti un invito.
          </Typography>
        </Box>
      </CenterCard>
    </>
  );
}
