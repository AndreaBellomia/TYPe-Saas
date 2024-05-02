"use client";
// @ts-ignore
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { useFormik } from "formik";
import { JWT_EXPIRE, JWT_TOKEN } from "@/libs/auth";

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
      const response = await fetch(URLS.API_SERVER + "/authentication/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();

        sessionStorage.setItem(JWT_TOKEN, data.token);
        sessionStorage.setItem(JWT_EXPIRE, data.expiry);
        dispatch({ type: "USER_SET", payload: data.user });
        router.push("/user/ticket");
        return;
      }

      helpers.setFieldError("password", "Email o password non sono corretti");
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
