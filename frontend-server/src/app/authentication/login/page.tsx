"use client";
import { Formik } from "formik";
import { TextField, Button } from "@mui/material";
import { useRouter, AppRouterInstance } from "next/navigation";

import * as Yup from "yup";

import { AuthUtility } from "@/libs/auth";

export default function _() {
  const router: AppRouterInstance = useRouter();

  return (
    <>
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
        onSubmit={(values) => {
          AuthUtility.loginUser(values.email, values.password).then((value: boolean) => {
            if (value) {
              router.push("/");
            }
          });
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
          <form>
            <TextField
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

            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              error={!!(errors.password && touched.password)}
              helperText={touched.password && errors.password}
              onChange={handleChange}
              value={values.password}
            />

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!(isValid && dirty)}
            >
              Login !
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
}
