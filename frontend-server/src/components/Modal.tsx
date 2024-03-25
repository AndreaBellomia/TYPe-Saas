import React from "react";

import { Modal, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ComponentsProps {
  children: React.ReactElement;
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "60rem",
  backgroundColor: theme.palette.background.paper,
  padding: "1.5rem",
  borderRadius: "1rem",
  boxSizing: "border-box",

  [theme.breakpoints.up("md")]: {
    width: "75%",
  },
  [theme.breakpoints.up("xl")]: {
    width: "50%",
  },
}));

export default function _({ children, state }: ComponentsProps) {
  const [open, setOpen] = state;

  const handlerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Modal open={open} onClose={handlerToggle}>
        <ModalBox>{children}</ModalBox>
      </Modal>
    </>
  );
}
