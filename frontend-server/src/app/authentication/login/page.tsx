"use client";
import { useFormik } from "formik";
import { AuthUtility } from "@/libs/auth";

import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Button, Paper, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import TextField from "@/components/forms/TextField";

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
    password: Yup.string()
      .min(2, "Troppo breve!")
      .max(100, "Troppo lunga")
      .required("Campo obbligatorio"),
    email: Yup.string()
      .email("Email non valida")
      .required("Campo obbligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formValidation,
    onSubmit: (values, helpers) => {
      AuthUtility.loginUser(values.email, values.password).then(
        (response: Response) => {
          if (response.ok) {
            router.push("/user/ticket");
          } else {
            helpers.setFieldError("password", response.statusText);
          }
        },
      );
    },
  });

  return (
    <>
      <CenterCard>
        <Paper elevation={4}>
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

            <TextField
              required
              label="Email"
              name="email"
              type="email"
              errors={formik.errors}
              touched={formik.touched}
              values={formik.values}
              handleBlur={formik.handleBlur}
              handleChange={formik.handleChange}
            />

            <Box sx={{ my: 2 }} />

            <TextField
              required
              label="Password"
              name="password"
              type="password"
              errors={formik.errors}
              touched={formik.touched}
              values={formik.values}
              handleBlur={formik.handleBlur}
              handleChange={formik.handleChange}
            />

            <Box sx={{ my: 2 }} />

            {/*  @ts-ignore */}
            <Button
              variant="contained"
              onClick={formik.handleSubmit}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </CenterCard>
    </>
  );
}
