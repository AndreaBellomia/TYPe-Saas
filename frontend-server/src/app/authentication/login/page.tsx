"use client";
// @ts-ignore
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { signIn } from "next-auth/react";

import { useFormik } from "formik";

import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Button, Paper, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { UserModel } from "@/models/User";

import TextField from "@/components/forms/TextField";
import { snack } from "@/libs/SnakClient";
import { URLS } from "@/libs/fetch";

const CenterCard = styled(Box)(({ theme }) => ({
  top: "50%",
  left: "50%",
  position: "relative",

  transform: "translate(-50%, -50%)",

  maxWidth: 600,
}));

export default function _() {
  const router = useRouter();
  const user: UserModel | null = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

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

      if (response === undefined) {
        snack.error("Errore, se il problema persiste contattare un amministratore!");
        return;
      }

      if (response.ok) {
        router.push(response.url || "/user/ticket");
        return;
      }

      helpers.setFieldError("password", "Email o password non corretti.");
    },
  });

  return (
    <>
      <CenterCard>
        <Paper elevation={4}>
          <form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 5,
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Login</Typography>

              <Box sx={{ my: 2 }} />

              <TextField required label="Email" name="email" type="email" formik={formik} />

              <Box sx={{ my: 2 }} />

              <TextField required label="Password" name="password" type="password" formik={formik} />

              <Box sx={{ my: 2 }} />

              {/*  @ts-ignore */}
              <Button variant="contained" onClick={formik.handleSubmit} disabled={!(formik.isValid && formik.dirty)}>
                Login
              </Button>
            </Box>
          </form>
        </Paper>
      </CenterCard>
    </>
  );
}
