import { useFormik } from "formik";
import * as Yup from "yup";

import { TextField } from "@/components/forms";
import Modal from "@/components/Modal";
import { Typography, Button, Box } from '@mui/material'

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
          <Typography gutterBottom variant="h4">Crea un nuovo utente</Typography>

          <Typography variant="body2">Verrà inviata una email all&apos;indirizzo specificato. L&apos;utente potrà utilizzare la password comunicata via email per entrare nell&apos;app. </Typography>
          <Typography variant="body2">E consigliabile aggiornare la password una volta effettuato il login dalla sezione profilo.</Typography>

          <Box my={2}/>

          <TextField
            type="email"
            name="email"
            label="Email"
            required
            formik={formik}
          />

          <Box my={2}/>

          <Button onClick={formik.handleSubmit} variant="contained">Crea</Button>
        </>
      </Modal>
    </>
  );
}

export default CreateUserModal;
