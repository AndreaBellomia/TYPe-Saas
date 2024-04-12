import { useFormik } from "formik";
import * as Yup from "yup";




export function CreateUserModal () {

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
        },
      });

    return (
        <>
        </>
    )
}

export default CreateUserModal;