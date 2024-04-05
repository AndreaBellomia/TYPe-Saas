"use client";
import { Formik } from "formik";
import { snack } from "@/libs/SnakClient";
import { AuthUtility } from "@/libs/auth";

import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { TextField, Button, Paper, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const CenterCard = styled(Box)(({ theme }) => ({
  top: "50%",
  left: "50%",
  position: "relative",

  transform: "translate(-50%, -50%)",

  maxWidth: 600
}));

export default function _() {
  const router = useRouter();

  return (
    <>
      <CenterCard>
        <Paper elevation={4}>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string()
                .min(2, "Troppo breve!")
                .max(100, "Troppo lunga")
                .required("Campo obbligatorio"),
              email: Yup.string()
                .email("Email non valida")
                .required("Campo obbligatorio"),
            })}
            onSubmit={(values, helpers) => {
              AuthUtility.loginUser(values.email, values.password).then(
                (response: Response) => {
                  if (response.ok) {
                    router.push("/user/ticket");
                  }
                  helpers.setFieldError("password", response.statusText)
                },
              );
            }}
          >
            {({
              values,
              errors,
              touched,
              dirty,
              isValid,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Box sx={{ display: "flex", flexDirection: "column", p: 5, alignItems: "center" }}>
                <Typography variant="h4">Login</Typography>

                <Box sx={{ my: 2 }} />

                <TextField
                  sx={{ width : "100%" }}
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  error={!!(errors.email && touched.email)}
                  helperText={touched.email && errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />

                <Box sx={{ my: 2 }} />

                <TextField
                  sx={{ width : "100%" }}
                  label="Password"
                  variant="outlined"
                  name="password"
                  type="password"
                  error={!!(errors.password && touched.password)}
                  helperText={touched.password && errors.password}
                  onChange={handleChange}
                  value={values.password}
                />

                <Box sx={{ my: 2 }} />

                {/*  @ts-ignore */}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!(isValid && dirty)}
                >
                  Login
                </Button>
              </Box>
            )}
          </Formik>
        </Paper>
      </CenterCard>
    </>
  );
}
