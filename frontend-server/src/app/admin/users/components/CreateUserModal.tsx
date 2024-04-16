import { useFormik } from "formik";
import * as Yup from "yup";

import { TextField } from "@/components/forms";
import Modal from "@/components/Modal";
import { Typography, Button } from '@mui/material'

import { DjangoApi } from "@/libs/fetch";

const API = new DjangoApi()

export interface CreateUserModalProps {
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export function CreateUserModal({ state }: CreateUserModalProps) {

  const [open, setOpen] = state

  const formValidation = Yup.object().shape({
    email: Yup.string()
      .email("Email non valida")
      .required("Campo obbligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: formValidation,
    onSubmit: (values, helpers) => {
      API.post("authentication/register", 
      (response) => {
        setOpen(false)
      }, 
      () => {

      }, {
        ...values
      })
    },
  });

  return (
    <>
      <Modal state={state}>
        <>
          <Typography variant="h3">Crea un nuovo utente</Typography>

          <TextField
            type="email"
            name="email"
            label="Email"
            required
            formik={formik}
          />

          <Button onClick={formik.handleSubmit}>Crea</Button>
        </>
      </Modal>
    </>
  );
}

export default CreateUserModal;
